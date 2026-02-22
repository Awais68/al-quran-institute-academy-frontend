"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Upload,
  Video,
  Music,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Mic,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

interface Activity {
  _id: string;
  type: "remark" | "submission" | "feedback";
  date: string;
  content: string;
  media?: {
    type: "audio" | "video";
    url: string;
    cloudinaryId: string;
    thumbnail?: string;
  };
  teacherFeedback?: string;
  teacherName?: string;
  status?: "pending" | "reviewed";
}

interface ActivityProps {
  studentId?: string;
}

export default function Activity({ studentId }: ActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<"audio" | "video">("audio");
  const [uploadNote, setUploadNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (studentId) {
      fetchActivities();
    }
  }, [studentId]);

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get(`/activities/student/${studentId}`);
      if (response.data.success !== false && !response.data.error) {
        setActivities(response.data.data?.activities || []);
      } else {
        setActivities([]);
      }
      setLoading(false);
    } catch (error) {
      console.warn("Failed to fetch activities:", error);
      setActivities([]);
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      const validTypes = uploadType === "audio" ? validAudioTypes : validVideoTypes;

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `Please select a valid ${uploadType} file`,
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("studentId", studentId || "");
      formData.append("note", uploadNote);

      const response = await apiClient.post("/activities/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success !== false && !response.data.error) {
        toast({
          title: "Upload successful!",
          description: "Your practice has been submitted to your teacher",
        });

        // Reset form
        setSelectedFile(null);
        setUploadNote("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh activities
        fetchActivities();
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "submission":
        return Upload;
      case "remark":
        return MessageSquare;
      case "feedback":
        return CheckCircle2;
      default:
        return MessageSquare;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "submission":
        return "border-l-blue-500 bg-blue-50/50";
      case "remark":
        return "border-l-green-500 bg-green-50/50";
      case "feedback":
        return "border-l-purple-500 bg-purple-50/50";
      default:
        return "border-l-gray-500 bg-gray-50/50";
    }
  };

  const renderActivity = (activity: Activity) => {
    const Icon = getActivityIcon(activity.type);
    const colorClass = getActivityColor(activity.type);

    return (
      <Card key={activity._id} className={`border-l-4 ${colorClass}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                    {activity.status === "pending" && (
                      <Badge variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Review
                      </Badge>
                    )}
                    {activity.status === "reviewed" && (
                      <Badge variant="outline" className="bg-green-50 border-green-300 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Reviewed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(activity.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-gray-700">{activity.content}</p>
            </div>

            {/* Media */}
            {activity.media && (
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activity.media.type === "audio" ? (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Music className="h-6 w-6 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Video className="h-6 w-6 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.media.type === "audio" ? "Audio Recording" : "Video Recording"}
                      </p>
                      <p className="text-sm text-gray-500">Click to play</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(activity.media?.url, "_blank")}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </div>
              </div>
            )}

            {/* Teacher Feedback */}
            {activity.teacherFeedback && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-1">
                      {activity.teacherName || "Teacher"} Feedback:
                    </p>
                    <p className="text-gray-700">{activity.teacherFeedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const submissions = activities.filter((a) => a.type === "submission");
  const remarks = activities.filter((a) => a.type === "remark");
  const feedback = activities.filter((a) => a.type === "feedback");

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Practice Recording
          </CardTitle>
          <CardDescription>
            Share your recitation or practice with your teacher for feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Type Selection */}
            <div className="flex gap-2">
              <Button
                variant={uploadType === "audio" ? "default" : "outline"}
                onClick={() => setUploadType("audio")}
                className="flex-1"
              >
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button
                variant={uploadType === "video" ? "default" : "outline"}
                onClick={() => setUploadType("video")}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>

            {/* File Input */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={uploadType === "audio" ? "audio/*" : "video/*"}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : `Select ${uploadType} file`}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Max file size: 50MB • Supported formats: {uploadType === "audio" ? "MP3, WAV, OGG" : "MP4, WebM, OGG"}
              </p>
            </div>

            {/* Note */}
            <div>
              <Textarea
                placeholder="Add a note for your teacher (optional)"
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Practice
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Activity Timeline</CardTitle>
          <CardDescription>Track your submissions, teacher remarks, and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({activities.length})</TabsTrigger>
              <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
              <TabsTrigger value="remarks">Remarks ({remarks.length})</TabsTrigger>
              <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No activities yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Upload your first practice recording to get started
                    </p>
                  </div>
                ) : (
                  activities.map(renderActivity)
                )}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="mt-6">
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  submissions.map(renderActivity)
                )}
              </div>
            </TabsContent>

            <TabsContent value="remarks" className="mt-6">
              <div className="space-y-4">
                {remarks.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No remarks yet</p>
                  </div>
                ) : (
                  remarks.map(renderActivity)
                )}
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No feedback yet</p>
                  </div>
                ) : (
                  feedback.map(renderActivity)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
