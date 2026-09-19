"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MessageCircle, Search } from "lucide-react";

import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export interface ChatContact {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface Conversation {
  user: ChatContact | null;
  lastMessage: { content?: string; createdAt?: string; senderId?: string } | null;
  unreadCount: number;
}

/** A contact plus whatever conversation history exists with them. */
export interface ConversationRow {
  user: ChatContact;
  preview: string;
  at: string | null;
  unreadCount: number;
}

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (contact: ChatContact) => void;
  /** Bumped by the parent after a send, so the preview line refreshes. */
  refreshKey?: number;
  onLoaded?: (rows: ConversationRow[]) => void;
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)}h`;
  if (minutes < 7 * 24 * 60) return `${Math.round(minutes / (60 * 24))}d`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/**
 * Everyone the current user can talk to, most recent conversation first.
 *
 * Both halves come from the backend: `/messages/conversations` for the threads
 * that already exist and `/messages/contacts` for the people this role is
 * allowed to start one with. The page used to download every teacher *and*
 * every student and match on email — admin-only endpoints that 403'd for
 * students, and O(all users) even when they didn't.
 */
export default function ConversationList({
  selectedId,
  onSelect,
  refreshKey = 0,
  onLoaded,
}: ConversationListProps) {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      // One failing half should not blank the whole list.
      const [conversationsResult, contactsResult] = await Promise.allSettled([
        apiClient.get("/messages/conversations"),
        apiClient.get("/messages/contacts"),
      ]);

      const conversations: Conversation[] =
        conversationsResult.status === "fulfilled"
          ? conversationsResult.value.data?.data?.conversations ?? []
          : [];
      const contacts: ChatContact[] =
        contactsResult.status === "fulfilled"
          ? contactsResult.value.data?.data?.contacts ?? []
          : [];

      const byId = new Map<string, ConversationRow>();

      for (const conversation of conversations) {
        // A conversation whose other party was deleted comes back with a null
        // user; there is nothing to open, so skip it.
        if (!conversation.user?._id) continue;
        byId.set(conversation.user._id, {
          user: conversation.user,
          preview: conversation.lastMessage?.content ?? "",
          at: conversation.lastMessage?.createdAt ?? null,
          unreadCount: conversation.unreadCount ?? 0,
        });
      }

      for (const contact of contacts) {
        if (!contact?._id || byId.has(contact._id)) continue;
        byId.set(contact._id, {
          user: contact,
          preview: "",
          at: null,
          unreadCount: 0,
        });
      }

      const next = [...byId.values()].sort((a, b) => {
        // Threads with history first, newest at the top; the rest alphabetical.
        if (a.at && b.at) return new Date(b.at).getTime() - new Date(a.at).getTime();
        if (a.at) return -1;
        if (b.at) return 1;
        return (a.user.name ?? "").localeCompare(b.user.name ?? "");
      });

      setRows(next);
      onLoaded?.(next);
    } finally {
      setLoading(false);
    }
  }, [onLoaded]);

  useEffect(() => {
    if (!user?._id) return;
    load();
  }, [user?._id, refreshKey, load]);

  // A message arriving for any thread changes the ordering and the unread
  // badges, so reload rather than patch a single row.
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    const onNewMessage = () => load();
    socket.on("new-message", onNewMessage);
    return () => {
      socket.off("new-message", onNewMessage);
    };
  }, [user?._id, load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      `${row.user.name ?? ""} ${row.user.email ?? ""}`.toLowerCase().includes(needle)
    );
  }, [rows, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative p-3">
        <Search className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people"
          className="pl-9"
          aria-label="Search conversations"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-gray-500">
            <MessageCircle className="mb-2 h-10 w-10 opacity-40" />
            <p className="text-sm">
              {query ? "Nobody matches that search." : "You have no contacts yet."}
            </p>
          </div>
        ) : (
          <ul>
            {filtered.map((row) => {
              const active = row.user._id === selectedId;
              return (
                <li key={row.user._id}>
                  <button
                    type="button"
                    onClick={() => onSelect(row.user)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50",
                      active && "bg-blue-50 hover:bg-blue-50"
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={row.user.image} alt="" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {(row.user.name ?? row.user.email ?? "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-gray-900">
                          {row.user.name ?? row.user.email}
                        </span>
                        <span className="shrink-0 text-xs text-gray-400">
                          {relativeTime(row.at)}
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-gray-500">
                          {row.preview || row.user.role || ""}
                        </span>
                        {row.unreadCount > 0 && (
                          <span className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
                            {row.unreadCount > 99 ? "99+" : row.unreadCount}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
