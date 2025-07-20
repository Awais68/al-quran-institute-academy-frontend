"use client";

import { Progress } from "@/components/ui/progress";

interface CourseStatCardProps {
  course: string;
  title: string;
  allStudents: { course: string }[];
}

export default function CourseStatCard({
  course,
  title,
  allStudents,
}: CourseStatCardProps) {
  const courseCount =
    allStudents?.filter((s) => s.course === course).length || 0;
  const totalCount = allStudents?.length || 0;
  const percentage =
    totalCount > 0 ? Math.round((courseCount / totalCount) * 100) : 0;

  return (
    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
      <div>
        <h4 className="font-semibold text-blue-900">{title}</h4>
        <p className="text-blue-700 text-sm">
          {courseCount} {course} Students
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-blue-900">{percentage}%</p>
        <Progress value={percentage} className="w-20 h-2" />
      </div>
    </div>
  );
}
