"use client";
"use client";

import axios from "axios";
import { useEffect, useState, useContext } from "react";
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
import {
  BookOpen,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  Award,
  MessageCircle,
  Video,
  Star,
} from "lucide-react";
import { AppRoutes } from "@/app/constant/constant";

import { AuthContext } from "@/app/context/AuthContext";

import { DefaultTooltipContent } from "recharts";
import { useCallback } from "react";
import Spinner from "@/components/loader";

export default function Student() {
  const { user } = useContext(AuthContext);
  if (!user) return <div>No student data found.</div>;
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentUser, setCurrentUser] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]); // <-- Add this line
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]); // <-- Add this line
  const [achievements, setAchievements] = useState<any[]>([]); // <-- Add this line
  const [recentActivities, setRecentActivities] = useState<any[]>([]); // <-- Add this line

  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
    setSelectedCity(""); // Reset city when country changes
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(AppRoutes.getCurrentUser);
        console.log("Api response", response);
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Error fetching currentStudent/user", error);
      }
    };
    getCurrentUser();
  }, []);
  console.log("CurrentStudentById", currentUser);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Welcome back, Ahmad!
        </h1>
        <p className="text-blue-700">
          Continue your Quranic journey and track your progress.
        </p>
        <div>
          <Button className="bg-red-700 p-2 mx-4">LogOut</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">1</p>
                <p className="text-blue-700 text-sm">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">17</p>
                <p className="text-blue-700 text-sm">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">24</p>
                <p className="text-blue-700 text-sm">Study Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">2</p>
                <p className="text-blue-700 text-sm">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50">
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            My Courses
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Progress
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-8">
          <div className="space-y-6">
            {enrolledCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-white/80 backdrop-blur-sm border-blue-200/50"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">
                        {course.title}
                      </CardTitle>
                      <CardDescription>
                        with {course.instructor}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-900 font-semibold">
                            Course Progress
                          </span>
                          <span className="text-blue-700">
                            {course.completedLessons}/{course.totalLessons}{" "}
                            lessons
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-3" />
                        <p className="text-sm text-blue-600 mt-1">
                          {course.progress}% complete
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Next Lesson
                          </h4>
                          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <Play className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-700">
                              {course.nextLesson}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Next Session
                          </h4>
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-600" />
                            <span className="text-green-700">
                              {new Date(
                                course.nextSessionDate
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                course.nextSessionDate
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Session
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Instructor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-8">
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>
                  Your scheduled classes and sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900">
                            {session.topic}
                          </h4>
                          <p className="text-blue-700 text-sm">
                            {session.course} • {session.instructor}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-blue-600 mt-1">
                            <span>
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span>
                              {new Date(session.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>{session.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-900 font-semibold">
                        Overall Progress
                      </span>
                      <span className="text-blue-700">35%</span>
                    </div>
                    <Progress value={35} className="h-3" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-900 font-semibold">
                        Tajweed Rules
                      </span>
                      <span className="text-blue-700">60%</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-900 font-semibold">
                        Practical Application
                      </span>
                      <span className="text-blue-700">25%</span>
                    </div>
                    <Progress value={25} className="h-3" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-900 font-semibold">
                        Recitation Quality
                      </span>
                      <span className="text-blue-700">40%</span>
                    </div>
                    <Progress value={40} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Recent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          SA
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-blue-900 text-sm">
                          Sheikh Ahmed Al-Qari
                        </p>
                        <p className="text-blue-600 text-xs">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-blue-700 text-sm">
                      "Excellent improvement in your Noon Sakinah pronunciation.
                      Keep practicing the Ikhfa rule with the letters we
                      discussed."
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-green-100 text-green-600">
                          SA
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-blue-900 text-sm">
                          Sheikh Ahmed Al-Qari
                        </p>
                        <p className="text-blue-600 text-xs">1 week ago</p>
                      </div>
                    </div>
                    <p className="text-blue-700 text-sm">
                      "Great work on the Makharij exercises. Your articulation
                      points are much clearer now. Ready for the next level!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className={`bg-white/80 backdrop-blur-sm border-blue-200/50 ${
                  achievement.earned ? "ring-2 ring-blue-200" : "opacity-75"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      achievement.earned ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <div>
                      <Badge className="bg-green-100 text-green-700 mb-2">
                        Earned
                      </Badge>
                      <p className="text-xs text-blue-600">
                        Earned on{" "}
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Progress
                        value={achievement.progress}
                        className="h-2 mb-2"
                      />
                      <p className="text-xs text-blue-600">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your learning activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-blue-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">
                        {activity.title}
                      </h4>
                      <p className="text-blue-700 text-sm">{activity.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 text-sm">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <p className="text-blue-500 text-xs">
                        {new Date(activity.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
