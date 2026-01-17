"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalyticsDashboardProps {
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalRevenue: number;
    pendingPayments: number;
    activeCourses: number;
    completedSessions: number;
    upcomingSessions: number;
    paidStudents: number;
    unpaidStudents: number;
  };
}

export default function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const paymentRate = stats.totalStudents > 0 
    ? Math.round((stats.paidStudents / stats.totalStudents) * 100) 
    : 0;

  const activeRate = stats.totalStudents > 0 
    ? Math.round((stats.activeStudents / stats.totalStudents) * 100) 
    : 0;

  const courses = [
    { name: "Quran Reading (Nazara)", students: Math.floor(stats.totalStudents * 0.25) },
    { name: "Quran Memorization (Hifz)", students: Math.floor(stats.totalStudents * 0.20) },
    { name: "Tajweed Rules", students: Math.floor(stats.totalStudents * 0.18) },
    { name: "Quran Translation", students: Math.floor(stats.totalStudents * 0.15) },
    { name: "Tafsir", students: Math.floor(stats.totalStudents * 0.12) },
    { name: "Islamic Studies for Kids", students: Math.floor(stats.totalStudents * 0.06) },
    { name: "Arabic Language", students: Math.floor(stats.totalStudents * 0.04) },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalRevenue}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stats.paidStudents} students paid
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${stats.pendingPayments}
                  </p>
                  <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {stats.unpaidStudents} students pending
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.activeStudents}
                  </p>
                  <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {activeRate}% of total
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment and Activity Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Collection Rate
                </span>
                <span className="text-sm font-bold text-green-600">{paymentRate}%</span>
              </div>
              <Progress value={paymentRate} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Students</p>
                <p className="text-2xl font-bold text-green-600">{stats.paidStudents}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unpaid Students</p>
                <p className="text-2xl font-bold text-red-600">{stats.unpaidStudents}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Fee per Student</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">$100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Course Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {course.name}
                    </span>
                    <span className="text-sm font-bold text-blue-600">{course.students}</span>
                  </div>
                  <Progress 
                    value={(course.students / stats.totalStudents) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completed Sessions
                </span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.completedSessions}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upcoming Sessions
                </span>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingSessions}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Courses
                </span>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeCourses}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{stats.totalStudents}</p>
              <p className="text-sm opacity-90">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">${stats.totalRevenue}</p>
              <p className="text-sm opacity-90">Revenue Collected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{paymentRate}%</p>
              <p className="text-sm opacity-90">Payment Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{activeRate}%</p>
              <p className="text-sm opacity-90">Active Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
