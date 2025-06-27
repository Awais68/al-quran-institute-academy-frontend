"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AppRoutes } from "../constant/constant";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axios.get(AppRoutes.getStudent);
        console.log("API Response:", response);

        // Adjust this based on your response shape
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    getAllStudents();
  }, []);
  console.log(students);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Student Portal</h1>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student: any, index: number) => (
          <div key={index} className="mb-2 p-2 border-b">
            <p className="text-gray-700">Country: {student.country}</p>
            <p>Name: {student.name}</p>
          </div>
        ))
      )}
    </div>
  );
}
