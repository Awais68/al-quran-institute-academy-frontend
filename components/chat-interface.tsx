"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import io from "socket.io-client";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    image?: string;
    role: string;
  };
  receiverId: {
    _id: string;
    name: string;
    image?: string;
    role: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  recipientImage?: string;
  onClose?: () => void;
}

export default function ChatInterface({
  recipientId,
  recipientName,
  recipientImage,
  onClose,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();

    // Setup socket for real-time messages
    const socket = io("http://localhost:4000");
    socketRef.current = socket;

    socket.on("new-message", (message: Message) => {
      // Only add message if it's from the current conversation
      if (
        (message.senderId._id === recipientId && message.receiverId._id === user?._id) ||
        (message.senderId._id === user?._id && message.receiverId._id === recipientId)
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [recipientId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get(`/messages/conversation/${recipientId}`);
      if (response.data && response.data.data) {
        setMessages(response.data.data.messages || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await apiClient.post("/messages/send", {
        receiverId: recipientId,
        content: newMessage.trim(),
      });

      if (response.data && response.data.data) {
        setMessages([...messages, response.data.data.message]);
        setNewMessage("");
        scrollToBottom();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={recipientImage} />
              <AvatarFallback className="bg-blue-600 text-white">
                {recipientName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{recipientName}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {messages.length} messages
              </Badge>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId._id === user?._id;
            return (
              <div
                key={message._id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
