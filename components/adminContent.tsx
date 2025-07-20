"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant";
import { Card, CardContent } from "./ui/card";
import { Video, Users, BookOpen } from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function AdminContent() {
  const [students, setStudents] = useState<any[]>([]);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axios.get(AppRoutes.getStudent);
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    getAllStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push(`/studentbyId/${students}`);
  };

  // Get user image and name fallback
  const profileImg =
    user?.avatar || user?.profileImage || user?.image || undefined;
  const userName = user?.name || user?.email || "U";

  return (
    <div className="p-4">
      {/* Top bar with profile and logout */}
      <div className="flex justify-end items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profileImg} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-800">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow text-sm"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6 justify-center my-4">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 min-w-[220px]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {students.length}
                </p>
                <p className="text-blue-700 text-sm">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 min-w-[220px]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">05</p>
                <p className="text-blue-700 text-sm">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 min-w-[220px]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">05</p>
                <p className="text-blue-700 text-sm">Session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 min-w-[220px]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">--</p>
                <p className="text-blue-700 text-sm">Sessions Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-10">
        {students.map((data, index) => (
          <div
            key={index}
            className="bg-blue-50 px-4 py-6 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex justify-center mb-4">
              <img
                className="rounded-full h-40 w-40 object-cover"
                src={data.image}
                alt="Student Image"
              />
            </div>
            <div className="p-2  ">
              <h5 className="flex shadow-inner rounded-lg justify-center mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.name}
              </h5>
              <div className="flex justify-between text-md text-gray-700 dark:text-gray-400 mb-3">
                <h3>{data.fatherName}</h3>

                <h3>{data.course}</h3>
              </div>
              <div className="flex justify-between text-md text-gray-700 dark:text-gray-400 mb-3">
                <h3>{data.email}</h3>
                <h3>{data.suitableTime}</h3>
              </div>
              <div className="flex justify-between text-md text-gray-700 dark:text-gray-400 mb-3">
                <h3>{data.country}</h3>
                <h3>{data?.city}</h3>
              </div>

              <div className="flex justify-between text-md text-gray-700 dark:text-gray-400 mb-3">
                <h3>{data.dob}</h3>
                <h3>{data?.age}</h3>
              </div>
              <div className="flex justify-between shadow-lg rounded-lg  text-gray-700 dark:text-gray-400 mb-3">
                <h3>{data.gender}</h3>
                <h3>{data.phone}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
