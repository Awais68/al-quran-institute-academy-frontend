'use client';

import { useState } from 'react';
import LessonCalendar from '@/components/calendar/lesson-calendar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Video } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-gray-500 mt-1">Manage lessons, classes, and video sessions</p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Video className="w-4 h-4 mr-2" />
            Video Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <LessonCalendar 
            userRole="Admin" 
            isEditable={true}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Video Sessions</h2>
            <p className="text-gray-500">
              Video sessions will appear here when they are active.
            </p>
            {/* This would list active video sessions */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
