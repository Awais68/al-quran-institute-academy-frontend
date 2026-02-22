"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import TeacherStats from "@/components/teacher/teacher-stats";
import MyStudents from "@/components/teacher/my-students";
import SessionManagement from "@/components/teacher/session-management";
import ProgressReport from "@/components/teacher/progress-report";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Clock, Star, LogOut, ArrowLeft, Video, Phone } from "lucide-react";
import io from "socket.io-client";
import { SOCKET_URL } from "@/app/constant/constant";
import NotificationBell from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

import ActivityTab from "@/components/student/activity";
import ProfileSidebar from "@/components/student/profile-sidebar";

// export default function StudentDashboard() {
//   const { user, loading, logout } = useContext(AuthContext);
//   const router = useRouter();
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("courses");

//   useEffect(() => {
//     if (loading) return; // Wait for auth to load

//     if (!user) {
//       router.replace("/");
//       return;
//     }
//     if (user.role !== "Student") {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   const handleJoinSession = (courseId: string) => {
//     // Navigate to WebRTC video call page
//     router.push(`/session/${courseId}`);
//   };
interface TeacherData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface StudentData {
  _id: string;
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  age?: number;
  gender: string;
  country: string;
  city: string;
  course: string;
  suitableTime: string;
  app: string;
  dob?: string;
  image?: string;
  roll_no: string;
  feesPaid: boolean;
  status: string;
}

interface SessionData {
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

export default function TeacherDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, setUser, logout } = useContext(AuthContext);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState<{ from: string; roomId: string; studentName: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue",
        variant: "destructive",
      });
      router.replace("/");
      return;
    }

    if (user.role !== "Teacher") {
      toast({
        title: "Access Denied",
        description: "You must be a teacher to access this page",
        variant: "destructive",
      });
      router.replace("/");
      return;
    }

    setCurrentTeacher(user);
    fetchStudents();
    fetchSessions();
    setLoading(false);

    // Setup socket for incoming calls from students
    const socket = io(SOCKET_URL);
    socket.emit("register-user", { userId: user._id, userName: user.name, userType: "Teacher" });

    socket.on("incoming-call", ({ from, roomId, studentName }) => {
      console.log("Incoming call from student:", studentName);
      setIncomingCall({ from, roomId, studentName });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, authLoading, router]);

  const handleAcceptCall = () => {
    if (incomingCall) {
      router.push(`/video-call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get("/students/getAllStudents");
      // Filter only active students
      const students = response.data?.data?.students;
      const activeStudents = Array.isArray(students) ? students.filter(
        (student: StudentData) => student.status === "active" && student.roll_no
      ) : [];
      setAllStudents(activeStudents);
    } catch (error) {
      console.warn("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await apiClient.get("/sessions");
      const rawSessions = response.data?.data?.sessions || response.data?.data || [];

      // Normalise API response to SessionData shape
      const normalised: SessionData[] = rawSessions.map((s: any) => {
        const scheduledDate = s.scheduledDate || s.date || "";
        const dateObj = scheduledDate ? new Date(scheduledDate) : null;
        return {
          _id: s._id,
          student: s.studentName || s.student?.name || s.studentId || "Unknown",
          course: s.course || "",
          date: scheduledDate,
          time: dateObj
            ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : s.time || "",
          duration: s.duration || 60,
          type: s.type || "One-on-One",
          topic: s.topic || s.notes || "",
          status: s.status || "scheduled",
          notes: s.notes,
        };
      });

      setSessions(normalised);
    } catch (error) {
      console.warn("Error fetching sessions:", error);
      toast({
        title: "Warning",
        description: "Could not load sessions from server",
        variant: "destructive",
      });
    }
  };

  const calculateStats = () => {
    const totalStudents = allStudents.length;
    const activeStudents = allStudents.filter((s) => s.status === "active").length;
    const completedSessions = sessions.filter((s) => s.status === "completed").length;
    const upcomingSessions = sessions.filter((s) => s.status === "scheduled").length;

    return {
      totalStudents,
      activeStudents,
      totalSessions: sessions.length,
      upcomingSessions,
      completedSessions,
      averageRating: 4.8,
      totalHours: completedSessions * 1, // Assuming 1 hour per session
      monthlyEarnings: 0,
    };
  };

  const handleAddSession = (newSession: any) => {
    // Session data comes from SessionManagement after successful API call
    setSessions((prev) => [...prev, { ...newSession, status: "scheduled" }]);
    // Refresh from API to get accurate data
    fetchSessions();
  };

  const handleUpdateSession = async (id: string, updates: any) => {
    // Optimistic update
    setSessions(
      sessions.map((session) =>
        session._id === id ? { ...session, ...updates } : session
      )
    );
    try {
      await apiClient.put(`/sessions/${id}`, updates);
      toast({ title: "Success", description: "Session updated successfully" });
    } catch (error) {
      // Rollback on failure
      await fetchSessions();
      toast({ title: "Error", description: "Failed to update session", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout and Back */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificationBell />
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <Card className="border-green-500 bg-green-50 animate-pulse mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Incoming Video Call</h3>
                  <p className="text-sm text-gray-600">{incomingCall.studentName} is calling you</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRejectCall} variant="outline" className="border-red-500 text-red-600">
                  <Phone className="h-4 w-4 mr-2" />
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

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Welcome back, {currentTeacher?.name}!
        </h1>
        <p className="text-blue-700">
          Manage your students and track their Quranic learning progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <TeacherStats stats={stats} />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="students">My Students</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <MyStudents students={allStudents} onRefresh={fetchStudents} />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionManagement
            sessions={sessions}
            students={allStudents}
            onAddSession={handleAddSession}
            onUpdateSession={handleUpdateSession}
          />
        </TabsContent>

        <TabsContent value="reports">
          <ProgressReport students={allStudents} onRefresh={fetchStudents} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stats.totalStudents}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stats.completedSessions}</p>
                  <p className="text-sm text-gray-600">Completed Sessions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stats.totalHours}h</p>
                  <p className="text-sm text-gray-600">Teaching Hours</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stats.averageRating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        {/* <ProfileSidebar
              open={profileOpen}
              onOpenChange={setProfileOpen}
              student={user}
              canEdit={false} // Only true for admin/teacher viewing student profile
            /> */}
    </div>
  );
}
