"use client"; // only if you're using this inside Next.js app/page component
import React, { useEffect, useState } from "react";
import { AppRoutes } from "../constant/constant";
import axios from "axios";

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
    <div className="grid grid-cols-3 justify-center w-full  mt-6">
      {students.map((data, index) => (
        <div className="max-w-sm bg-blue-50 m-5 px-4  border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img
              className="rounded-t-lg h-40 w-full "
              src={data.image}
              alt="Blog Thumbnail"
            />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.name}
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Read more
              {/* <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg> */}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
