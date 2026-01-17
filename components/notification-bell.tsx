"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/app/context/AuthContext";
import apiClient from "@/lib/api";
import { io, Socket } from "socket.io-client";
import NotificationItem from "./notification-item";

interface Notification {
  _id: string;
  type: "session" | "instruction" | "feedback" | "announcement" | "message";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get("/notifications?limit=10");
      if (response.data?.data) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      if (response.data?.data) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Initialize Socket.IO
  useEffect(() => {
    if (!user?._id) return;

    const socketConnection = io("http://localhost:4000");
    setSocket(socketConnection);

    socketConnection.emit("register-user", {
      userId: user._id,
      userType: user.role,
    });

    // Listen for new notifications
    socketConnection.on("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  // Fetch notifications on mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  // Mark notification as read
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await apiClient.patch(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId: string) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      const deletedNotification = notifications.find(
        (n) => n._id === notificationId
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs h-7"
            >
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={() => handleDelete(notification._id)}
              />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
