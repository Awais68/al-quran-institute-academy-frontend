'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, BookOpen, Video, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';

interface LessonEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  studentId?: string;
  studentName?: string;
  teacherId?: string;
  teacherName?: string;
  course?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface LessonCalendarProps {
  userRole?: 'Admin' | 'Teacher' | 'Student';
  userId?: string;
  isEditable?: boolean;
}

export default function LessonCalendar({ userRole = 'Student', userId, isEditable = false }: LessonCalendarProps) {
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Form state for creating/editing lessons
  const [lessonForm, setLessonForm] = useState({
    studentId: '',
    teacherId: '',
    course: '',
    startTime: '',
    endTime: '',
    notes: '',
    meetingLink: ''
  });

  const courses = [
    'Qaida',
    'Tajweed',
    'Nazra',
    'Hifz',
    'Namaz',
    'Arabic',
    'Islamic Studies'
  ];

  useEffect(() => {
    fetchLessons();
  }, [userId]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // This would be your actual API endpoint
      // For now, using mock data
      const response = await apiClient.get('/lessons', {
        params: userRole !== 'Admin' ? { userId } : undefined
      });

      const formattedEvents = response.data.lessons?.map((lesson: any) => ({
        id: lesson._id,
        title: `${lesson.course} - ${lesson.studentName}`,
        start: lesson.startTime,
        end: lesson.endTime,
        studentId: lesson.studentId,
        studentName: lesson.studentName,
        teacherId: lesson.teacherId,
        teacherName: lesson.teacherName,
        course: lesson.course,
        status: lesson.status,
        meetingLink: lesson.meetingLink,
        notes: lesson.notes,
        backgroundColor: getStatusColor(lesson.status).bg,
        borderColor: getStatusColor(lesson.status).border
      })) || [];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lessons',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { bg: '#3b82f6', border: '#2563eb' };
      case 'completed':
        return { bg: '#22c55e', border: '#16a34a' };
      case 'cancelled':
        return { bg: '#ef4444', border: '#dc2626' };
      default:
        return { bg: '#6366f1', border: '#4f46e5' };
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowEventDialog(true);
    }
  };

  const handleDateClick = (arg: any) => {
    if (isEditable && userRole === 'Admin') {
      setSelectedDate(arg.date);
      setLessonForm({
        ...lessonForm,
        startTime: arg.dateStr,
        endTime: new Date(arg.date.getTime() + 60 * 60 * 1000).toISOString()
      });
      setShowCreateDialog(true);
    }
  };

  const handleCreateLesson = async () => {
    try {
      const response = await apiClient.post('/lessons', lessonForm);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Lesson scheduled successfully'
        });
        setShowCreateDialog(false);
        fetchLessons();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule lesson',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const response = await apiClient.delete(`/lessons/${lessonId}`);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Lesson deleted successfully'
        });
        setShowEventDialog(false);
        fetchLessons();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lesson',
        variant: 'destructive'
      });
    }
  };

  const handleJoinSession = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      toast({
        title: 'Info',
        description: 'Meeting link not available yet',
        variant: 'default'
      });
    }
  };

  const resetForm = () => {
    setLessonForm({
      studentId: '',
      teacherId: '',
      course: '',
      startTime: '',
      endTime: '',
      notes: '',
      meetingLink: ''
    });
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold">Lesson Schedule</h2>
          </div>
          
          {isEditable && userRole === 'Admin' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              Schedule Lesson
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="mb-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Cancelled</span>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          editable={isEditable && userRole === 'Admin'}
          selectable={isEditable && userRole === 'Admin'}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true
          }}
        />
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lesson Details</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={selectedEvent.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {selectedEvent.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(selectedEvent.start).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Course</div>
                    <div className="font-medium">{selectedEvent.course}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Student</div>
                    <div className="font-medium">{selectedEvent.studentName}</div>
                  </div>
                </div>

                {selectedEvent.teacherName && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Teacher</div>
                      <div className="font-medium">{selectedEvent.teacherName}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {new Date(selectedEvent.start).toLocaleTimeString()} -{' '}
                      {new Date(selectedEvent.end).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div className="flex items-start gap-3">
                    <div className="text-sm text-gray-500">Notes</div>
                    <div className="text-sm">{selectedEvent.notes}</div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2 sm:justify-between">
                {selectedEvent.meetingLink && (
                  <Button
                    onClick={() => handleJoinSession(selectedEvent.meetingLink!)}
                    className="w-full"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                )}
                
                {isEditable && userRole === 'Admin' && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteLesson(selectedEvent.id)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Lesson Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Lesson</DialogTitle>
            <DialogDescription>Fill in the details to schedule a new lesson</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Student ID</Label>
              <Input
                value={lessonForm.studentId}
                onChange={(e) => setLessonForm({ ...lessonForm, studentId: e.target.value })}
                placeholder="Enter student ID"
              />
            </div>

            <div>
              <Label>Teacher ID</Label>
              <Input
                value={lessonForm.teacherId}
                onChange={(e) => setLessonForm({ ...lessonForm, teacherId: e.target.value })}
                placeholder="Enter teacher ID"
              />
            </div>

            <div>
              <Label>Course</Label>
              <Select
                value={lessonForm.course}
                onValueChange={(value) => setLessonForm({ ...lessonForm, course: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={lessonForm.startTime}
                  onChange={(e) => setLessonForm({ ...lessonForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={lessonForm.endTime}
                  onChange={(e) => setLessonForm({ ...lessonForm, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Meeting Link</Label>
              <Input
                value={lessonForm.meetingLink}
                onChange={(e) => setLessonForm({ ...lessonForm, meetingLink: e.target.value })}
                placeholder="Enter video call link"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={lessonForm.notes}
                onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLesson}>
              Schedule Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
