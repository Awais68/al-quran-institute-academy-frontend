"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppRoutes } from "@/app/constant/constant";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StudentDashboard } from "@/components/student-dashboard";

interface Student {
  _id?: string;
  fullName?: string;
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
}

const CurrentStudent = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(AppRoutes.getCurrentUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("ApiResponse==>>>>", response);
        setStudent(response.data.data); // Expecting a single student object
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch student");
        setLoading(false);
      }
    };
    fetchCurrentStudent();
  }, []);
  console.log("Student==>", student);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!student) return <div>No student data found.</div>;

  return (
    <div>
      <h1>well Come Your Student Profile</h1>
      <h1>{student._id}</h1>
      <StudentDashboard />
    </div>
  );
};

export default CurrentStudent;
