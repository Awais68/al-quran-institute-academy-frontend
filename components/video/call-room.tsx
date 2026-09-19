"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSocket } from "@/lib/socket";
import { useWebRTCSession, type CallStatus } from "@/hooks/use-webrtc-session";

/**
 * The call screen shared by /video-call/[id] and /session/[id]. The two pages
 * differ only in their title and in who they ring on join, so everything else
 * lives here instead of being copy-pasted between them.
 */
interface CallRoomProps {
  sessionId: string;
  title: string;
  /** Called once the room is joined — used by the teacher to ring the student. */
  onJoined?: (socket: ReturnType<typeof getSocket>) => void;
}

const STATUS_TEXT: Record<CallStatus, string> = {
  connecting: "Connecting…",
  waiting: "Waiting for the other participant",
  connected: "Connected",
  reconnecting: "Reconnecting…",
  "no-permission": "Camera and microphone access was blocked",
  "no-device": "No camera or microphone found",
  failed: "Could not start the call",
};

const isFatal = (status: CallStatus) =>
  status === "no-permission" || status === "no-device" || status === "failed";

export function CallRoom({ sessionId, title, onJoined }: CallRoomProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);

  const {
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
  } = useWebRTCSession({
    sessionId,
    userId: user?._id ?? null,
    userName: user?.name,
    role: user?.role,
    onJoined,
    enabled: !authLoading && !!user,
  });

  if (!authLoading && !user) {
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
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
              <h1 className="text-white font-semibold">{title}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    status === "connected"
                      ? "default"
                      : isFatal(status)
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {status === "connecting" || status === "reconnecting" ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : null}
                  {STATUS_TEXT[status]}
                </Badge>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {peers.length + 1} participants
                </span>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {isFatal(status) && (
        <div className="mx-6 mt-6 rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {status === "no-permission"
            ? "Allow camera and microphone access for this site in your browser, then reload the page."
            : status === "no-device"
            ? "Connect a microphone (and a camera for video) and reload the page."
            : "Something went wrong starting the call. Reload the page to try again."}
        </div>
      )}

      <div className="p-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700 relative overflow-hidden aspect-video">
            <CardContent className="p-0 h-full">
              <video
                // Assign the stream as soon as the element exists; a timer-based
                // hand-off loses the race whenever React re-renders first.
                ref={(el) => {
                  if (el && el.srcObject !== localStream) el.srcObject = localStream;
                }}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                  You ({user?.role})
                </span>
                {!isAudioEnabled && (
                  <span className="bg-red-600/80 rounded-full p-1.5">
                    <MicOff className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              {(!isVideoEnabled || !hasCamera) && (
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

          {peers.map((peer) => (
            <Card
              key={peer.socketId}
              className="bg-gray-800 border-gray-700 relative overflow-hidden aspect-video"
            >
              <CardContent className="p-0 h-full">
                <video
                  ref={(el) => {
                    if (el && el.srcObject !== peer.stream) el.srcObject = peer.stream;
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                    {peer.name}
                    {peer.role ? ` (${peer.role})` : ""}
                  </span>
                  {peer.audioMuted && (
                    <span className="bg-red-600/80 rounded-full p-1.5">
                      <MicOff className="h-3 w-3 text-white" />
                    </span>
                  )}
                </div>
                {(!peer.stream || peer.videoHidden) && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    {peer.stream ? (
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-blue-600 text-white text-2xl">
                          {peer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 rounded-full px-6 py-4 shadow-2xl border border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={toggleAudio}
            title={isAudioEnabled ? "Mute" : "Unmute"}
            aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={toggleVideo}
            disabled={!hasCamera}
            title={isVideoEnabled ? "Turn the camera off" : "Turn the camera on"}
            aria-label={isVideoEnabled ? "Turn camera off" : "Turn camera on"}
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isScreenSharing ? "secondary" : "outline"}
            size="lg"
            className="rounded-full h-14 w-14 hidden sm:inline-flex"
            onClick={toggleScreenShare}
            title={isScreenSharing ? "Stop sharing your screen" : "Share your screen"}
            aria-label={isScreenSharing ? "Stop screen share" : "Start screen share"}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
            onClick={() => router.back()}
            title="Leave the call"
            aria-label="Leave the call"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
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

export default CallRoom;
