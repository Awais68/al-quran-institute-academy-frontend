"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { SOCKET_URL } from "@/app/constant/constant";
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

export default function MyCourses({
  studentData,
  onJoinSession,
  onMessageTeacher,
}: MyCoursesProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<{ from: string; roomId: string; teacherName: string } | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_URL);

    socket.emit("register-user", { userId: user._id, userName: user.name, userType: "Student" });

    socket.on("incoming-call", ({ from, roomId, teacherName }) => {
      console.log("Incoming call from:", teacherName);
      setIncomingCall({ from, roomId, teacherName });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleAcceptCall = () => {
    if (incomingCall) {
      router.push(`/session/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  // Mock course data - will be replaced with actual API data
  const [courses] = useState<Course[]>([
    {
      _id: "1",
      name: studentData?.course || "Tajweed",
      teacher: {
        name: "Muzzamil Ahmed Shaikh",
        email: "teacher@alquran.com",
        image: "",
      },
      progress: 0,
      nextLesson: {
        title: "Introduction to Tajweed Rules",
        date: new Date(Date.now() + 86400000).toLocaleDateString(),
        time: studentData?.suitableTime || "10:00 AM",
        completed: false,
      },
      totalLessons: 30,
      completedLessons: 0,
    },
  ]);

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
                onClick={() => onJoinSession(course._id)}
              >
                <Video className="h-4 w-4 mr-2" />
                Join Live Session
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
