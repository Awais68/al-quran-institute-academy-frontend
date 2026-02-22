"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Video, Calendar, Clock, User } from "lucide-react";

interface SessionsTabProps {
  students: any[];
}

export default function SessionsTab({ students }: SessionsTabProps) {
  // Generate placeholder sessions from students
  const sessions = students.slice(0, 10).map((student, index) => ({
    id: index + 1,
    studentName: student.name,
    course: student.course,
    schedule: student.suitableTime || "Not set",
    platform: student.app || "WhatsApp",
    status: ["scheduled", "completed", "in-progress"][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Session Management</h2>
          <p className="text-gray-600">Schedule and track all teaching sessions</p>
        </div>
        <Button>Schedule New Session</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{session.studentName}</h3>
                    <p className="text-sm text-gray-600">{session.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{session.schedule}</span>
                  </div>
                  <Badge variant="outline">{session.platform}</Badge>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>

                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
