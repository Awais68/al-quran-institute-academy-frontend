"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Lock,
  BookOpen,
  Clock,
  Zap,
} from "lucide-react";
import apiClient from "@/lib/api";

interface Achievement {
  _id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: "attendance" | "performance" | "milestone" | "special";
  unlocked: boolean;
  unlockedDate?: string;
  criteria: {
    attendance?: number;
    lessonsCompleted?: number;
    teacherRating?: number;
    daysStreak?: number;
  };
  progress?: number;
}

interface AchievementProps {
  studentId?: string;
}

export default function Achievement({ studentId }: AchievementProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalUnlocked: 0,
    totalAchievements: 0,
    recentUnlock: null as Achievement | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [studentId]);

  const fetchAchievements = async () => {
    try {
      const response = await apiClient.get(`/achievements/student/${studentId}`);
      if (response.data.success !== false && !response.data.error) {
        const data = response.data.data?.achievements || [];
        setAchievements(data);
        const unlocked = data.filter((a: Achievement) => a.unlocked);
        setStats({
          totalUnlocked: unlocked.length,
          totalAchievements: data.length,
          recentUnlock: unlocked[unlocked.length - 1] || null,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen,
      Calendar,
      Star,
      Target,
      Zap,
      Trophy,
      TrendingUp,
      Clock,
      Award,
    };
    const Icon = icons[iconName] || Award;
    return Icon;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      attendance: "border-green-500 bg-green-50",
      performance: "border-blue-500 bg-blue-50",
      milestone: "border-purple-500 bg-purple-50",
      special: "border-yellow-500 bg-yellow-50",
    };
    return colors[category] || "border-gray-500 bg-gray-50";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderAchievementCard = (achievement: Achievement) => {
    const Icon = getIcon(achievement.icon);
    const categoryColor = getCategoryColor(achievement.category);

    return (
      <Card
        key={achievement._id}
        className={`relative overflow-hidden transition-all hover:shadow-lg ${
          achievement.unlocked ? categoryColor : "bg-gray-50 border-gray-300"
        }`}
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Icon and Title */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                      : "bg-gray-300"
                  }`}
                >
                  {achievement.unlocked ? (
                    <Icon className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <h3
                  className={`font-bold text-lg ${
                    achievement.unlocked ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {achievement.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {achievement.description}
                </p>
              </div>

              {achievement.unlocked && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Unlocked
                </Badge>
              )}
            </div>

            {/* Progress Bar (for locked achievements) */}
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold text-gray-600">
                    {achievement.progress}%
                  </span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            )}

            {/* Unlock Date */}
            {achievement.unlocked && achievement.unlockedDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                <Calendar className="h-4 w-4" />
                <span>Unlocked on {formatDate(achievement.unlockedDate)}</span>
              </div>
            )}

            {/* Criteria */}
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 mb-2">Criteria:</p>
              <div className="flex flex-wrap gap-2">
                {achievement.criteria.attendance && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.criteria.attendance}% Attendance
                  </Badge>
                )}
                {achievement.criteria.lessonsCompleted && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.criteria.lessonsCompleted} Lessons
                  </Badge>
                )}
                {achievement.criteria.teacherRating && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.criteria.teacherRating}★ Rating
                  </Badge>
                )}
                {achievement.criteria.daysStreak && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.criteria.daysStreak} Days Streak
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);
  const attendanceAchievements = achievements.filter((a) => a.category === "attendance");
  const performanceAchievements = achievements.filter((a) => a.category === "performance");
  const milestoneAchievements = achievements.filter((a) => a.category === "milestone");
  const specialAchievements = achievements.filter((a) => a.category === "special");

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Achievements</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalAchievements}</p>
              </div>
              <Award className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Unlocked</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalUnlocked}</p>
              </div>
              <Trophy className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-900">
                  {Math.round((stats.totalUnlocked / stats.totalAchievements) * 100)}%
                </p>
              </div>
              <Target className="h-12 w-12 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievement */}
      {stats.recentUnlock && (
        <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Latest Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  {React.createElement(getIcon(stats.recentUnlock.icon), {
                    className: "h-8 w-8 text-white",
                  })}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900">{stats.recentUnlock.title}</h3>
                <p className="text-gray-600">{stats.recentUnlock.description}</p>
                {stats.recentUnlock.unlockedDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Unlocked on {formatDate(stats.recentUnlock.unlockedDate)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            {unlockedAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unlocked ({unlockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map(renderAchievementCard)}
                </div>
              </div>
            )}

            {lockedAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Locked ({lockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map(renderAchievementCard)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceAchievements.map(renderAchievementCard)}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceAchievements.map(renderAchievementCard)}
          </div>
        </TabsContent>

        <TabsContent value="milestone" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestoneAchievements.map(renderAchievementCard)}
          </div>
        </TabsContent>

        <TabsContent value="special" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialAchievements.map(renderAchievementCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
