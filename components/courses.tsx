"use client";

import { useState } from "react";
import { Book, BookOpen, Bookmark, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const coursesData = [
  {
    id: 1,
    title: "Hifz-ul-Quran",
    description:
      "Complete memorization of the Holy Quran with proper tajweed and understanding of the text.",
    duration: "3-5 years",
    ageGroup: "8-15 years",
    icon: <BookOpen className="h-10 w-10 text-blue-600" />,
  },
  {
    id: 2,
    title: "Nazra",
    description:
      "Complete memorization of the Holy Quran with proper tajweed and understanding of the text.",
    duration: "1-2 years",
    ageGroup: "8-15 years",
    icon: <BookOpen className="h-10 w-10 text-blue-600" />,
  },
  {
    id: 3,
    title: "Tajweed",
    description:
      "Learn the proper pronunciation and recitation rules of the Holy Quran.",
    duration: "1-2 years",
    ageGroup: "All ages",
    icon: <Book className="h-10 w-10 text-blue-600" />,
  },
  {
    id: 4,
    title: "Islamic Studies",
    description:
      "Comprehensive study of Islamic principles, history, and practices.",
    duration: "Ongoing",
    ageGroup: "All ages",
    icon: <Bookmark className="h-10 w-10 text-blue-600" />,
  },
  {
    id: 5,
    title: "Arabic Language",
    description:
      "Learn to read, write, and speak Arabic with focus on Quranic Arabic.",
    duration: "2-3 years",
    ageGroup: "10+ years",
    icon: <FileText className="h-10 w-10 text-blue-600" />,
  },
  {
    id: 6,
    title: "Fiqh (Islamic Jurisprudence)",
    description:
      "Study of Islamic law and the principles of Islamic jurisprudence.",
    duration: "2-4 years",
    ageGroup: "15+ years",
    icon: <Users className="h-10 w-10 text-blue-600" />,
  },
];

export default function Courses() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section id="courses" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Programs
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Al-Quran Institute Online offers a variety of programs designed to
            provide comprehensive Islamic education for students of all ages and
            backgrounds.
          </p>
        </div>

        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {coursesData.map((course) => (
            <button
              key={course.id}
              onClick={() => setActiveTab(course.id)}
              className={cn(
                "px-4 py-2 rounded-md text-sm md:text-base font-medium transition-colors",
                activeTab === course.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              )}
            >
              {course.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className={cn(
                "transition-opacity duration-300",
                activeTab === course.id
                  ? "block opacity-100"
                  : "hidden opacity-0"
              )}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-blue-50 p-4 rounded-full">{course.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Duration
                      </h4>
                      <p>{course.duration}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Age Group
                      </h4>
                      <p>{course.ageGroup}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
