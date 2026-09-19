"use client";

import { useCallback, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import apiClient from "@/lib/api";
import { CallRoom } from "@/components/video/call-room";
import type { getSocket } from "@/lib/socket";

export default function VideoCallPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const { user } = useContext(AuthContext);

  // Rooms created from the schedule are named after the Session document, so
  // the student to ring has to be looked up. Older ad-hoc rooms encode the
  // student id as "room-<studentId>-<timestamp>", which stays supported.
  const resolveStudentId = useCallback(async (): Promise<string | null> => {
    if (/^[0-9a-fA-F]{24}$/.test(sessionId)) {
      try {
        const response = await apiClient.get(`/sessions/${sessionId}`);
        const session = response.data?.data?.session;
        return session?.studentId?._id || session?.studentId || null;
      } catch (error) {
        console.warn("Could not resolve the session student:", error);
        return null;
      }
    }

    return sessionId.replace("room-", "").split("-")[0] || null;
  }, [sessionId]);

  // Only the teacher rings. Every participant used to emit this on join, so a
  // student joining rang their own phone.
  const onJoined = useCallback(
    (socket: ReturnType<typeof getSocket>) => {
      if (user?.role !== "Teacher") return;
      resolveStudentId().then((studentId) => {
        if (!studentId) return;
        socket.emit("call-student", {
          studentId,
          teacherName: user?.name,
          roomId: sessionId,
        });
      });
    },
    [resolveStudentId, sessionId, user?.name, user?.role]
  );

  return <CallRoom sessionId={sessionId} title="Video Session" onJoined={onJoined} />;
}
