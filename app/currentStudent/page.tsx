"use client";

// After successful login

// import { CURRENT_STUDENT_API } from "../constants/api";
import React, { useEffect, useState } from "react";
import { AppRoutes } from "@/app/constant/constant";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define Student type for type safety
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
}

const CurrentStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("API URL:", AppRoutes.CURRENT_STUDENT_API);
        console.log("Token:", token);
        const response = await axios.get(AppRoutes.CURRENT_STUDENT_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assume response.data.data is an array of students
        setStudents(
          Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        );
        setLoading(false);
      } catch (err) {
        console.log("Axios error:", err);
        setError("Failed to fetch students");
        setLoading(false);
      }
    };
    fetchCurrentStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!students || students.length === 0)
    return <div>No student data found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 py-8 px-2">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {students.map((student, index) => (
          <Card
            key={student._id || index}
            className="bg-white/80 backdrop-blur-sm border-blue-100/50"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-900 mb-2">
                Welcome back, {student.name || "Student"}!
              </CardTitle>
              <CardDescription className="text-blue-700">
                Continue your Quranic journey and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Father Name:</strong> {student.fatherName}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {student.phone}
                  </p>
                  <p>
                    <strong>Age:</strong> {student.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {student.gender}
                  </p>
                  <p>
                    <strong>Country:</strong> {student.country}
                  </p>
                  <p>
                    <strong>City:</strong> {student.city}
                  </p>
                  <p>
                    <strong>Course:</strong> {student.course}
                  </p>
                  <p>
                    <strong>Suitable Time:</strong> {student.suitableTime}
                  </p>
                  <p>
                    <strong>App:</strong> {student.app}
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    {student.dob
                      ? new Date(student.dob).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  {student.image && (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CurrentStudent;

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CurrentStudent from "./pages/CurrentStudent";

// <Router>
//   <Routes>
//     {/* ...other routes */}
//     <Route path="/current-student" element={<CurrentStudent />} />
//   </Routes>
// </Router>

// Step	What to Check/Do
// Token present?	Check localStorage/session/cookies after login
// Token sent in header?	Authorization: Bearer <token> in every request
// Token valid?	If expired, log in again
// API URL correct?	Should be http://localhost:4000/currentStudent
