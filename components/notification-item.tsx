"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, FileText, MessageSquare, Bell, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    _id: string;
    type: "session" | "instruction" | "feedback" | "announcement" | "message";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  };
  onClick: () => void;
  onDelete: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "session":
      return <Calendar className="h-4 w-4" />;
    case "instruction":
      return <FileText className="h-4 w-4" />;
    case "feedback":
      return <Award className="h-4 w-4" />;
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    case "announcement":
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "session":
      return "text-blue-600 bg-blue-50";
    case "instruction":
      return "text-purple-600 bg-purple-50";
    case "feedback":
      return "text-green-600 bg-green-50";
    case "message":
      return "text-orange-600 bg-orange-50";
    case "announcement":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors relative group",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
            getNotificationColor(notification.type)
          )}
        >
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm line-clamp-1">
              {notification.title}
            </p>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
