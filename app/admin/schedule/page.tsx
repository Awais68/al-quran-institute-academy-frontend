'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Video } from 'lucide-react';

// FullCalendar plus its three plugins is ~80 kB of this route's bundle and is
// only ever rendered on the Calendar tab. ssr:false because it touches the DOM
// on mount and prerendering it buys nothing on an admin-only screen.
const LessonCalendar = dynamic(
  () => import('@/components/calendar/lesson-calendar'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
  }
);

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
