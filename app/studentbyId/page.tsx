"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/app/context/AuthContext"; // adjust path
import { AppRoutes } from "@/app/constant/constant";

import StudentProfile from "@/app/components/StudentProfile"; // adjust path

export default function DashboardPage() {
  return (
    <>
    
  const { user } = useContext(AuthContext); // auth context se user mila
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?._id) return; // context me user aaya?

      try {
        const response = await axios.get(
          `${AppRoutes.getAStudent}/${user._id}`
        );
        setStudent(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Student fetch failed:", err.message);
        setError("Student not found");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>No data found.</p>;


  

  return (
    <div className="p-4 bg-white shadow rounded-md mt-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Student Details</h2>
      <p>
        <strong>Name:</strong> {student.name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <p>
        <strong>Course:</strong> {student.course}
      </p>
      <p>
        <strong>Phone:</strong> {student.phone}
      </p>
      <p>
        <strong>City:</strong> {student.city}
      </p>
      {/* Add more fields as needed */}
    </div>)
    </>
);
}


// export default StudentProfile;
