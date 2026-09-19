"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import { getSocket } from "@/lib/socket";
import apiClient from "@/lib/api";
import { getIceServers } from "@/lib/ice-servers";
import { ThemeToggle } from "@/components/theme-toggle";

// Signalling events these pages own. The socket is shared app-wide, so on
// unmount we detach exactly these instead of disconnecting the connection.
interface Participant {
  userId?: string;
  socketId: string;
  userName: string;
  userType: string;
}

const SIGNALLING_EVENTS = [
  "existing-participants",
  "user-joined",
  "offer",
  "answer",
  "ice-candidate",
  "user-left",
];

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  const sessionId = params.id as string;

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const socketRef = useRef<any>(null);
  const onSocketConnectRef = useRef<(() => void) | null>(null);
  const iceConfigRef = useRef<RTCConfiguration>({ iceServers: [] });
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      router.replace("/");
      return;
    }

    initializeCall();

    return () => {
      cleanup();
    };
  }, [user, authLoading, router]);

  // Rooms created from the schedule are named after the Session document, so the
  // student to ring has to be looked up. Older ad-hoc rooms encode the student id
  // as "room-<studentId>-<timestamp>", which stays supported as a fallback.
  const resolveStudentId = async (): Promise<string | null> => {
    if (/^[0-9a-fA-F]{24}$/.test(sessionId)) {
      try {
        const response = await apiClient.get(`/sessions/${sessionId}`);
        const session = response.data?.data?.session;
        return session?.studentId?._id || session?.studentId || null;
      } catch (error) {
        console.warn("Could not resolve session student:", error);
        return null;
      }
    }

    const legacyId = sessionId.replace("room-", "").split("-")[0];
    return legacyId || null;
  };

  const initializeCall = async () => {
    try {
      // Fetch ICE servers up front so every peer connection below uses the
      // same (ideally short-lived) TURN credentials.
      iceConfigRef.current = await getIceServers();

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect to Socket.IO
      const socket = getSocket();
      socketRef.current = socket;

      const onConnect = () => {
        setConnectionStatus("Connected");

        // Only the teacher rings the student. Previously every participant
        // emitted this on join, so a student joining rang themselves.
        if (user?.role === "Teacher") {
          resolveStudentId().then((studentId) => {
            if (!studentId) return;
            socket.emit("call-student", {
              studentId,
              teacherName: user?.name,
              roomId: sessionId,
            });
          });
        }

        // Join the session. The server derives identity from the handshake
        // token; these fields are routing hints, not authorisation.
        socket.emit("join-session", {
          sessionId,
          userId: user?._id,
          userName: user?.name,
          userType: user?.role,
        });
      };
      onSocketConnectRef.current = onConnect;
      socket.on("connect", onConnect);
      // The shared socket may already be connected, in which case "connect"
      // will never fire for us — join straight away.
      if (socket.connected) onConnect();

      socket.on("existing-participants", (participants: Participant[]) => {
        console.log("Existing participants:", participants);
        participants.forEach(({ socketId, userName, userType }: Participant) => {
          createPeerConnection(socketId, userName, userType, true);
        });
      });

      socket.on("user-joined", ({ userName, userType, socketId }: Participant) => {
        console.log(`User joined: ${userName}`);
        createPeerConnection(socketId, userName, userType, false);
      });

      socket.on("offer", async ({ from, offer }) => {
        console.log("Received offer from", from);
        if (!peerConnectionsRef.current[from]) {
          createPeerConnection(from, "Remote User", "Student", false);
        }
        const pc = peerConnectionsRef.current[from];
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      });

      socket.on("answer", async ({ from, answer }) => {
        console.log("Received answer from", from);
        const pc = peerConnectionsRef.current[from];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        console.log("Received ICE candidate from", from);
        const pc = peerConnectionsRef.current[from];
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("user-left", ({ userId }) => {
        console.log("User left:", userId);
        if (peerConnectionsRef.current[userId]) {
          peerConnectionsRef.current[userId].close();
          delete peerConnectionsRef.current[userId];
        }
        setRemoteUsers((prev) => prev.filter((u) => u.id !== userId));
        
        // Show notification that user left
        setConnectionStatus("User disconnected");
        setTimeout(() => {
          setConnectionStatus("Connected");
        }, 3000);
      });

    } catch (error) {
      console.warn("Error initializing call:", error);
      setConnectionStatus("Error: Camera/Microphone access denied");
    }
  };

  const createPeerConnection = (
    socketId: string,
    userName: string,
    userType: string,
    isInitiator: boolean
  ) => {
    const pc = new RTCPeerConnection(iceConfigRef.current);
    peerConnectionsRef.current[socketId] = pc;

    // Add local stream tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("Received remote track");
      const remoteStream = event.streams[0];
      
      setRemoteUsers((prev) => {
        const existing = prev.find((u) => u.id === socketId);
        if (existing) return prev;
        return [...prev, { id: socketId, name: userName, type: userType, stream: remoteStream }];
      });

      // Set remote video
      setTimeout(() => {
        const videoEl = remoteVideoRefs.current[socketId];
        if (videoEl && remoteStream) {
          videoEl.srcObject = remoteStream;
        }
      }, 100);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        console.log("Peer connection established with", socketId);
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
        console.log("Peer connection lost with", socketId);
        setRemoteUsers((prev) => prev.filter((u) => u.id !== socketId));
        if (peerConnectionsRef.current[socketId]) {
          delete peerConnectionsRef.current[socketId];
        }
      }
    };

    // Create offer if initiator
    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socketRef.current?.emit("offer", {
            to: socketId,
            offer: pc.localDescription,
          });
        })
        .catch((error) => console.warn("Error creating offer:", error));
    }

    return pc;
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleAudioOnly = () => {
    setAudioOnly(!audioOnly);
    if (!audioOnly) {
      // Switching to audio-only: disable video
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = false;
          setIsVideoEnabled(false);
        }
      }
    } else {
      // Switching back to video: enable video
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = true;
          setIsVideoEnabled(true);
        }
      }
    }
  };

  const endCall = () => {
    cleanup();
    router.back();
  };

  const cleanup = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};

    // Disconnect socket
    // The socket is shared app-wide — leave the room and drop this page's
    // listeners rather than tearing the whole connection down.
    if (socketRef.current) {
      socketRef.current.emit("leave-session", { sessionId });
      SIGNALLING_EVENTS.forEach((event) => socketRef.current?.off(event));
      socketRef.current.off("connect", onSocketConnectRef.current!);
      socketRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border-2 border-blue-500">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-white font-semibold">Video Session</h1>
              <div className="flex items-center gap-2">
                <Badge variant={connectionStatus === "Connected" ? "default" : "destructive"} className="text-xs">
                  {connectionStatus}
                </Badge>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {remoteUsers.length + 1} participants
                </span>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Local Video */}
          <Card className="bg-gray-800 border-gray-700 relative overflow-hidden aspect-video">
            <CardContent className="p-0 h-full">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">You ({user?.role})</span>
              </div>
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remote Videos */}
          {remoteUsers.map((remoteUser) => (
            <Card key={remoteUser.id} className="bg-gray-800 border-gray-700 relative overflow-hidden aspect-video">
              <CardContent className="p-0 h-full">
                <video
                  ref={(el) => {
                    if (el) remoteVideoRefs.current[remoteUser.id] = el;
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {remoteUser.name} ({remoteUser.type})
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 rounded-full px-6 py-4 shadow-2xl border border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>

            <Button
              variant={audioOnly ? "secondary" : "outline"}
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={toggleAudioOnly}
              title={audioOnly ? "Switch to Video Call" : "Switch to Audio Only"}
            >
              {audioOnly ? <Mic className="h-6 w-6" /> : <Video className="h-5 w-5" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
              onClick={endCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
