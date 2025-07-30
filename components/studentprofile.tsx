"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Star,
  MessageCircle,
  Video,
  FileText,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { AppRoutes } from "@/app/constant/constant";
import axios from "axios";
import getAllStudents from "@/app/admin/page";



interface StudentProfileProps {
  studentId: string;
}

// Mock student data - in real app, this would come from an API
const getStudentData = (id: string) => {
  return {
    id: "1",
    name: "Ahmad Hassan",
    email: "ahmad.hassan@email.com",
    phone: "+1 (555) 123-4567",
    address: "New York, NY, USA",
    course: "Tajweed Mastery",
    progress: 65,
    level: "Intermediate",
    joinDate: "2023-11-15",
    totalSessions: 24,
    completedLessons: 31,
    totalLessons: 48,
    avatar: "/placeholder.svg?height=100&width=100",
    performance: "excellent",
    notes:
      "Shows great improvement in Noon Sakinah rules. Very dedicated student.",
    timezone: "EST",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "Morning",
    sessionFrequency: "3 times per week",
    parentContact: "Hassan Ali - hassan.ali@email.com",
    emergencyContact: "+1 (555) 987-6543",
    goals:
      "Master Tajweed rules and improve recitation quality for leading prayers",
    strengths: ["Quick learner", "Consistent attendance", "Good pronunciation"],
    areasForImprovement: [
      "Needs more practice with Qalqalah",
      "Speed control during recitation",
    ],
    // assignments: [
    //   {
    //     id: "1",
    //     title: "Noon Sakinah Practice Recording",
    //     dueDate: "2024-01-20",
    //     status: "pending",
    //     description:
    //       "Record recitation of Surah Al-Fatiha focusing on Noon Sakinah rules",
    //   },
    //   {
    //     id: "2",
    //     title: "Makharij Exercise Sheet",
    //     dueDate: "2024-01-18",
    //     status: "completed",
    //     description: "Complete the articulation points practice worksheet",
    //     submittedDate: "2024-01-17",
    //     grade: "A",
    //   },
    // ],
    // sessionHistory: [
    //   {
    //     date: "2024-01-12T10:00:00",
    //     duration: 60,
    //     topic: "Noon Sakinah Rules - Ikhfa",
    //     attendance: "present",
    //     notes:
    //       "Excellent progress on Ikhfa rule. Needs practice with specific letters.",
    //     rating: 5,
    //   },
    //   {
    //     date: "2024-01-10T10:00:00",
    //     duration: 60,
    //     topic: "Makharij Review",
    //     attendance: "present",
    //     notes:
    //       "Good understanding of articulation points. Ready for advanced rules.",
    //     rating: 4,
    //   },
    //   {
    //     date: "2024-01-08T10:00:00",
    //     duration: 60,
    //     topic: "Qalqalah Practice",
    //     attendance: "present",
    //     notes:
    //       "Needs more practice with Qalqalah letters. Assigned extra exercises.",
    //     rating: 3,
    //   },
    // ],
    progressData: {
      overall: 65,
      tajweedRules: 70,
      practicalApplication: 60,
      recitationQuality: 65,
      memorization: 50,
    },
  };
};

