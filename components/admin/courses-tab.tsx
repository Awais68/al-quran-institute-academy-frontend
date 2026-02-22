"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";

const courses = [
  { name: "Qaida", description: "Basic Arabic reading", students: 45, duration: "3 months", level: "Beginner" },
  { name: "Tajweed", description: "Proper Quran recitation", students: 38, duration: "6 months", level: "Intermediate" },
  { name: "Nazra", description: "Quran reading with fluency", students: 52, duration: "12 months", level: "Intermediate" },
  { name: "Hifz", description: "Quran memorization", students: 28, duration: "2-4 years", level: "Advanced" },
  { name: "Namaz", description: "Prayer and rituals", students: 67, duration: "2 months", level: "Beginner" },
  { name: "Arabic", description: "Arabic language", students: 41, duration: "12 months", level: "All Levels" },
  { name: "Islamic Studies", description: "Islamic knowledge", students: 55, duration: "Ongoing", level: "All Levels" },
];

export default function CoursesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Courses Overview</h2>
        <p className="text-gray-600">Manage and monitor all available courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <Badge>{course.level}</Badge>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    Students
                  </span>
                  <span className="font-semibold">{course.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    Duration
                  </span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
