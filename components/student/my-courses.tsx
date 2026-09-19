"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import apiClient from "@/lib/api";
import {
  BookOpen,
  Video,
  MessageCircle,
  PlayCircle,
  Clock,
  User,
} from "lucide-react";

interface Course {
  _id: string;
  name: string;
  teacher: {
    name: string;
    email: string;
    image?: string;
  };
  progress: number;
  nextLesson: {
    title: string;
    date: string;
    time: string;
    completed: boolean;
  };
  totalLessons: number;
  completedLessons: number;
}

interface MyCoursesProps {
  studentData: any;
  onJoinSession: (courseId: string) => void;
  onMessageTeacher: (teacherId: string) => void;
}

interface Lesson {
  _id: string;
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

interface Session {
  _id: string;
  topic?: string;
  course?: string;
  scheduledDate: string;
  status: string;
}

export default function MyCourses({
  studentData,
  onJoinSession,
  onMessageTeacher,
}: MyCoursesProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<{ from: string; roomId: string; teacherName: string } | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [nextSessionId, setNextSessionId] = useState<string | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    socket.emit("register-user", { userId: user._id, userName: user.name, userType: "Student" });

    const onIncomingCall = ({ from, roomId, teacherName }: any) => {
      setIncomingCall({ from, roomId, teacherName });
    };
    socket.on("incoming-call", onIncomingCall);

    // The connection is shared app-wide — detach the listener, never disconnect.
    return () => {
      socket.off("incoming-call", onIncomingCall);
    };
  }, [user]);

  const handleAcceptCall = () => {
    if (incomingCall) {
      // Same page the student dashboard uses, so both entry points land in one room.
      router.push(`/video-call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  // Real course view: lessons, progress, the assigned teacher and the next
  // scheduled session all come from the API. "Join Live Session" targets that
  // session's id, which is the room id both sides join.
  useEffect(() => {
    if (!user?._id) return;

    let cancelled = false;

    const load = async () => {
      setLoadingCourse(true);

      const teacherId = studentData?.assignedTeacher?._id || studentData?.assignedTeacher;

      const [lessonsRes, progressRes, sessionsRes, teacherRes] = await Promise.all([
        apiClient.get(`/lessons/student/${user._id}`).catch(() => null),
        apiClient.get(`/progress/student/${user._id}`).catch(() => null),
        apiClient.get("/sessions?status=scheduled").catch(() => null),
        teacherId ? apiClient.get(`/teacher/${teacherId}`).catch(() => null) : Promise.resolve(null),
      ]);

      if (cancelled) return;

      const lessons: Lesson[] = lessonsRes?.data?.data?.lessons ?? [];
      const completedLessons = lessons.filter((lesson) => lesson.completed).length;
      const progress = progressRes?.data?.data?.progress;

      const sessions: Session[] = sessionsRes?.data?.data?.sessions ?? [];
      const upcomingSession = sessions
        .filter((session) => new Date(session.scheduledDate).getTime() >= Date.now())
        .sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        )[0];

      const nextLesson = lessons
        .filter((lesson) => !lesson.completed)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

      const teacher = teacherRes?.data?.data;
      const sessionDate = upcomingSession ? new Date(upcomingSession.scheduledDate) : null;

      setNextSessionId(upcomingSession?._id ?? null);
      setCourse({
        _id: upcomingSession?._id ?? user._id,
        name: studentData?.course || upcomingSession?.course || "Your course",
        teacher: {
          name: teacher?.name || "Not assigned yet",
          email: teacher?.email || "",
          image: teacher?.image,
        },
        progress: typeof progress?.overall === "number" ? progress.overall : 0,
        nextLesson: {
          title:
            nextLesson?.title ||
            upcomingSession?.topic ||
            "No lesson scheduled yet",
          date: nextLesson
            ? new Date(nextLesson.date).toLocaleDateString()
            : sessionDate?.toLocaleDateString() ?? "-",
          time:
            nextLesson?.time ||
            sessionDate?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ||
            studentData?.suitableTime ||
            "-",
          completed: false,
        },
        totalLessons: lessons.length,
        completedLessons,
      });
      setLoadingCourse(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?._id, studentData]);

  const courses = course ? [course] : [];

  return (
    <div className="space-y-6">
      {/* Incoming Call Notification */}
      {incomingCall && (
        <Card className="border-green-500 bg-green-50 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Incoming Video Call</h3>
                  <p className="text-sm text-gray-600">{incomingCall.teacherName} is calling you</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRejectCall} variant="outline" className="border-red-500 text-red-600">
                  Decline
                </Button>
                <Button onClick={handleAcceptCall} className="bg-green-600 hover:bg-green-700">
                  <Video className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loadingCourse && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading your course...</p>
          </CardContent>
        </Card>
      )}

      {courses.map((course) => (
        <Card key={course._id} className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    {course.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {course.completedLessons} of {course.totalLessons} lessons
                    completed
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-600">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Course Progress
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>

            {/* Teacher Info */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.teacher.image} />
                  <AvatarFallback className="bg-blue-200 text-blue-900">
                    {course.teacher.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-blue-900">
                    {course.teacher.name}
                  </p>
                  <p className="text-sm text-gray-600">Your Instructor</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={!course.teacher.email}
                onClick={() => onMessageTeacher(course.teacher.email)}
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>

            {/* Next Lesson */}
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Next Lesson
                  </h3>
                  <p className="text-gray-700">{course.nextLesson.title}</p>
                </div>
                <Badge
                  variant={
                    course.nextLesson.completed ? "default" : "secondary"
                  }
                >
                  {course.nextLesson.completed ? "Completed" : "Upcoming"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {course.nextLesson.date} at {course.nextLesson.time}
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!nextSessionId}
                onClick={() => nextSessionId && onJoinSession(nextSessionId)}
              >
                <Video className="h-4 w-4 mr-2" />
                {nextSessionId ? "Join Live Session" : "No session scheduled"}
              </Button>
            </div>

            {/* Course Info Note */}
            <div className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-medium text-yellow-900 mb-1">
                📝 Read-only Lesson View
              </p>
              <p>
                Your teacher will add and update lessons. You can view all
                lessons but cannot modify them. If a lesson is not completed,
                your teacher can repeat it in the next session.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
