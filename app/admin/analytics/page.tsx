"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import Loader from "@/components/loader";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeCourses: 7,
    completedSessions: 0,
    upcomingSessions: 0,
    paidStudents: 0,
    unpaidStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get("/fees/analytics");
      if (response.data.success) {
        const data = response.data.data.overview;
        setStats({
          totalStudents: data.totalStudents,
          activeStudents: data.activeStudents,
          totalRevenue: data.totalRevenue,
          pendingPayments: data.unpaidStudents + data.partialStudents,
          activeCourses: 7,
          completedSessions: 0,
          upcomingSessions: 0,
          paidStudents: data.paidStudents,
          unpaidStudents: data.unpaidStudents
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return <AnalyticsDashboard stats={stats} />;
}
