"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Video,
  Users,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SessionsManagementProps {
  stats: {
    completedSessions: number;
    upcomingSessions: number;
    activeCourses: number;
  };
}

export default function SessionsManagement({ stats }: SessionsManagementProps) {
  const upcomingSessions = [
    {
      id: 1,
      course: "Quran Reading (Nazara)",
      instructor: "Sheikh Ahmed Al-Qari",
      date: "2026-01-13",
      time: "10:00 AM",
      duration: "60 mins",
      students: 5,
      type: "Group",
    },
    {
      id: 2,
      course: "Tajweed Rules",
      instructor: "Ustadh Muhammad Ali",
      date: "2026-01-13",
      time: "2:00 PM",
      duration: "45 mins",
      students: 1,
      type: "One-on-One",
    },
    {
      id: 3,
      course: "Quran Memorization (Hifz)",
      instructor: "Sheikh Ibrahim Hassan",
      date: "2026-01-14",
      time: "9:00 AM",
      duration: "90 mins",
      students: 3,
      type: "Group",
    },
    {
      id: 4,
      course: "Quran Translation",
      instructor: "Dr. Fatima Zahra",
      date: "2026-01-14",
      time: "4:00 PM",
      duration: "60 mins",
      students: 4,
      type: "Group",
    },
    {
      id: 5,
      course: "Arabic Language",
      instructor: "Ustadh Omar Farooq",
      date: "2026-01-15",
      time: "11:00 AM",
      duration: "45 mins",
      students: 2,
      type: "One-on-One",
    },
  ];

  const completedSessions = [
    {
      id: 1,
      course: "Quran Reading (Nazara)",
      instructor: "Sheikh Ahmed Al-Qari",
      date: "2026-01-11",
      time: "10:00 AM",
      duration: "60 mins",
      students: 5,
      attendance: 5,
    },
    {
      id: 2,
      course: "Tajweed Rules",
      instructor: "Ustadh Muhammad Ali",
      date: "2026-01-11",
      time: "2:00 PM",
      duration: "45 mins",
      students: 1,
      attendance: 1,
    },
    {
      id: 3,
      course: "Quran Memorization (Hifz)",
      instructor: "Sheikh Ibrahim Hassan",
      date: "2026-01-10",
      time: "9:00 AM",
      duration: "90 mins",
      students: 3,
      attendance: 2,
    },
    {
      id: 4,
      course: "Islamic Studies for Kids",
      instructor: "Sister Aisha Rahman",
      date: "2026-01-10",
      time: "3:00 PM",
      duration: "60 mins",
      students: 6,
      attendance: 6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Completed Sessions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.completedSessions}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Upcoming Sessions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingSessions}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Active Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.activeCourses}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Upcoming Sessions ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Completed Sessions ({completedSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                              {session.course}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Instructor: {session.instructor}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {session.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span>{session.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span>{session.students} students</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                              {session.course}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Instructor: {session.instructor}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span>{session.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span>{session.attendance}/{session.students} attended</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
