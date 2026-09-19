"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { dashboardPathForRole } from "@/lib/dashboard-path";
import { Suspense } from "react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface Conversation {
  user: Contact | null;
  lastMessage?: { content: string; createdAt: string } | null;
  unreadCount: number;
}

function MessagesContent() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toEmail = searchParams.get("to");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        // /messages/contacts is scoped to the caller's own role, so a student
        // gets their teacher and the admins without needing admin endpoints.
        const [contactsRes, conversationsRes] = await Promise.all([
          apiClient.get("/messages/contacts"),
          apiClient.get("/messages/conversations").catch(() => null),
        ]);

        if (cancelled) return;

        const list: Contact[] = contactsRes.data?.data?.contacts ?? [];
        setContacts(list);

        const convos: Conversation[] = conversationsRes?.data?.data?.conversations ?? [];
        setConversations(convos);

        const preselected = toEmail
          ? list.find((c) => c.email === toEmail) ||
            convos.map((c) => c.user).find((u) => u?.email === toEmail) ||
            null
          : null;

        setSelected(preselected ?? convos[0]?.user ?? list[0] ?? null);
      } catch (error) {
        console.warn("Failed to load messages page:", error);
      } finally {
        if (!cancelled) setResolving(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, loading, toEmail, router]);

  // Keep the sidebar previews live while the user sits on this page.
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    const onNewMessage = () => {
      apiClient
        .get("/messages/conversations")
        .then((res) => setConversations(res.data?.data?.conversations ?? []))
        .catch(() => undefined);
    };

    socket.on("new-message", onNewMessage);
    return () => {
      socket.off("new-message", onNewMessage);
    };
  }, [user]);

  // One row per person: everyone the user may message, with the conversation
  // preview merged in where one exists.
  const rows = useMemo(() => {
    const byId = new Map<string, Conversation>();
    for (const contact of contacts) {
      byId.set(contact._id, { user: contact, lastMessage: null, unreadCount: 0 });
    }
    for (const convo of conversations) {
      if (!convo.user) continue;
      byId.set(convo.user._id, convo);
    }
    return Array.from(byId.values()).filter((row): row is Conversation & { user: Contact } =>
      Boolean(row.user)
    );
  }, [contacts, conversations]);

  if (loading || resolving) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => router.push(dashboardPathForRole(user.role))}
        className="mb-6 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Messages</h1>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card className="h-fit md:max-h-[600px] md:overflow-y-auto">
          <CardContent className="p-2">
            {rows.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No one is available to message yet.
              </p>
            ) : (
              rows.map((row) => (
                <button
                  key={row.user._id}
                  onClick={() => setSelected(row.user)}
                  className={`w-full text-left flex items-center gap-3 rounded-md p-3 transition-colors ${
                    selected?._id === row.user._id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={row.user.image} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {row.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-sm">{row.user.name}</span>
                      {row.unreadCount > 0 && (
                        <Badge className="bg-blue-600">{row.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      {row.lastMessage?.content || row.user.role}
                    </p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {selected ? (
          <ChatInterface
            key={selected._id}
            recipientId={selected._id}
            recipientName={selected.name}
            recipientImage={selected.image}
          />
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No conversation selected</p>
            <p className="text-sm">
              {toEmail
                ? `Could not find a contact with email: ${toEmail}`
                : "Pick someone from the list to start a conversation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
