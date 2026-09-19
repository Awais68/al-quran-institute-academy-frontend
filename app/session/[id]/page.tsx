"use client";

import { useParams } from "next/navigation";
import { CallRoom } from "@/components/video/call-room";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  // The student side of the same room: it joins and answers, it never rings.
  return <CallRoom sessionId={sessionId} title="Live Session" />;
}
