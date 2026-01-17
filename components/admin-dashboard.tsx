"use client";

import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    Users, BookOpen, GraduationCap, Video,
    Settings, LogOut, TrendingUp, Activity,
    UserCheck, UserX, Clock, CheckCircle2
} from "lucide-react";
import { Separator } from "./ui/separator";
import StudentsTab from "./admin/students-tab";
import TeachersTab from "./admin/teachers-tab";
import CoursesTab from "./admin/courses-tab";
import SessionsTab from "./admin/sessions-tab";
import SettingsTab from "./admin/settings-tab";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserProfileDrawer from "./admin/user-profile-drawer";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        activeCourses: 7,
        totalSessions: 0,
        activeStudents: 0,
        pendingStudents: 0,
        completedSessions: 0,
    });
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, setUser, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return; // Wait for auth to load

        // Check if user is admin
        if (!user) {
            router.replace('/');
            return;
        }

        if (user.role !== 'Admin') {
            router.replace('/');
            return;
        }

        fetchDashboardData();
    }, [user, authLoading, router]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch students
            const studentsRes = await apiClient.get('/getAllStudents');
            const studentsData = studentsRes.data.data || [];
            setStudents(studentsData);

            // Fetch teachers
            try {
                const teachersRes = await apiClient.get('/teacher');
                const teachersData = teachersRes.data.data?.teachers || [];
                setTeachers(teachersData);
            } catch (err) {
                console.log('Teachers endpoint not yet available');
                setTeachers([]);
            }

            // Calculate stats
            const activeStudents = studentsData.filter((s: any) => s.status === 'active').length;
            const pendingStudents = studentsData.filter((s: any) => s.status === 'pending').length;

            setStats({
                totalStudents: studentsData.length,
                totalTeachers: Array.isArray(teachers) ? teachers.length : 0,
                activeCourses: 7,
                totalSessions: studentsData.length * 4, // Placeholder
                activeStudents,
                pendingStudents,
                completedSessions: Math.floor(studentsData.length * 2.5), // Placeholder
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            router.push('/');
        }
    };

    const handleUserClick = (userData: any) => {
        setSelectedUser(userData);
        setDrawerOpen(true);
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'Admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-600 font-semibold">Access Denied. Admin privileges required.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Animated Background */}
            <motion.div
                className="fixed inset-0 opacity-30 pointer-events-none"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)',
                        'radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.3), transparent 50%)',
                        'radial-gradient(circle at 40% 20%, rgba(120, 119, 198, 0.3), transparent 50%)',
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />

            <div className="relative z-10 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card className="bg-white/80 backdrop-blur-md border-none shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-4 border-primary/20">
                                        <AvatarImage src={user?.image || user?.avatar} alt={user?.name} />
                                        <AvatarFallback className="bg-primary text-white text-xl">
                                            {user?.name?.charAt(0) || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            Welcome back, {user?.name}
                                        </h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                            Admin Dashboard • {user?.email}
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
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <p className="text-sm font-medium opacity-90">Total Students</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalStudents}</p>
                                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                                        <UserCheck className="h-3 w-3" />
                                        {stats.activeStudents} active
                                    </p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <p className="text-sm font-medium opacity-90">Total Teachers</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalTeachers}</p>
                                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        All active
                                    </p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <p className="text-sm font-medium opacity-90">Active Courses</p>
                                    <p className="text-3xl font-bold mt-1">{stats.activeCourses}</p>
                                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        7 programs
                                    </p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <p className="text-sm font-medium opacity-90">Total Sessions</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
                                    <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {stats.completedSessions} completed
                                    </p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <Video className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content with Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-white/80 backdrop-blur-md border-none shadow-xl">
                        <CardContent className="p-6">
                            <Tabs defaultValue="students" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
                                    <TabsTrigger value="students" className="gap-2">
                                        <Users className="h-4 w-4" />
                                        <span className="hidden sm:inline">Students</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="teachers" className="gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        <span className="hidden sm:inline">Teachers</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="courses" className="gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        <span className="hidden sm:inline">Courses</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="sessions" className="gap-2">
                                        <Video className="h-4 w-4" />
                                        <span className="hidden sm:inline">Sessions</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="settings" className="gap-2">
                                        <Settings className="h-4 w-4" />
                                        <span className="hidden sm:inline">Settings</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="students">
                                    <StudentsTab
                                        students={students}
                                        onUserClick={handleUserClick}
                                        onRefresh={fetchDashboardData}
                                    />
                                </TabsContent>

                                <TabsContent value="teachers">
                                    <TeachersTab
                                        teachers={teachers}
                                        onRefresh={fetchDashboardData}
                                    />
                                </TabsContent>

                                <TabsContent value="courses">
                                    <CoursesTab />
                                </TabsContent>

                                <TabsContent value="sessions">
                                    <SessionsTab students={students} />
                                </TabsContent>

                                <TabsContent value="settings">
                                    <SettingsTab user={user} onUpdate={() => fetchDashboardData()} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* User Profile Drawer */}
            <UserProfileDrawer
                user={selectedUser}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onUpdate={fetchDashboardData}
            />
        </div>
    );
}
