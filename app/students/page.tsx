"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/app/context/AuthContext";
import { SOCKET_URL } from "@/app/constant/constant";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Activity,
  User,
  LogOut,
  AlertCircle,
  FileText,
  Phone,
  Video,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NotificationBell from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

// Import all student tab components
import MyCourses from "@/components/student/my-courses";
import Schedule from "@/components/student/schedule";
import Progress from "@/components/student/progress";
import Achievement from "@/components/student/achievement";
import ActivityTab from "@/components/student/activity";
import ProfileSidebar from "@/components/student/profile-sidebar";

export default function StudentDashboard() {
  const { user, loading, logout, setUser } = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [incomingCall, setIncomingCall] = useState<{ from: string; roomId: string; teacherName: string } | null>(null);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);

  // Fetch assigned teacher data
  useEffect(() => {
    if (!user || user.role !== "Student") return;
    const fetchTeacher = async () => {
      if (!user.assignedTeacher) return;
      setIsLoadingTeacher(true);
      try {
        const response = await apiClient.get(`/teacher/${user.assignedTeacher}`);
        setTeacherData(response.data?.data || null);
      } catch (error) {
        console.warn("Error fetching teacher:", error);
      } finally {
        setIsLoadingTeacher(false);
      }
    };
    fetchTeacher();
  }, [user]);

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!user) {
      router.replace("/");
      return;
    }
    if (user.role !== "Student") {
      router.replace("/");
      return;
    }

    // Setup socket for incoming calls from teachers
    const socket = io(SOCKET_URL);
    socket.emit("register-user", { userId: user._id, userName: user.name, userType: "Student" });

    socket.on("incoming-call", ({ from, roomId, teacherName }) => {
      console.log("Incoming call from teacher:", teacherName);
      setIncomingCall({ from, roomId, teacherName });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, loading, router]);

  const handleJoinSession = (courseId: string) => {
    // Navigate to WebRTC video call page
    router.push(`/session/${courseId}`);
  };

  const handleMessageTeacher = (teacherEmail: string) => {
    // Navigate to messaging interface
    router.push(`/messages?to=${teacherEmail}`);
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      router.push(`/video-call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
  };

  const handleCallTeacher = async () => {
    if (!teacherData) {
      toast({
        title: "No Teacher Assigned",
        description: "You don't have an assigned teacher yet.",
        variant: "destructive",
      });
      return;
    }

    const roomId = `room-${teacherData._id}-${Date.now()}`;
    const socket = io(SOCKET_URL);
    
    socket.emit("call-teacher", {
      teacherId: teacherData._id,
      studentName: user?.name || "Student",
      roomId: roomId
    });

    toast({
      title: "Calling Teacher",
      description: `Calling ${teacherData.name}...`,
    });

    setTimeout(() => {
      router.push(`/video-call/${roomId}`);
      socket.disconnect();
    }, 500);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="w-96 shadow-2xl animate-in fade-in zoom-in duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="white"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Incoming Call
                </h2>
                <p className="text-gray-600 mb-6">
                  {incomingCall.teacherName} is calling you...
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRejectCall}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAcceptCall}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Welcome, {user.name}!
            </h1>
            <p className="text-lg text-blue-700">
              Continue your Quranic journey and track your progress
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleCallTeacher}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoadingTeacher || !teacherData}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Teacher
            </Button>
            <ThemeToggle />
            <NotificationBell />
            <Button
              variant="outline"
              onClick={() => setProfileOpen(true)}
              className="border-blue-300 hover:bg-blue-50"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-300 hover:bg-red-50 text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Teacher Instructions Alert */}
        {user.teacherInstructions && (
          <Alert className="mb-6 border-blue-300 bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold text-lg">
              Instructions from Your Teacher
            </AlertTitle>
            <AlertDescription className="mt-2 text-blue-800 whitespace-pre-wrap">
              {user.teacherInstructions}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveTab("courses")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">My Courses</p>
                  <p className="text-3xl font-bold">1</p>
                </div>
                <BookOpen className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveTab("schedule")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Schedule</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <Calendar className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveTab("progress")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Progress</p>
                  <p className="text-3xl font-bold">0%</p>
                </div>
                <TrendingUp className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveTab("achievement")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm mb-1">Achievements</p>
                  <p className="text-3xl font-bold">2</p>
                </div>
                <Award className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveTab("activity")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm mb-1">Activities</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Activity className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Section */}
        <Card className="border-blue-200 shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="courses" className="text-base">
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Courses
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-base">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="progress" className="text-base">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="achievement" className="text-base">
                  <Award className="h-4 w-4 mr-2" />
                  Achievement
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-base">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-6">
                <MyCourses
                  studentData={user}
                  onJoinSession={handleJoinSession}
                  onMessageTeacher={handleMessageTeacher}
                />
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <Schedule />
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <Progress studentId={user._id} />
              </TabsContent>

              <TabsContent value="achievement" className="mt-6">
                <Achievement studentId={user._id} />
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <ActivityTab studentId={user._id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        open={profileOpen}
        onOpenChange={setProfileOpen}
        student={user}
        canEdit={false} // Only true for admin/teacher viewing student profile
      />
    </div>
  );
}
