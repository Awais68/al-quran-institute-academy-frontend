"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calendar, MessageSquare, Star, Award, BookOpen, Clock } from "lucide-react";
import apiClient from "@/lib/api";

interface TeacherFeedback {
  _id: string;
  date: string;
  remarks: string;
  rating: number;
  improvements: string[];
  teacherName: string;
}

interface StudentProgress {
  overall: number;
  attendance: number;
  recitation: number;
  memorization: number;
  tajweed: number;
  teacherFeedback: TeacherFeedback[];
}

interface ProgressProps {
  studentId?: string;
}

export default function Progress({ studentId }: ProgressProps) {
  const [progress, setProgress] = useState<StudentProgress>({
    overall: 0,
    attendance: 0,
    recitation: 0,
    memorization: 0,
    tajweed: 0,
    teacherFeedback: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchProgress();
    }
  }, [studentId]);

  const fetchProgress = async () => {
    try {
      const response = await apiClient.get(`/progress/student/${studentId}`);
      if (response.data.success !== false && !response.data.error) {
        const data = response.data.data || {};
        setProgress({
          overall: data.overall || 0,
          attendance: data.attendance || 0,
          recitation: data.recitation || 0,
          memorization: data.memorization || 0,
          tajweed: data.tajweed || 0,
          teacherFeedback: data.teacherFeedback || [],
        });
      }
      setLoading(false);
    } catch (error) {
      console.warn("Failed to fetch progress:", error);
      setLoading(false);
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-900">Overall Progress</CardTitle>
              <CardDescription>Your learning journey starts here</CardDescription>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-blue-600">{progress.overall}%</span>
              </div>
              <ProgressBar value={progress.overall} className={`h-3 ${getProgressColor(progress.overall)}`} />
            </div>
            
            <Separator />

            {/* Subject-wise Progress */}
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject Progress
              </h3>

              {/* Attendance */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Attendance</span>
                  <span className="text-sm font-semibold">{progress.attendance}%</span>
                </div>
                <ProgressBar value={progress.attendance} className="h-2" />
              </div>

              {/* Recitation */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Recitation (Tilawah)</span>
                  <span className="text-sm font-semibold">{progress.recitation}%</span>
                </div>
                <ProgressBar value={progress.recitation} className="h-2" />
              </div>

              {/* Memorization */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Memorization (Hifz)</span>
                  <span className="text-sm font-semibold">{progress.memorization}%</span>
                </div>
                <ProgressBar value={progress.memorization} className="h-2" />
              </div>

              {/* Tajweed */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Tajweed Rules</span>
                  <span className="text-sm font-semibold">{progress.tajweed}%</span>
                </div>
                <ProgressBar value={progress.tajweed} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Feedback Section */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Teacher Feedback & Remarks
          </CardTitle>
          <CardDescription>Track your progress through teacher evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          {progress.teacherFeedback.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No feedback yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Your teacher will provide feedback after lessons
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.teacherFeedback.map((feedback) => (
                <Card key={feedback._id} className="border-l-4 border-l-blue-500 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-blue-900">{feedback.teacherName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(feedback.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRatingStars(feedback.rating)}
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="bg-white p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-700">{feedback.remarks}</p>
                      </div>

                      {/* Improvements Needed */}
                      {feedback.improvements && feedback.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            Areas for Improvement:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {feedback.improvements.map((improvement, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-yellow-50 border-yellow-300 text-yellow-800"
                              >
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Progress Tracking</p>
              <p className="text-sm text-blue-700 mt-1">
                Your progress starts from 0% and increases based on your teacher's evaluations, 
                attendance, and lesson completion. Keep attending classes regularly and practice 
                to see your progress grow!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
