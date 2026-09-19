"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { getIceServers } from "@/lib/ice-servers";

/**
 * One mesh WebRTC session over the shared Socket.IO connection.
 *
 * /video-call/[id] and /session/[id] were two copies of the same signalling
 * code, so every bug had to be fixed twice and in practice was fixed in
 * neither. They now both call this.
 *
 * What was actually breaking calls:
 *
 * - ICE candidates arrive before the offer they belong to. `addIceCandidate`
 *   throws if the remote description is not set yet, so the candidate was
 *   dropped and the connection only came up when the race happened to go the
 *   other way. Candidates are now queued per peer until the description lands.
 * - `user-left` was matched against the peer-connection map, which is keyed by
 *   socket id, using the user id. It never matched, so a peer that left kept a
 *   frozen tile and a dead RTCPeerConnection.
 * - `leave-session` was emitted without a user id, so the server never removed
 *   the participant. The next join was handed that stale entry and opened a
 *   peer connection to a socket that no longer existed. (Fixed server-side
 *   too; this end no longer depends on it.)
 * - Nothing ever recovered from `iceConnectionState: failed`. An ICE restart
 *   is now attempted by whichever side made the offer.
 */

export interface RemotePeer {
  socketId: string;
  userId?: string;
  name: string;
  role: string;
  stream: MediaStream | null;
  audioMuted: boolean;
  videoHidden: boolean;
}

export type CallStatus =
  | "connecting"
  | "waiting"
  | "connected"
  | "reconnecting"
  | "no-permission"
  | "no-device"
  | "failed";

interface Participant {
  userId?: string;
  socketId: string;
  userName?: string;
  userType?: string;
}

export interface UseWebRTCSessionOptions {
  sessionId: string;
  /** Null until auth resolves; the session only starts once it is known. */
  userId?: string | null;
  userName?: string;
  role?: string;
  /** Runs once the socket has joined the room — used to ring the other side. */
  onJoined?: (socket: ReturnType<typeof getSocket>) => void;
  /** Skip entirely (auth still loading, or the id is missing). */
  enabled?: boolean;
}

const SIGNALLING_EVENTS = [
  "existing-participants",
  "user-joined",
  "offer",
  "answer",
  "ice-candidate",
  "user-left",
  "user-audio-toggle",
  "user-video-toggle",
];