export function StudentProfile({ studentId }: StudentProfileProps) {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axios.get(AppRoutes.getAllStudents);

        // Adjust this based on your response shape
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    getAllStudents();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState("");

  const rawStudent = getStudentData(studentId);
  const student = rawStudent || {};
  // const sessionHistory = Array.isArray(student?.sessionHistory)
  //   ? student.sessionHistory
  //   : [];

  // When defining or fetching student, ensure sessionHistory is always present as an array:
  // const studentWithFallback = {
  //   ...student,
  //   sessionHistory: Array.isArray(student.sessionHistory)
  //     ? student.sessionHistory
  //     : [],
  // };

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
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/instructor">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">Student Profile</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={
            isEditing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        >
          {isEditing ? (
            <Save className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Info Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 sticky top-24">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage
                    src={student.avatar || "/placeholder.svg"}
                    alt={student.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-blue-900">
                  {student.name}
                </h2>
                <p className="text-blue-700">{student.course}</p>
                <Badge
                  className={`mt-2 ${getPerformanceColor(student.performance)}`}
                >
                  {student.performance.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700">{student.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700">{student.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700">{student.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700">
                    Joined {new Date(student.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {student.totalSessions}
                    </p>
                    <p className="text-blue-700 text-sm">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {student.progress}%
                    </p>
                    <p className="text-blue-700 text-sm">Progress</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {student.completedLessons}
                    </p>
                    <p className="text-blue-700 text-sm">Lessons</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {student.level}
                    </p>
                    <p className="text-blue-700 text-sm">Level</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Video className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-blue-50">
              <TabsTrigger
                value="progress"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Sessions
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Assignments
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="mt-8">
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">
                      Learning Progress
                    </CardTitle>
                    <CardDescription>
                      Detailed breakdown of student's progress across different
                      areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Overall Progress
                          </span>
                          <span className="text-blue-700">
                            {student.progressData.overall}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressData.overall}
                          className="h-3"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Tajweed Rules
                          </span>
                          <span className="text-blue-700">
                            {student.progressData.tajweedRules}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressData.tajweedRules}
                          className="h-3"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Practical Application
                          </span>
                          <span className="text-blue-700">
                            {student.progressData.practicalApplication}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressData.practicalApplication}
                          className="h-3"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Recitation Quality
                          </span>
                          <span className="text-blue-700">
                            {student.progressData.recitationQuality}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressData.recitationQuality}
                          className="h-3"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Memorization
                          </span>
                          <span className="text-blue-700">
                            {student.progressData.memorization}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressData.memorization}
                          className="h-3"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900">
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {student.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-blue-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900">
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {student.areasForImprovement.map((area, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-blue-700">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">
                    Session History
                  </CardTitle>
                  <CardDescription>
                    Complete record of all sessions with this student
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <div className="space-y-4">
                    {sessionHistory.map((session, index) => (
                      <div
                        key={index}
                        className="border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {session.topic}
                            </h4>
                            <p className="text-blue-700 text-sm">
                              {new Date(session.date).toLocaleDateString()} •{" "}
                              {new Date(session.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              • {session.duration} minutes
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                session.attendance === "present"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {session.attendance}
                            </Badge>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < session.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-blue-700 text-sm">
                            {session.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent> */}
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">
                        Assignments
                      </CardTitle>
                      <CardDescription>
                        Track and manage student assignments
                      </CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      New Assignment
                    </Button>
                  </div>
                </CardHeader>
                {/* <CardContent>
                  <div className="space-y-4">
                    {student.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {assignment.title}
                            </h4>
                            <p className="text-blue-700 text-sm">
                              Due:{" "}
                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getStatusColor(assignment.status)}
                            >
                              {assignment.status}
                            </Badge>
                            {assignment.grade && (
                              <Badge className="bg-green-100 text-green-700">
                                Grade: {assignment.grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-blue-700 text-sm mb-3">
                          {assignment.description}
                        </p>
                        {assignment.submittedDate && (
                          <p className="text-green-600 text-sm">
                            Submitted:{" "}
                            {new Date(
                              assignment.submittedDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {assignment.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent> */}
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">
                    Instructor Notes
                  </CardTitle>
                  <CardDescription>
                    Add and manage notes about this student's progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Current Notes:
                      </h4>
                      <p className="text-blue-700">{student.notes}</p>
                    </div>

                    <div>
                      <Label
                        htmlFor="newNote"
                        className="text-blue-900 font-semibold"
                      >
                        Add New Note
                      </Label>
                      <Textarea
                        id="newNote"
                        placeholder="Enter your notes about the student's progress, behavior, or any observations..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mt-2 border-blue-200 focus:border-blue-400"
                        rows={4}
                      />
                      <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Note
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Learning Goals
                      </h4>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-700">{student.goals}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">
                    Student Settings
                  </CardTitle>
                  <CardDescription>
                    Manage student preferences and course settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="level"
                          className="text-blue-900 font-semibold"
                        >
                          Current Level
                        </Label>
                        <Select defaultValue={student.level.toLowerCase()}>
                          <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="timezone"
                          className="text-blue-900 font-semibold"
                        >
                          Timezone
                        </Label>
                        <Select defaultValue={student.timezone.toLowerCase()}>
                          <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="est">
                              Eastern Time (EST)
                            </SelectItem>
                            <SelectItem value="cst">
                              Central Time (CST)
                            </SelectItem>
                            <SelectItem value="mst">
                              Mountain Time (MST)
                            </SelectItem>
                            <SelectItem value="pst">
                              Pacific Time (PST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-blue-900 font-semibold">
                        Preferred Session Days
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={day.toLowerCase()}
                              defaultChecked={student.preferredDays.includes(
                                day
                              )}
                              className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                              htmlFor={day.toLowerCase()}
                              className="text-blue-700"
                            >
                              {day}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="frequency"
                        className="text-blue-900 font-semibold"
                      >
                        Session Frequency
                      </Label>
                      <Select defaultValue="3-week">
                        <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-week">
                            2 sessions per week
                          </SelectItem>
                          <SelectItem value="3-week">
                            3 sessions per week
                          </SelectItem>
                          <SelectItem value="4-week">
                            4 sessions per week
                          </SelectItem>
                          <SelectItem value="5-week">
                            5 sessions per week
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="parentContact"
                        className="text-blue-900 font-semibold"
                      >
                        Parent/Guardian Contact
                      </Label>
                      <Input
                        id="parentContact"
                        defaultValue={student.parentContact}
                        className="mt-2 border-blue-200 focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="emergencyContact"
                        className="text-blue-900 font-semibold"
                      >
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        defaultValue={student.emergencyContact}
                        className="mt-2 border-blue-200 focus:border-blue-400"
                      />
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
