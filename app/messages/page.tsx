"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/lib/api";
import { Suspense } from "react";

function MessagesContent() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toEmail = searchParams.get("to");

  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientImage, setRecipientImage] = useState<string | undefined>(undefined);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }

    const resolveRecipient = async () => {
      if (!toEmail) {
        setResolving(false);
        return;
      }

      try {
        // Try to find teacher/user by email
        const response = await apiClient.get(`/user/findByEmail?email=${encodeURIComponent(toEmail)}`);
        const found = response.data?.data?.user || response.data?.data;
        if (found) {
          setRecipientId(found._id);
          setRecipientName(found.name || toEmail);
          setRecipientImage(found.image || found.avatar);
        }
      } catch {
        // If endpoint doesn't exist, try getting teacher list to find by email
        try {
          const teacherRes = await apiClient.get("/teacher/getAllTeachers");
          const teachers = teacherRes.data?.data?.teachers || teacherRes.data?.data || [];
          const found = Array.isArray(teachers)
            ? teachers.find((t: any) => t.email === toEmail)
            : null;
          if (found) {
            setRecipientId(found._id);
            setRecipientName(found.name || toEmail);
            setRecipientImage(found.image);
          }
        } catch {
          // Could not resolve recipient
        }
      } finally {
        setResolving(false);
      }
    };

    resolveRecipient();
  }, [user, loading, toEmail, router]);

  if (loading || resolving) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const backPath = user.role === "Teacher" ? "/teacher" : "/students";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push(backPath)}
        className="mb-6 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Messages</h1>

      {recipientId ? (
        <ChatInterface
          recipientId={recipientId}
          recipientName={recipientName}
          recipientImage={recipientImage}
        />
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No conversation selected</p>
          <p className="text-sm">
            {toEmail
              ? `Could not find user with email: ${toEmail}`
              : "Use the Message button from your course page to start a conversation."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
