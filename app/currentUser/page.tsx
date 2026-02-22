"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Users, BookOpen, DollarSign, TrendingUp, 
  LogOut, BarChart3, FileText,
  CheckCircle2, XCircle, Clock
} from "lucide-react";
import StudentsManagement from "@/components/admin/students-management";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import SessionsManagement from "@/components/admin/sessions-management";
import TeacherManagement from "@/components/admin/teacher-management";
import LoadingComponent from "@/components/loader";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  email: string;
  name: string;
  role: string;
  image?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useContext(AuthContext);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeCourses: 7,
    completedSessions: 0,
    upcomingSessions: 0,
    paidStudents: 0,
    unpaidStudents: 0,
  });

  useEffect(() => {
    checkAuthentication();
    fetchDashboardStats();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await apiClient.get('/getCurrentUser/getCurrentUser');
      const user = response.data.data;

      // Check if user is admin
      if (user.role !== 'Admin') {
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page",
          variant: "destructive",
        });
        router.push('/');
        return;
      }

      setAdminUser(user);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Authentication Required",
        description: "Please login to access admin panel",
        variant: "destructive",
      });
      router.push('/');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [studentsRes, userStatsRes] = await Promise.all([
        apiClient.get('/students/getAllStudents'),
        apiClient.get('/user/stats/overview').catch(() => ({ data: { data: {} } }))
      ]);

      const students = studentsRes.data.data || [];
      const userStats = userStatsRes.data.data || {};

      // Calculate stats
      const paidStudents = students.filter((s: any) => s.feesPaid === true).length;
      const unpaidStudents = students.length - paidStudents;
      const activeStudents = students.filter((s: any) => s.status === 'active').length;
      
      // Calculate revenue (assuming average fee of 100 per student)
      const totalRevenue = paidStudents * 100;
      const pendingPayments = unpaidStudents * 100;

      setStats({
        totalStudents: students.length,
        activeStudents: userStats.active || activeStudents,
        totalRevenue,
        pendingPayments,
        activeCourses: 7,
        completedSessions: Math.floor(students.length * 2.5),
        upcomingSessions: Math.floor(students.length * 0.8),
        paidStudents,
        unpaidStudents,
      });
    } catch (error) {
      console.warn('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3), transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3), transparent 50%)',
            'radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3), transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-none shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-blue-500/20">
                    <AvatarImage src={adminUser?.image} alt={adminUser?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
                      {adminUser?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {adminUser?.name} • {adminUser?.email}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-90">Total Students</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalStudents}</p>
                  <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {stats.activeStudents} active
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-90">Revenue Collected</p>
                  <p className="text-3xl font-bold mt-1">${stats.totalRevenue}</p>
                  <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {stats.paidStudents} paid
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-90">Pending Payments</p>
                  <p className="text-3xl font-bold mt-1">${stats.pendingPayments}</p>
                  <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {stats.unpaidStudents} unpaid
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-90">Active Courses</p>
                  <p className="text-3xl font-bold mt-1">{stats.activeCourses}</p>
                  <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    All programs
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-none shadow-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="students" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="students" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Students</span>
                  </TabsTrigger>
                  <TabsTrigger value="teachers" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Teachers</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Sessions</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="students">
                  <StudentsManagement onStatsUpdate={fetchDashboardStats} />
                </TabsContent>

                <TabsContent value="teachers">
                  <TeacherManagement />
                </TabsContent>

                <TabsContent value="analytics">
                  <AnalyticsDashboard stats={stats} />
                </TabsContent>

                <TabsContent value="sessions">
                  <SessionsManagement stats={stats} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
