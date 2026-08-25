"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Clock, Star, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TeacherStatsProps {
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalSessions: number;
    upcomingSessions: number;
    completedSessions: number;
    averageRating: number;
    totalHours: number;
    monthlyEarnings: number;
  };
}

export default function TeacherStats({ stats }: TeacherStatsProps) {
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} active`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Sessions",
      value: stats.completedSessions,
      subtitle: `${stats.upcomingSessions} upcoming`,
      icon: BookOpen,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Teaching Hours",
      value: stats.totalHours,
      subtitle: "this month",
      icon: Clock,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      subtitle: "out of 5.0",
      icon: Star,
      gradient: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-blue-900">
                        {stat.value}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
