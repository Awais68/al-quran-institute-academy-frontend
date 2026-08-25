"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Send,
  Maximize,
  Minimize
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  userId: string;
  userName: string;
  userType: string;
  socketId: string;
  stream?: MediaStream;
  audioMuted?: boolean;
  videoHidden?: boolean;
}

interface ChatMessage {
  message: string;
  userName: string;
  userId: string;
  timestamp: string;
}

interface VideoCallProps {
  sessionId: string;
  userId: string;
  userName: string;
  userType: "Student" | "Teacher" | "Admin";
  onEnd?: () => void;
}

export default function VideoCall({
  sessionId,
  userId,
  userName,
  userType,
  onEnd
}: VideoCallProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const ICE_SERVERS = {
    iceServers: [
      {
        urls: "turn:101.53.235.94:3478",
        username: "awais",
        credential: "awais123"
      },
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, []);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect to Socket.IO
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
        withCredentials: true
      });

      newSocket.on("connect", () => {
        console.log("Connected to signaling server");
        newSocket.emit("join-session", { sessionId, userId, userName, userType });
      });

      newSocket.on("existing-participants", (existingParticipants: Participant[]) => {
        existingParticipants.forEach(participant => {
          createPeerConnection(participant, newSocket, stream, true);
        });
      });

      newSocket.on("user-joined", (participant: Participant) => {
        toast({
          title: "User Joined",
          description: `${participant.userName} joined the session`
        });
        createPeerConnection(participant, newSocket, stream, false);
      });

      newSocket.on("offer", async ({ from, offer }) => {
        const pc = peerConnections.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          newSocket.emit("answer", { to: from, answer, from: newSocket.id });
        }
      });

      newSocket.on("answer", async ({ from, answer }) => {
        const pc = peerConnections.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      newSocket.on("ice-candidate", async ({ from, candidate }) => {
        const pc = peerConnections.get(from);
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      newSocket.on("user-left", ({ userId: leftUserId, userName: leftUserName }) => {
        toast({
          title: "User Left",
          description: `${leftUserName} left the session`,
          variant: "destructive"
        });
        removePeer(leftUserId);
      });

      newSocket.on("chat-message", (msg: ChatMessage) => {
        setChatMessages(prev => [...prev, msg]);
      });

      newSocket.on("user-audio-toggle", ({ userId: toggledUserId, muted }) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          const participant = updated.get(toggledUserId);
          if (participant) {
            participant.audioMuted = muted;
            updated.set(toggledUserId, participant);
          }
          return updated;
        });
      });

      newSocket.on("user-video-toggle", ({ userId: toggledUserId, hidden }) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          const participant = updated.get(toggledUserId);
          if (participant) {
            participant.videoHidden = hidden;
            updated.set(toggledUserId, participant);
          }
          return updated;
        });
      });

      setSocket(newSocket);
    } catch (error) {
      console.warn("Error initializing call:", error);
      toast({
        title: "Error",
        description: "Failed to access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const createPeerConnection = (
    participant: Participant,
    socket: Socket,
    stream: MediaStream,
    initiator: boolean
  ) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle incoming stream
    pc.ontrack = (event) => {
      setParticipants(prev => {
        const updated = new Map(prev);
        updated.set(participant.socketId, {
          ...participant,
          stream: event.streams[0]
        });
        return updated;
      });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: participant.socketId,
          candidate: event.candidate,
          from: socket.id
        });
      }
    };

    setPeerConnections(prev => {
      const updated = new Map(prev);
      updated.set(participant.socketId, pc);
      return updated;
    });

    // If initiator, create and send offer
    if (initiator) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", {
            to: participant.socketId,
            offer: pc.localDescription,
            from: socket.id
          });
        });
    }
  };

  const removePeer = (peerId: string) => {
    const pc = peerConnections.get(peerId);
    if (pc) {
      pc.close();
      setPeerConnections(prev => {
        const updated = new Map(prev);
        updated.delete(peerId);
        return updated;
      });
    }
    setParticipants(prev => {
      const updated = new Map(prev);
      updated.delete(peerId);
      return updated;
    });
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioMuted(!audioTrack.enabled);
      
      if (socket) {
        socket.emit("toggle-audio", { sessionId, userId, muted: !audioTrack.enabled });
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoHidden(!videoTrack.enabled);
      
      if (socket) {
        socket.emit("toggle-video", { sessionId, userId, hidden: !videoTrack.enabled });
      }
    }
  };

  const shareScreen = async () => {
    try {
      if (!screenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnections.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        videoTrack.onended = () => {
          stopScreenShare();
        };

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setScreenSharing(true);
        if (socket) {
          socket.emit("start-screen-share", { sessionId, userId, userName });
        }
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.warn("Error sharing screen:", error);
    }
  };

  const stopScreenShare = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      peerConnections.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      setScreenSharing(false);
      if (socket) {
        socket.emit("stop-screen-share", { sessionId, userId });
      }
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim() && socket) {
      socket.emit("chat-message", {
        sessionId,
        message: chatInput,
        userName,
        userId
      });
      setChatInput("");
    }
  };

  const endCall = () => {
    if (socket) {
      socket.emit("leave-session", { sessionId, userId, userName });
      socket.disconnect();
    }
    cleanup();
    if (onEnd) onEnd();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    peerConnections.forEach(pc => pc.close());
    if (socket) {
      socket.disconnect();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Live Session</h2>
          <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-white border-green-500">
            <Users className="h-3 w-3 mr-1" />
            {participants.size + 1} participants
          </Badge>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 overflow-auto">
        {/* Local Video */}
        <Card className="relative bg-gray-800 border-2 border-blue-500">
          <CardContent className="p-0 aspect-video relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            {videoHidden && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{userName} (You)</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
              <p className="text-white text-sm">{userName} (You)</p>
            </div>
            {audioMuted && (
              <div className="absolute top-2 right-2 bg-red-500 p-1 rounded">
                <MicOff className="h-4 w-4 text-white" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Remote Videos */}
        {Array.from(participants.values()).map((participant) => (
          <Card key={participant.socketId} className="relative bg-gray-800">
            <CardContent className="p-0 aspect-video relative">
              <RemoteVideo participant={participant} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-3">
        <Button
          onClick={toggleAudio}
          variant={audioMuted ? "destructive" : "secondary"}
          size="lg"
          className="rounded-full h-14 w-14"
        >
          {audioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          onClick={toggleVideo}
          variant={videoHidden ? "destructive" : "secondary"}
          size="lg"
          className="rounded-full h-14 w-14"
        >
          {videoHidden ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>

        <Button
          onClick={shareScreen}
          variant={screenSharing ? "default" : "secondary"}
          size="lg"
          className="rounded-full h-14 w-14"
        >
          {screenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
        </Button>

        <Button
          onClick={() => setShowChat(!showChat)}
          variant="secondary"
          size="lg"
          className="rounded-full h-14 w-14"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>

        <Button
          onClick={toggleFullscreen}
          variant="secondary"
          size="lg"
          className="rounded-full h-14 w-14"
        >
          {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </Button>

        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="rounded-full h-14 w-14"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Chat</h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-3">
                <p className="text-sm text-gray-400">{msg.userName}</p>
                <p className="text-white">{msg.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t border-gray-700 flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Type a message..."
              className="bg-gray-700 text-white border-gray-600"
            />
            <Button onClick={sendChatMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function RemoteVideo({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <>
      {participant.stream && !participant.videoHidden ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-2">
              <span className="text-3xl text-white font-bold">
                {participant.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white font-semibold">{participant.userName}</p>
            <Badge variant="outline" className="mt-2">{participant.userType}</Badge>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
        <p className="text-white text-sm">{participant.userName}</p>
      </div>
      {participant.audioMuted && (
        <div className="absolute top-2 right-2 bg-red-500 p-1 rounded">
          <MicOff className="h-4 w-4 text-white" />
        </div>
      )}
    </>
  );
}
