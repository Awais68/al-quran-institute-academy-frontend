"use client";

import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  MessageCircle,
  Video,
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Send,
} from "lucide-react";
import Link from "next/link";
import { AppRoutes } from "../constant/constant";
import axios from "axios";
import getAllStudents from "../admin/page";

interface StudentData {
  _id?: string;
  name?: string;
  fatherName?: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  country?: string;
  city?: string;
  course?: string;
  suitableTime?: string;
  app?: string;
  dob?: string;
  image?: string;
  averageRating?: number; // <-- Add this line
}

export default function InstructorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const [currentStudent, setCurrentStudent] = useState<StudentData | null>(
    null
  );
  const [allStudents, setAllStudents] = useState<StudentData[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(AppRoutes.getCurrentUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("ApiResponse==>>>>", response);
        setCurrentStudent(response.data.data); // Expecting a single student object
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch student");
        setLoading(false);
      }
    };
    fetchCurrentStudent();
  }, []);
  console.log("Student==>", currentStudent);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axios.get(AppRoutes.getAllStudents);
        console.log("API Response:", response);

        // Adjust this based on your response shape
        setAllStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    getAllStudents();
  }, []);
  console.log("Student in the Teacher", allStudents);

  // Mock data - in real app, this would come from an API
  // const instructorStats = {
  //   totalStudents: 45,
  //   activeCourses: 3,
  //   completedSessions: 128,
  //   averageRating: 4.9,
  //   totalHours: 256,
  //   monthlyEarnings: 3200,
  // };

  // const students = [
  //   {
  //     id: "1",
  //     name: "Ahmad Hassan",
  //     email: "ahmad.hassan@email.com",
  //     course: "Tajweed Mastery",
  //     progress: 65,
  //     lastSession: "2024-01-12T10:00:00",
  //     nextSession: "2024-01-15T10:00:00",
  //     status: "active",
  //     level: "Intermediate",
  //     joinDate: "2023-11-15",
  //     totalSessions: 24,
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     performance: "excellent",
  //     notes: "Shows great improvement in Noon Sakinah rules",
  //   },
  //   {
  //     id: "2",
  //     name: "Fatima Al-Zahra",
  //     email: "fatima.zahra@email.com",
  //     course: "Quran Memorization",
  //     progress: 40,
  //     lastSession: "2024-01-11T15:00:00",
  //     nextSession: "2024-01-16T15:00:00",
  //     status: "active",
  //     level: "Beginner",
  //     joinDate: "2023-12-01",
  //     totalSessions: 18,
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     performance: "good",
  //     notes: "Needs more practice with memorization techniques",
  //   },
  //   {
  //     id: "3",
  //     name: "Muhammad Ali",
  //     email: "muhammad.ali@email.com",
  //     course: "Tajweed Mastery",
  //     progress: 85,
  //     lastSession: "2024-01-10T14:00:00",
  //     nextSession: "2024-01-17T14:00:00",
  //     status: "active",
  //     level: "Advanced",
  //     joinDate: "2023-10-20",
  //     totalSessions: 32,
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     performance: "excellent",
  //     notes: "Ready for advanced Qira'at studies",
  //   },
  //   {
  //     id: "4",
  //     name: "Aisha Rahman",
  //     email: "aisha.rahman@email.com",
  //     course: "Kids Quran Program",
  //     progress: 30,
  //     lastSession: "2024-01-09T16:00:00",
  //     nextSession: "2024-01-14T16:00:00",
  //     status: "needs_attention",
  //     level: "Beginner",
  //     joinDate: "2024-01-05",
  //     totalSessions: 8,
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     performance: "needs_improvement",
  //     notes: "Missed last two sessions, need to follow up with parents",
  //   },
  // ];

  // const upcomingSessions = [
  //   {
  //     id: "1",
  //     student: "Ahmad Hassan",
  //     course: "Tajweed Mastery",
  //     date: "2024-01-15T10:00:00",
  //     duration: 60,
  //     type: "One-on-One",
  //     topic: "Noon Sakinah Rules - Advanced",
  //     status: "scheduled",
  //   },
  //   {
  //     id: "2",
  //     student: "Fatima Al-Zahra",
  //     course: "Quran Memorization",
  //     date: "2024-01-15T15:00:00",
  //     duration: 45,
  //     type: "One-on-One",
  //     topic: "Surah Al-Mulk - Verses 1-10",
  //     status: "scheduled",
  //   },
  //   {
  //     id: "3",
  //     student: "Group Session",
  //     course: "Tajweed Mastery",
  //     date: "2024-01-15T18:00:00",
  //     duration: 90,
  //     type: "Group",
  //     topic: "Practical Recitation Practice",
  //     status: "scheduled",
  //   },
  // ];

  // const recentActivities = [
  //   {
  //     type: "feedback_given",
  //     student: "Ahmad Hassan",
  //     action: "Provided feedback on recitation recording",
  //     time: "2 hours ago",
  //     icon: <MessageCircle className="h-4 w-4 text-blue-600" />,
  //   },
  //   {
  //     type: "session_completed",
  //     student: "Muhammad Ali",
  //     action: "Completed advanced Tajweed session",
  //     time: "1 day ago",
  //     icon: <Video className="h-4 w-4 text-green-600" />,
  //   },
  //   {
  //     type: "assignment_reviewed",
  //     student: "Fatima Al-Zahra",
  //     action: "Reviewed memorization assignment",
  //     time: "2 days ago",
  //     icon: <FileText className="h-4 w-4 text-purple-600" />,
  //   },
  // ];

  const filteredAllStudents = (allStudents || []).filter((student: any) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      filterCourse === "all" || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const filterAStudent =
    allStudents?.filter((student) => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse =
        filterCourse === "all" || student.course === filterCourse;

      return matchesSearch && matchesCourse;
    }) || [];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "needs_improvement":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "needs_attention":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Welcome back, Muzzamil Ahmed Shaikh!
        </h1>
        <p className="text-blue-700">
          Manage your students and track their Quranic learning progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {allStudents?.length}
                </p>
                <p className="text-blue-700 text-sm">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {currentStudent?.course}
                </p>
                <p className="text-blue-700 text-sm">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {/* {instructorStats.completedSessions} */}
                </p>
                <p className="text-blue-700 text-sm">Sessions Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {/* {instructorStats.averageRating} */}
                </p>
                <p className="text-blue-700 text-sm">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {/* {instructorStats.totalHours} */}
                </p>
                <p className="text-blue-700 text-sm">Teaching Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {/* ${instructorStats.monthlyEarnings} */}
                </p>
                <p className="text-blue-700 text-sm">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50">
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            My Students
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Progress Reports
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Feedback
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">
                    Student Management
                  </CardTitle>
                  <CardDescription>
                    Monitor and manage your students' progress
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-400">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="Tajweed Mastery">
                      Tajweed Mastery
                    </SelectItem>
                    <SelectItem value="Quran Memorization">
                      Quran Memorization
                    </SelectItem>
                    <SelectItem value="Kids Quran Program">
                      Kids Quran Program
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Students List */}
              <div className="space-y-4">
                {filteredAllStudents.map((student: any) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={student?.image || "/placeholder.svg"}
                          alt={student.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.name
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-blue-900">
                          {student.name}
                        </h4>
                        <p className="text-blue-700 text-sm">{student.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {student.course}
                          </Badge>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              student.country
                            )}`}
                          >
                            {/* {student?.status?.replace("_", " ") || "Unknown"} */}
                            {student?.country?.replace("_", " ") || "Unknown"}
                          </Badge>
                          <Badge
                            className={`text-xs ${getPerformanceColor(
                              student.performance
                            )}`}
                          >
                            {student?.performance?.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-blue-900">
                          {student.progress}%
                        </p>
                        <Progress
                          value={student.progress}
                          className="w-20 h-2"
                        />
                        <p className="text-xs text-blue-600 mt-1">Progress</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-blue-900">
                          {student.totalSessions}
                        </p>
                        <p className="text-xs text-blue-600">Sessions</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-blue-900">
                          {new Date(student.nextSession).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-blue-600">Next Session</p>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/instructor/students/${student.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>
                  Your scheduled classes for today and tomorrow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-blue-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold text-blue-900">
                          {session.topic}
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {session.student} • {session.course}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-blue-600 mt-1">
                          <span>
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span>
                            {new Date(session.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>{session.duration} min</span>
                          <Badge variant="outline" className="text-xs">
                            {session.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))} */}
                </div>
                <div className="mt-6">
                  <Link href="/instructor/sessions">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage All Sessions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your recent teaching activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-blue-900 font-medium text-sm">
                          {activity.action}
                        </p>
                        <p className="text-blue-700 text-xs">
                          {activity.student}
                        </p>
                      </div>
                      <span className="text-blue-600 text-xs">
                        {activity.time}
                      </span>
                    </div>
                  ))} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Student Progress Overview
              </CardTitle>
              <CardDescription>
                Track your students' learning progress across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterAStudent.map((currentStudent) => (
                  <Card
                    key={currentStudent._id}
                    className="border border-blue-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={currentStudent.image || "/placeholder.svg"}
                            alt={currentStudent.name}
                          />
                          {/* <AvatarFallback className="bg-blue-100 text-blue-600">
                            {currentStudent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback> */}
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-blue-900">
                            {currentStudent.name}
                          </h4>
                          <p className="text-blue-700 text-sm">
                            {currentStudent.course}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-blue-700">
                              Overall Progress
                            </span>
                            <span className="text-blue-900 font-semibold">
                              {/* {student.progress}% */}
                            </span>
                          </div>
                          {/* <Progress value={student.progress} className="h-2" /> */}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Sessions:</span>
                            <p className="font-semibold text-blue-900">
                              {/* {student.totalSessions} */}
                            </p>
                          </div>
                          <div>
                            <span className="text-blue-700">Level:</span>
                            <p className="font-semibold text-blue-900">
                              {/* {student.level} */}
                            </p>
                          </div>
                        </div>

                        {/* <div className="pt-3 border-t border-blue-100">
                          <Badge
                            className={`text-xs ${getPerformanceColor(
                              student.performance
                            )}`}
                          >
                            {student.performance.replace("_", " ")}
                          </Badge>
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Student Feedback & Communication
              </CardTitle>
              <CardDescription>
                Provide feedback and communicate with your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="space-y-6">
                {students.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="border border-blue-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.avatar || "/placeholder.svg"}
                            alt={student.name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-blue-900">
                            {student.name}
                          </h4>
                          <p className="text-blue-700 text-sm">
                            {student.course}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${getPerformanceColor(
                          student.performance
                        )}`}
                      >
                        {student.performance.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-900 mb-2">
                        Current Notes:
                      </h5>
                      <p className="text-blue-700 text-sm">{student.notes}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Input
                        placeholder="Add feedback or notes..."
                        className="flex-1 border-blue-200 focus:border-blue-400"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Teaching Performance
                </CardTitle>
                <CardDescription>
                  Your teaching metrics and student satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Student Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i <
                              Math.floor(currentStudent?.averageRating || 0) / 5
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {/* <span className="font-semibold text-blue-900">
                        {instructorStats.averageRating}/5
                      </span> */}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-700">
                        Student Retention Rate
                      </span>
                      <span className="text-blue-900 font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-700">
                        Course Completion Rate
                      </span>
                      <span className="text-blue-900 font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-700">Session Attendance</span>
                      <span className="text-blue-900 font-semibold">95%</span>
                    </div>
                    <Progress value={95} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Course Distribution
                </CardTitle>
                <CardDescription>
                  Student enrollment across your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Namaz Course
                      </h4>
                      <p className="text-blue-700 text-sm">
                        {
                          allStudents?.filter(
                            (student) => student.course === "namaz"
                          ).length
                        }{" "}
                        Namaz Course Students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        {" "}
                        {allStudents && allStudents.length > 0
                          ? `${Math.round(
                              (allStudents.filter((s) => s.course === "namaz")
                                .length /
                                allStudents.length) *
                                100
                            )}%`
                          : "0%"}
                        <Progress value={56} className="w-20 h-2" />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Tajweed Mastery
                      </h4>
                      <p className="text-blue-700 text-sm">
                        25 students enrolled
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">56%</p>
                      <Progress value={56} className="w-20 h-2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Nazra Quran
                      </h4>
                      <p className="text-blue-700 text-sm">
                        {
                          allStudents?.filter(
                            (student) => student.course === "nazra"
                          ).length
                        }{" "}
                        Nazra Students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        {" "}
                        {allStudents && allStudents.length > 0
                          ? `${Math.round(
                              (allStudents.filter((s) => s.course === "nazra")
                                .length /
                                allStudents.length) *
                                100
                            )}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Kids Quran Program
                      </h4>
                      <p className="text-blue-700 text-sm">
                        {
                          allStudents?.filter(
                            (student) => student.course === "Hifz"
                          ).length
                        }{" "}
                        Hifz Students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        {" "}
                        {allStudents && allStudents.length > 0
                          ? `${Math.round(
                              (allStudents.filter((s) => s.course === "Hifz")
                                .length /
                                allStudents.length) *
                                100
                            )}%`
                          : "0%"}
                      </p>
                      <Progress value={17} className="w-20 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
