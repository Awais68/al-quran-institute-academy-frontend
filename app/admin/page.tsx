"use client"; // only if you're using this inside Next.js app/page component
import React, { useEffect, useState } from "react";
import { AppRoutes } from "../constant/constant";
import axios from "axios";
import Header from "@/components/header";

export default function getAllStudents() {
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
    <>
      <Header />
      <div className="grid grid-cols-3 justify-center w-full  mt-16 relative">
        {students.map((data, index) => (
          <div className="max-w-screen-sm bg-blue-50 m-5 px-4 py-6  border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <div className="flex justify-center mb-4">
                <img
                  className="rounded-full h-40 w-40 object-cover"
                  src={data.image}
                  alt="Student Image"
                />
              </div>
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {data.name}
                </h5>
              </a>
              <div className=" flex m-2 justify-between">
                <div className=" flex  font-normal text-gray-700 dark:text-gray-400 ">
                  {data.course}
                </div>
                <div className="  ">{data.country}</div>
              </div>
              <a
                href="/students"
                className="flex items-center px-3 py-2  font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                See Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
