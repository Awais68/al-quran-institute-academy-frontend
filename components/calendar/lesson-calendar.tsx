'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Calendar, Clock, User, BookOpen, Video, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import { getErrorMessage } from '@/lib/error-handler';

type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'ongoing';

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
  topic?: string;
  status?: SessionStatus;
  meetingLink?: string;
  notes?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface PersonOption {
  _id: string;
  name?: string;
  email?: string;
}

interface LessonCalendarProps {
  userRole?: 'Admin' | 'Teacher' | 'Student';
  userId?: string;
  isEditable?: boolean;
}

const COURSES = ['Qaida', 'Tajweed', 'Nazra', 'Hifz', 'Namaz', 'Arabic', 'Islamic Studies'];

const EMPTY_FORM = {
  studentId: '',
  teacherId: '',
  course: '',
  scheduledDate: '',
  duration: '60',
  topic: '',
  notes: '',
};

// Converts a Date into the "YYYY-MM-DDTHH:mm" shape <input type="datetime-local"> expects,
// keeping the browser's local timezone instead of shifting to UTC like toISOString() does.
const toLocalInputValue = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function LessonCalendar({ userRole = 'Student', userId, isEditable = false }: LessonCalendarProps) {
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [students, setStudents] = useState<PersonOption[]>([]);
  const [teachers, setTeachers] = useState<PersonOption[]>([]);
  const [lessonForm, setLessonForm] = useState(EMPTY_FORM);
  const { toast } = useToast();
  const router = useRouter();

  const canSchedule = isEditable && (userRole === 'Admin' || userRole === 'Teacher');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return { bg: '#3b82f6', border: '#2563eb' };
      case 'ongoing':
        return { bg: '#f59e0b', border: '#d97706' };
      case 'completed':
        return { bg: '#22c55e', border: '#16a34a' };
      case 'cancelled':
        return { bg: '#ef4444', border: '#dc2626' };
      default:
        return { bg: '#6366f1', border: '#4f46e5' };
    }
  };

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      // The backend scopes /sessions by the caller's role, so no userId filter is needed here.
      const response = await apiClient.get('/sessions');
      const sessions = response.data?.data?.sessions ?? [];

      const formattedEvents: LessonEvent[] = sessions.map((session: any) => {
        const start = new Date(session.scheduledDate);
        const end = new Date(start.getTime() + (session.duration || 60) * 60 * 1000);
        const studentName = session.studentId?.name || 'Student';
        const colors = getStatusColor(session.status);

        return {
          id: session._id,
          title: `${session.course || 'Session'} - ${studentName}`,
          start: start.toISOString(),
          end: end.toISOString(),
          studentId: session.studentId?._id,
          studentName,
          teacherId: session.teacherId?._id,
          teacherName: session.teacherId?.name,
          course: session.course,
          topic: session.topic,
          status: session.status,
          meetingLink: session.meetingLink || `/video-call/${session._id}`,
          notes: session.notes,
          backgroundColor: colors.bg,
          borderColor: colors.border,
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.warn('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, {
          endpoint: '/sessions',
          fallback: 'Failed to load scheduled sessions',
        }),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons, userId]);

  // Only the scheduling roles need the student/teacher pickers.
  useEffect(() => {
    if (!canSchedule) return;

    const fetchPeople = async () => {
      const [studentsRes, teachersRes] = await Promise.all([
        apiClient.get('/students/getAllStudents?limit=200').catch(() => null),
        userRole === 'Admin' ? apiClient.get('/teacher?limit=200').catch(() => null) : Promise.resolve(null),
      ]);

      setStudents(studentsRes?.data?.data?.students ?? []);
      setTeachers(teachersRes?.data?.data?.teachers ?? []);
    };

    fetchPeople();
  }, [canSchedule, userRole]);

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowEventDialog(true);
    }
  };

  const handleDateClick = (arg: any) => {
    if (!canSchedule) return;
    setLessonForm({ ...EMPTY_FORM, scheduledDate: toLocalInputValue(arg.date) });
    setShowCreateDialog(true);
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.studentId || !lessonForm.course || !lessonForm.scheduledDate) {
      toast({
        title: 'Missing details',
        description: 'Student, course and date/time are required',
        variant: 'destructive',
      });
      return;
    }

    if (userRole === 'Admin' && !lessonForm.teacherId) {
      toast({
        title: 'Missing details',
        description: 'Please pick the teacher for this session',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      await apiClient.post('/sessions', {
        studentId: lessonForm.studentId,
        teacherId: lessonForm.teacherId || undefined,
        course: lessonForm.course,
        scheduledDate: new Date(lessonForm.scheduledDate).toISOString(),
        duration: Number(lessonForm.duration) || 60,
        topic: lessonForm.topic || undefined,
        notes: lessonForm.notes || undefined,
      });

      toast({ title: 'Success', description: 'Session scheduled successfully' });
      setShowCreateDialog(false);
      setLessonForm(EMPTY_FORM);
      fetchLessons();
    } catch (error) {
      console.warn('Error creating session:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, {
          endpoint: '/sessions',
          fallback: 'Failed to schedule session',
        }),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (sessionId: string) => {
    try {
      await apiClient.delete(`/sessions/${sessionId}`);
      toast({ title: 'Success', description: 'Session deleted successfully' });
      setShowEventDialog(false);
      fetchLessons();
    } catch (error) {
      console.warn('Error deleting session:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, {
          endpoint: '/sessions',
          fallback: 'Failed to delete session',
        }),
        variant: 'destructive',
      });
    }
  };

  const handleJoinSession = (meetingLink?: string) => {
    if (!meetingLink) {
      toast({ title: 'Info', description: 'Meeting link not available yet' });
      return;
    }

    setShowEventDialog(false);
    // Sessions created by this app carry an in-app route; external links still open in a new tab.
    if (meetingLink.startsWith('/')) {
      router.push(meetingLink);
    } else {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold">Lesson Schedule</h2>
          </div>

          {canSchedule && (
            <Button
              onClick={() => {
                setLessonForm({ ...EMPTY_FORM, scheduledDate: toLocalInputValue(new Date()) });
                setShowCreateDialog(true);
              }}
            >
              Schedule Lesson
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Ongoing</span>
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

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading schedule...
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
            editable={false}
            selectable={canSchedule}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: true,
            }}
          />
        )}
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lesson Details</DialogTitle>
            <DialogDescription>Details of the selected session</DialogDescription>
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
                    {selectedEvent.topic && (
                      <div className="text-sm text-gray-500">Topic: {selectedEvent.topic}</div>
                    )}
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
                {selectedEvent.status !== 'cancelled' && (
                  <Button onClick={() => handleJoinSession(selectedEvent.meetingLink)} className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                )}

                {canSchedule && (
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Lesson</DialogTitle>
            <DialogDescription>Fill in the details to schedule a new session</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Student</Label>
              <Select
                value={lessonForm.studentId}
                onValueChange={(value) => setLessonForm({ ...lessonForm, studentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={students.length ? 'Select student' : 'No students found'} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name || student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userRole === 'Admin' && (
              <div>
                <Label>Teacher</Label>
                <Select
                  value={lessonForm.teacherId}
                  onValueChange={(value) => setLessonForm({ ...lessonForm, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={teachers.length ? 'Select teacher' : 'No teachers found'} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.name || teacher.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={lessonForm.scheduledDate}
                  onChange={(e) => setLessonForm({ ...lessonForm, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Topic</Label>
              <Input
                value={lessonForm.topic}
                onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                placeholder="e.g. Surah Al-Fatiha revision"
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
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleCreateLesson} disabled={saving}>
              {saving ? 'Scheduling...' : 'Schedule Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