export function useWebRTCSession({
  sessionId,
  userId,
  userName,
  role,
  onJoined,
  enabled = true,
}: UseWebRTCSessionOptions) {
  const [status, setStatus] = useState<CallStatus>("connecting");
  const [peers, setPeers] = useState<RemotePeer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const iceConfigRef = useRef<RTCConfiguration>({ iceServers: [] });
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  /** Candidates that arrived before their remote description. */
  const pendingCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});
  /** Who offered to whom, so only the offerer restarts ICE. */
  const isOffererRef = useRef<Record<string, boolean>>({});
  /** socket id -> user id, so a legacy `user-left` can still be matched. */
  const peerUserIdsRef = useRef<Record<string, string>>({});

  // Read inside socket handlers without making them a dependency.
  const identityRef = useRef({ userId, userName, role });
  identityRef.current = { userId, userName, role };
  const onJoinedRef = useRef(onJoined);
  onJoinedRef.current = onJoined;

  const closePeer = useCallback((socketId: string) => {
    const pc = peerConnectionsRef.current[socketId];
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.close();
    }
    delete peerConnectionsRef.current[socketId];
    delete pendingCandidatesRef.current[socketId];
    delete isOffererRef.current[socketId];
    delete peerUserIdsRef.current[socketId];
    setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
  }, []);

  const toggleAudio = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsAudioEnabled(track.enabled);
    // Let the room grey out the tile instead of staring at a live picture of
    // someone who cannot be heard.
    socketRef.current?.emit("toggle-audio", {
      sessionId,
      userId: identityRef.current.userId,
      muted: !track.enabled,
    });
  }, [sessionId]);

  const toggleVideo = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsVideoEnabled(track.enabled);
    socketRef.current?.emit("toggle-video", {
      sessionId,
      userId: identityRef.current.userId,
      hidden: !track.enabled,
    });
  }, [sessionId]);

  /** Swap what every peer receives without renegotiating the whole session. */
  const replaceOutgoingVideo = useCallback((track: MediaStreamTrack | null) => {
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      sender?.replaceTrack(track).catch((error) => {
        console.warn("Could not replace the outgoing video track:", error);
      });
    });
  }, []);

  const stopScreenShare = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;
    replaceOutgoingVideo(cameraTrackRef.current);
    setIsScreenSharing(false);
    socketRef.current?.emit("stop-screen-share", {
      sessionId,
      userId: identityRef.current.userId,
    });
  }, [replaceOutgoingVideo, sessionId]);

  const startScreenShare = useCallback(async () => {
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = display;
      const [screenTrack] = display.getVideoTracks();
      replaceOutgoingVideo(screenTrack);
      setIsScreenSharing(true);
      socketRef.current?.emit("start-screen-share", {
        sessionId,
        userId: identityRef.current.userId,
        userName: identityRef.current.userName,
      });
      // The browser's own "Stop sharing" bar bypasses our button.
      screenTrack.addEventListener("ended", () => stopScreenShare());
    } catch (error) {
      // Cancelling the picker lands here; it is not a failure worth surfacing.
      console.warn("Screen share was not started:", error);
    }
  }, [replaceOutgoingVideo, sessionId, stopScreenShare]);

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) stopScreenShare();
    else startScreenShare();
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  useEffect(() => {
    if (!enabled || !sessionId || !userId) return;

    // React runs effects twice in development. Without this token the second
    // pass opens a second camera stream and a second set of listeners.
    let disposed = false;

    const attachPeerState = (pc: RTCPeerConnection, socketId: string) => {
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("ice-candidate", {
            to: socketId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        setPeers((prev) =>
          prev.map((p) => (p.socketId === socketId ? { ...p, stream } : p))
        );
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") setStatus("connected");
        if (pc.connectionState === "closed") closePeer(socketId);
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "disconnected") {
          setStatus("reconnecting");
          return;
        }
        if (pc.iceConnectionState !== "failed") return;

        // Only the side that offered may restart, otherwise both restart at
        // once and collide.
        if (!isOffererRef.current[socketId]) {
          setStatus("reconnecting");
          return;
        }
        setStatus("reconnecting");
        pc.createOffer({ iceRestart: true })
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socketRef.current?.emit("offer", { to: socketId, offer: pc.localDescription });
          })
          .catch((error) => console.warn("ICE restart failed:", error));
      };
    };

    const ensurePeerConnection = (
      socketId: string,
      name: string,
      peerRole: string,
      peerUserId?: string
    ) => {
      const existing = peerConnectionsRef.current[socketId];
      if (existing && existing.connectionState !== "closed") return existing;
      if (existing) closePeer(socketId);

      const pc = new RTCPeerConnection(iceConfigRef.current);
      peerConnectionsRef.current[socketId] = pc;
      if (peerUserId) peerUserIdsRef.current[socketId] = peerUserId;
      attachPeerState(pc, socketId);

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      setPeers((prev) =>
        prev.some((p) => p.socketId === socketId)
          ? prev
          : [
              ...prev,
              {
                socketId,
                userId: peerUserId,
                name: name || "Participant",
                role: peerRole || "",
                stream: null,
                audioMuted: false,
                videoHidden: false,
              },
            ]
      );

      return pc;
    };

    const flushPendingCandidates = async (socketId: string, pc: RTCPeerConnection) => {
      const queued = pendingCandidatesRef.current[socketId];
      if (!queued?.length) return;
      delete pendingCandidatesRef.current[socketId];
      for (const candidate of queued) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.warn("Queued ICE candidate rejected:", error);
        }
      }
    };

    const start = async () => {
      // Fetch ICE first so every peer connection below shares one set of
      // (short-lived) TURN credentials.
      try {
        iceConfigRef.current = await getIceServers();
      } catch {
        iceConfigRef.current = { iceServers: [] };
      }
      if (disposed) return;

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (error) {
        const name = (error as DOMException)?.name;
        if (name === "NotFoundError" || name === "OverconstrainedError") {
          // No camera is not the end of the call — try audio only.
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasCamera(false);
            setIsVideoEnabled(false);
          } catch {
            setStatus("no-device");
            return;
          }
        } else if (name === "NotAllowedError" || name === "SecurityError") {
          setStatus("no-permission");
          return;
        } else {
          console.warn("Could not open the camera or microphone:", error);
          setStatus("failed");
          return;
        }
      }

      if (disposed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
      setLocalStream(stream);
      setIsAudioEnabled(stream.getAudioTracks()[0]?.enabled ?? false);
      if (stream.getVideoTracks().length === 0) setHasCamera(false);

      const socket = getSocket();
      socketRef.current = socket;

      const onConnect = () => {
        setStatus((prev) => (prev === "connected" ? prev : "waiting"));
        socket.emit("join-session", {
          sessionId,
          userId: identityRef.current.userId,
          userName: identityRef.current.userName,
          userType: identityRef.current.role,
        });
        onJoinedRef.current?.(socket);
      };

      const onDisconnect = () => setStatus("reconnecting");

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      // The shared socket is usually already connected, in which case
      // "connect" never fires for this page.
      if (socket.connected) onConnect();

      // Whoever is already in the room when we arrive gets the offer; they
      // answer. That keeps exactly one offer per pair.
      socket.on("existing-participants", (participants: Participant[]) => {
        participants.forEach(({ socketId, userName: name, userType, userId: peerId }) => {
          if (!socketId) return;
          const pc = ensurePeerConnection(socketId, name ?? "", userType ?? "", peerId);
          isOffererRef.current[socketId] = true;
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => socket.emit("offer", { to: socketId, offer: pc.localDescription }))
            .catch((error) => console.warn("Could not offer to a participant:", error));
        });
      });

      socket.on("user-joined", ({ socketId, userName: name, userType, userId: peerId }: Participant) => {
        if (!socketId) return;
        ensurePeerConnection(socketId, name ?? "", userType ?? "", peerId);
      });

      socket.on("offer", async ({ from, offer }) => {
        if (!from || !offer) return;
        const pc = ensurePeerConnection(from, "", "");
        isOffererRef.current[from] = false;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          await flushPendingCandidates(from, pc);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { to: from, answer });
        } catch (error) {
          console.warn("Could not answer an offer:", error);
        }
      });

      socket.on("answer", async ({ from, answer }) => {
        const pc = peerConnectionsRef.current[from];
        if (!pc || !answer) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await flushPendingCandidates(from, pc);
        } catch (error) {
          console.warn("Could not apply an answer:", error);
        }
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        if (!from || !candidate) return;
        const pc = peerConnectionsRef.current[from];
        // Candidates routinely beat the description they belong to. Hold them
        // rather than letting addIceCandidate throw them away.
        if (!pc || !pc.remoteDescription) {
          (pendingCandidatesRef.current[from] ??= []).push(candidate);
          return;
        }
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.warn("ICE candidate rejected:", error);
        }
      });

      socket.on("user-left", ({ socketId, userId: leftUserId }) => {
        // Older servers only sent userId, which never matched a map keyed by
        // socket id. Accept either.
        const target =
          socketId ??
          Object.keys(peerUserIdsRef.current).find(
            (id) => peerUserIdsRef.current[id] === leftUserId
          );
        if (!target) return;
        closePeer(target);
        setPeers((prev) => {
          const next = prev.filter((p) => p.socketId !== target);
          if (next.length === 0) setStatus("waiting");
          return next;
        });
      });

      socket.on("user-audio-toggle", ({ userId: peerId, muted }) => {
        setPeers((prev) =>
          prev.map((p) => (p.userId === peerId ? { ...p, audioMuted: !!muted } : p))
        );
      });

      socket.on("user-video-toggle", ({ userId: peerId, hidden }) => {
        setPeers((prev) =>
          prev.map((p) => (p.userId === peerId ? { ...p, videoHidden: !!hidden } : p))
        );
      });

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    };

    let detachConnectHandlers: (() => void) | undefined;
    start().then((detach) => {
      if (disposed) detach?.();
      else detachConnectHandlers = detach;
    });

    return () => {
      disposed = true;
      detachConnectHandlers?.();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      cameraTrackRef.current = null;
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setLocalStream(null);

      Object.keys(peerConnectionsRef.current).forEach(closePeer);
      pendingCandidatesRef.current = {};
      isOffererRef.current = {};
      peerUserIdsRef.current = {};

      // The socket is shared app-wide: leave the room and drop this page's
      // listeners instead of disconnecting it.
      const socket = socketRef.current;
      if (socket) {
        socket.emit("leave-session", { sessionId, userId: identityRef.current.userId });
        SIGNALLING_EVENTS.forEach((event) => socket.off(event));
        socketRef.current = null;
      }
    };
  }, [enabled, sessionId, userId, closePeer]);

  return {
    status,
    peers,
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    hasCamera,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}
