"use client";
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

import React, { useEffect, useState } from "react";
import { AppRoutes } from "@/app/constant/constant";
import axios from "axios";
import Header from "@/components/header";
import LoadingComponent from "@/components/loader";
import { useParams } from "next/navigation";

interface Student {
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
  role: "Student";
  roll_no: "";
}

export default function CurrentStudent() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/getAStudent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(res.data.data);
        setLoading(false);
      } catch (err: any) {
        // Log the error details
        console.error("Student fetch error:", err);
        // Try to show the backend error message if available
        let message = "Failed to fetch student";
        if (err.response && err.response.data) {
          if (typeof err.response.data === "string") {
            message = err.response.data;
          } else if (err.response.data.message) {
            message = err.response.data.message;
          } else {
            message = JSON.stringify(err.response.data);
          }
        } else if (err.message) {
          message = err.message;
        }
        setError(message);
        setLoading(false);
      }
    };
    if (id) fetchCurrentStudent();
    else {
      setError("No student ID provided in URL.");
      setLoading(false);
    }
  }, [id]);

  if (loading)
    return (
      <div className=" min-h-screen flex justify-center items-center">
        <LoadingComponent />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!student) return <div>No student data found.</div>;

  // ...rest of your component code remains unchanged...
  // (keep all the enrolledCourses, upcomingSessions, achievements, etc. and the return JSX)
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
