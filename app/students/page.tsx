"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/app/context/AuthContext";
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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NotificationBell from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

// Import all student tab components
import MyCourses from "@/components/student/my-courses";
import Schedule from "@/components/student/schedule";
import Progress from "@/components/student/progress";
import Achievement from "@/components/student/achievement";
import ActivityTab from "@/components/student/activity";
import ProfileSidebar from "@/components/student/profile-sidebar";

export default function StudentDashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!user) {
      router.replace("/");
      return;
    }
    if (user.role !== "Student") {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleJoinSession = (courseId: string) => {
    // Navigate to WebRTC video call page
    router.push(`/session/${courseId}`);
  };

  const handleMessageTeacher = (teacherEmail: string) => {
    // Navigate to messaging interface
    router.push(`/messages?to=${teacherEmail}`);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    router.push("/");
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
