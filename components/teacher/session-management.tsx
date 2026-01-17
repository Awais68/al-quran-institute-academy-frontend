"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, CheckCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Session {
  _id: string;
  student: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  topic: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

interface SessionManagementProps {
  sessions: Session[];
  students: any[];
  onAddSession: (session: any) => void;
  onUpdateSession: (id: string, updates: any) => void;
}

export default function SessionManagement({
  sessions,
  students,
  onAddSession,
  onUpdateSession,
}: SessionManagementProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newSession, setNewSession] = useState({
    studentId: "",
    course: "",
    date: "",
    time: "",
    duration: 60,
    type: "One-on-One",
    topic: "",
    notes: "",
  });

  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const handleAddSession = async () => {
    if (!newSession.studentId || !newSession.course || !newSession.date || !newSession.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScheduling(true);

      // Combine date and time into scheduledDate
      const scheduledDate = new Date(`${newSession.date}T${newSession.time}`);

      const response = await apiClient.post("/sessions", {
        studentId: newSession.studentId,
        course: newSession.course,
        scheduledDate: scheduledDate.toISOString(),
        duration: newSession.duration,
        topic: newSession.topic,
        notes: newSession.notes,
      });

      if (response.data?.data?.session) {
        onAddSession(response.data.data.session);
        toast({
          title: "Success",
          description: "Session scheduled successfully. Student has been notified.",
        });
        setIsAddDialogOpen(false);
        setNewSession({
          studentId: "",
          course: "",
          date: "",
          time: "",
          duration: 60,
          type: "One-on-One",
          topic: "",
          notes: "",
        });
      }
    } catch (error: any) {
      console.error("Error scheduling session:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to schedule session",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const markAsCompleted = (sessionId: string) => {
    onUpdateSession(sessionId, { status: "completed" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-900">
            Session Management
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
                <DialogDescription>
                  Create a new teaching session with a student
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student">Student *</Label>
                  <Select
                    value={newSession.studentId}
                    onValueChange={(value) =>
                      setNewSession({ ...newSession, studentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={newSession.course}
                    onChange={(e) =>
                      setNewSession({ ...newSession, course: e.target.value })
                    }
                    placeholder="e.g., Tajweed"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSession.date}
                    onChange={(e) =>
                      setNewSession({ ...newSession, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSession.time}
                    onChange={(e) =>
                      setNewSession({ ...newSession, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.duration}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        duration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">Session Type</Label>
                  <Select
                    value={newSession.type}
                    onValueChange={(value) =>
                      setNewSession({ ...newSession, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-on-One">One-on-One</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={newSession.topic}
                    onChange={(e) =>
                      setNewSession({ ...newSession, topic: e.target.value })
                    }
                    placeholder="e.g., Noon Sakinah Rules"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newSession.notes}
                    onChange={(e) =>
                      setNewSession({ ...newSession, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isScheduling}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSession} disabled={isScheduling}>
                  {isScheduling ? "Scheduling..." : "Schedule Session"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No upcoming sessions</p>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-blue-900">
                            {session.student}
                          </h3>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {session.course} - {session.topic}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration} min)
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsCompleted(session._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No completed sessions yet</p>
              </div>
            ) : (
              completedSessions.map((session) => (
                <Card key={session._id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-blue-900">
                            {session.student}
                          </h3>
                          <Badge variant="secondary">{session.type}</Badge>
                          <Badge className="bg-green-100 text-green-700">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {session.course} - {session.topic}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration} min)
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
