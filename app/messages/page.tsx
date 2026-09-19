"use client";

import { Suspense, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { AuthContext } from "@/app/context/AuthContext";
import ChatInterface from "@/components/chat-interface";
import ConversationList, {
  type ChatContact,
  type ConversationRow,
} from "@/components/messages/conversation-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboardPathForRole } from "@/lib/dashboard-path";

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
    </div>
  );
}

function MessagesContent() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toEmail = searchParams.get("to");

  const [selected, setSelected] = useState<ChatContact | null>(null);
  // `?to=` is honoured once, against the first loaded list. Re-applying it on
  // every load would yank the user back to that thread after they pick another.
  const [pendingEmail, setPendingEmail] = useState<string | null>(toEmail);
  const [emailUnresolved, setEmailUnresolved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  // Deep links from a course page arrive as ?to=<email>. The contact list is
  // already scoped to this user's role, so match inside it instead of asking
  // for every teacher and every student.
  const handleLoaded = useCallback(
    (rows: ConversationRow[]) => {
      if (!pendingEmail) return;
      const match = rows.find(
        (row) => row.user.email?.toLowerCase() === pendingEmail.toLowerCase()
      );
      if (match) {
        setSelected(match.user);
        setEmailUnresolved(false);
      } else {
        setEmailUnresolved(true);
      }
      setPendingEmail(null);
    },
    [pendingEmail]
  );

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => router.push(dashboardPathForRole(user.role))}
        className="mb-4 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="mb-4 text-2xl font-bold text-blue-900">Messages</h1>

      {emailUnresolved && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Could not find anyone you can message at {toEmail}. Pick a contact below instead.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        {/* On mobile the list gives way to the open thread; both fit side by
            side from md up. */}
        <Card className={selected ? "hidden h-[600px] md:block" : "h-[600px]"}>
          <ConversationList
            selectedId={selected?._id ?? null}
            onSelect={setSelected}
            refreshKey={refreshKey}
            onLoaded={handleLoaded}
          />
        </Card>

        {selected ? (
          <div className="min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(null)}
              className="mb-2 text-gray-600 md:hidden"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              All conversations
            </Button>
            <ChatInterface
              key={selected._id}
              recipientId={selected._id}
              recipientName={selected.name ?? selected.email ?? "Unknown"}
              recipientImage={selected.image}
              onSent={() => setRefreshKey((n) => n + 1)}
            />
          </div>
        ) : (
          <Card className="hidden h-[600px] flex-col items-center justify-center text-gray-500 md:flex">
            <MessageCircle className="mb-2 h-12 w-12 opacity-40" />
            <p className="text-sm">Pick someone on the left to start talking.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <MessagesContent />
    </Suspense>
  );
}
