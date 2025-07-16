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
import Spinner from "./loader";
import { AuthContext } from "@/app/context/AuthContext";

export function StudentDashboard() {
  const { user } = useContext(AuthContext);
  if (!user) return <div>No student data found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 justify-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        Welcome back, {user.fullName || "Student"}!
      </h1>
      <p className="text-blue-700">
        Continue your Quranic journey and track your progress.
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Father Name:</strong> {user.fatherName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Country:</strong> {user.country}
          </p>
          <p>
            <strong>City:</strong> {user.city}
          </p>
          <p>
            <strong>Course:</strong> {user.course}
          </p>
          <p>
            <strong>Suitable Time:</strong> {user.suitableTime}
          </p>
          <p>
            <strong>App:</strong> {user.app}
          </p>
          <p>
            <strong>DOB:</strong>{" "}
            {user.dob ? new Date(user.dob).toLocaleDateString() : ""}
          </p>
        </div>
        <div className="flex justify-center items-center">
          {user.image && (
            <img
              src={user.image}
              alt={user.fullName || "Student"}
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="6" x2="6" y1="3" y2="15" />
    </svg>
  );
}
