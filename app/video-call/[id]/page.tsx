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
import io from "socket.io-client";
import { ThemeToggle } from "@/components/theme-toggle";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "turn:101.53.235.94:3478",
      username: "awais",
      credential: "awais123",
    },
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

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

  const initializeCall = async () => {
    try {
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
      const socket = io("http://localhost:4000");
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to server");
        setConnectionStatus("Connected");

        // Extract student ID from sessionId (format: room-{studentId})
        const studentId = sessionId.replace('room-', '');

        // Notify student about incoming call
        socket.emit("call-student", {
          studentId,
          teacherName: user?.name,
          roomId: sessionId,
        });

        // Join the session
        socket.emit("join-session", {
          sessionId,
          userId: user?._id,
          userName: user?.name,
          userType: user?.role,
        });
      });

      socket.on("existing-participants", (participants) => {
        console.log("Existing participants:", participants);
        participants.forEach(({ userId, socketId, userName, userType }) => {
          createPeerConnection(socketId, userName, userType, true);
        });
      });

      socket.on("user-joined", ({ userId, userName, userType, socketId }) => {
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

      socket.on("disconnect", () => {
        setConnectionStatus("Disconnected");
        // Clean up all connections
        Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
        peerConnectionsRef.current = {};
        setRemoteUsers([]);
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
    const pc = new RTCPeerConnection(ICE_SERVERS);
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
    if (socketRef.current) {
      socketRef.current.disconnect();
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
