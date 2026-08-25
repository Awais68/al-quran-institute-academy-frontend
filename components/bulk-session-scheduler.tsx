"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Clock,
  Users,
  Plus,
  Copy,
  Save,
  Trash2,
  Edit,
  Eye,
  CalendarDays,
  Repeat,
  CheckCircle,
  AlertCircle,
  Pause,
} from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";

interface RecurringTemplate {
  id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  duration: number;
  sessionType: "one-on-one" | "group";
  course: string;
  topic: string;
  notes: string;
  daysOfWeek: number[];
  timeSlots: string[];
  students: string[];
  endDate?: Date;
  maxSessions?: number;
  createdAt: Date;
  isActive: boolean;
}

interface BulkSessionData {
  templateId?: string;
  students: string[];
  course: string;
  sessionType: "one-on-one" | "group";
  topic: string;
  duration: number;
  notes: string;
  startDate: Date;
  endDate?: Date;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  daysOfWeek: number[];
  timeSlots: string[];
  maxSessions?: number;
  skipHolidays: boolean;
  autoReschedule: boolean;
}

export function BulkSessionScheduler() {
  const [activeTab, setActiveTab] = useState("bulk");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [bulkSessionData, setBulkSessionData] = useState<BulkSessionData>({
    students: [],
    course: "",
    sessionType: "one-on-one",
    topic: "",
    duration: 60,
    notes: "",
    startDate: new Date(),
    frequency: "weekly",
    daysOfWeek: [],
    timeSlots: [],
    skipHolidays: true,
    autoReschedule: false,
  });

  // Mock data for templates and students
  const templates: RecurringTemplate[] = [
    {
      id: "1",
      name: "Weekly Tajweed Sessions",
      description: "Regular weekly Tajweed practice sessions",
      frequency: "weekly",
      duration: 60,
      sessionType: "one-on-one",
      course: "Tajweed Mastery",
      topic: "Progressive Tajweed Rules",
      notes: "Focus on practical application of rules",
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      timeSlots: ["10:00", "15:00"],
      students: ["ahmad", "fatima"],
      createdAt: new Date("2024-01-01"),
      isActive: true,
    },
    {
      id: "2",
      name: "Group Memorization Sessions",
      description: "Weekly group sessions for Quran memorization",
      frequency: "weekly",
      duration: 90,
      sessionType: "group",
      course: "Quran Memorization",
      topic: "Surah Memorization Practice",
      notes: "Group recitation and peer learning",
      daysOfWeek: [6], // Saturday
      timeSlots: ["14:00"],
      students: ["ahmad", "muhammad", "omar"],
      createdAt: new Date("2024-01-01"),
      isActive: true,
    },
    {
      id: "3",
      name: "Kids Daily Practice",
      description: "Daily short sessions for children",
      frequency: "daily",
      duration: 30,
      sessionType: "one-on-one",
      course: "Kids Quran Program",
      topic: "Arabic Alphabet & Basic Reading",
      notes: "Keep sessions fun and engaging",
      daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
      timeSlots: ["16:00"],
      students: ["aisha"],
      maxSessions: 20,
      createdAt: new Date("2024-01-01"),
      isActive: true,
    },
  ];

  const students = [
    { id: "ahmad", name: "Ahmad Hassan", course: "Tajweed Mastery" },
    { id: "fatima", name: "Fatima Al-Zahra", course: "Quran Memorization" },
    { id: "muhammad", name: "Muhammad Ali", course: "Tajweed Mastery" },
    { id: "aisha", name: "Aisha Rahman", course: "Kids Quran Program" },
    { id: "omar", name: "Omar Abdullah", course: "Tajweed Mastery" },
  ];

  const courses = [
    "Tajweed Mastery",
    "Quran Memorization",
    "Tafsir & Understanding",
    "Kids Quran Program",
  ];

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const generateSessionsPreview = (data: BulkSessionData) => {
    const sessions: any[] = [];
    let currentDate = new Date(data.startDate);
    const endDate = data.endDate || addMonths(currentDate, 3);
    let sessionCount = 0;
    const maxSessions = data.maxSessions || 50;

    while (currentDate <= endDate && sessionCount < maxSessions) {
      const dayOfWeek = currentDate.getDay();

      if (data.daysOfWeek.includes(dayOfWeek)) {
        data.timeSlots.forEach((timeSlot) => {
          if (data.sessionType === "one-on-one") {
            data.students.forEach((studentId) => {
              const student = students.find((s) => s.id === studentId);
              if (student) {
                sessions.push({
                  id: `${sessionCount}-${studentId}-${timeSlot}`,
                  student: student.name,
                  date: new Date(currentDate),
                  time: timeSlot,
                  duration: data.duration,
                  type: data.sessionType,
                  course: data.course,
                  topic: data.topic,
                });
                sessionCount++;
              }
            });
          } else {
            // Group session
            sessions.push({
              id: `${sessionCount}-group-${timeSlot}`,
              student: `Group (${data.students.length} students)`,
              participants: data.students
                .map((id) => students.find((s) => s.id === id)?.name)
                .filter(Boolean),
              date: new Date(currentDate),
              time: timeSlot,
              duration: data.duration,
              type: data.sessionType,
              course: data.course,
              topic: data.topic,
            });
            sessionCount++;
          }
        });
      }

      // Move to next date based on frequency
      switch (data.frequency) {
        case "daily":
          currentDate = addDays(currentDate, 1);
          break;
        case "weekly":
          currentDate = addDays(currentDate, 1);
          break;
        case "biweekly":
          currentDate = addDays(currentDate, 1);
          if (currentDate.getDay() === data.startDate.getDay()) {
            currentDate = addWeeks(currentDate, 1); // Skip one week
          }
          break;
        case "monthly":
          currentDate = addDays(currentDate, 1);
          break;
      }
    }

    return sessions.slice(0, 20); // Show first 20 sessions in preview
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setBulkSessionData({
        ...bulkSessionData,
        students: template.students,
        course: template.course,
        sessionType: template.sessionType,
        topic: template.topic,
        duration: template.duration,
        notes: template.notes,
        frequency: template.frequency,
        daysOfWeek: template.daysOfWeek,
        timeSlots: template.timeSlots,
        maxSessions: template.maxSessions,
      });
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setBulkSessionData((prev) => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter((id) => id !== studentId)
        : [...prev.students, studentId],
    }));
  };

  const handleDayToggle = (day: number) => {
    setBulkSessionData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleTimeSlotToggle = (time: string) => {
    setBulkSessionData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(time)
        ? prev.timeSlots.filter((t) => t !== time)
        : [...prev.timeSlots, time],
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="bulk"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Bulk Scheduling
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="recurring"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Recurring Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulk" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Bulk Session Scheduling
              </CardTitle>
              <CardDescription>
                Create multiple sessions at once with flexible scheduling
                options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label className="text-blue-900 font-semibold">
                  Quick Start with Template (Optional)
                </Label>
                <div className="flex space-x-2 mt-2">
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger className="flex-1 border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Choose a template to start with" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() =>
                      selectedTemplate && loadTemplate(selectedTemplate)
                    }
                    disabled={!selectedTemplate}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                </div>
              </div>

              {/* Basic Session Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="course"
                    className="text-blue-900 font-semibold"
                  >
                    Course *
                  </Label>
                  <Select
                    value={bulkSessionData.course}
                    onValueChange={(value) =>
                      setBulkSessionData((prev) => ({ ...prev, course: value }))
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
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

                <div>
                  <Label className="text-blue-900 font-semibold">
                    Session Type *
                  </Label>
                  <RadioGroup
                    value={bulkSessionData.sessionType}
                    onValueChange={(value: "one-on-one" | "group") =>
                      setBulkSessionData((prev) => ({
                        ...prev,
                        sessionType: value,
                      }))
                    }
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-on-one" id="one-on-one" />
                      <Label htmlFor="one-on-one" className="text-blue-700">
                        One-on-One
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="group" id="group" />
                      <Label htmlFor="group" className="text-blue-700">
                        Group Session
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="topic"
                    className="text-blue-900 font-semibold"
                  >
                    Session Topic *
                  </Label>
                  <Input
                    id="topic"
                    value={bulkSessionData.topic}
                    onChange={(e) =>
                      setBulkSessionData((prev) => ({
                        ...prev,
                        topic: e.target.value,
                      }))
                    }
                    placeholder="Enter session topic"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="duration"
                    className="text-blue-900 font-semibold"
                  >
                    Duration (minutes) *
                  </Label>
                  <Select
                    value={bulkSessionData.duration.toString()}
                    onValueChange={(value) =>
                      setBulkSessionData((prev) => ({
                        ...prev,
                        duration: Number.parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Student Selection */}
              <div>
                <Label className="text-blue-900 font-semibold">
                  Select Students *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2 p-3 border border-blue-200 rounded-lg"
                    >
                      <Checkbox
                        id={student.id}
                        checked={bulkSessionData.students.includes(student.id)}
                        onCheckedChange={() => handleStudentToggle(student.id)}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={student.id}
                          className="text-blue-900 font-medium cursor-pointer"
                        >
                          {student.name}
                        </Label>
                        <p className="text-blue-600 text-xs">
                          {student.course}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-blue-900 font-semibold">
                    Date Range *
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label className="text-blue-700 text-sm">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-blue-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(bulkSessionData.startDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bulkSessionData.startDate}
                            onSelect={(date) =>
                              date &&
                              setBulkSessionData((prev) => ({
                                ...prev,
                                startDate: date,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-blue-700 text-sm">
                        End Date (Optional)
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-blue-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bulkSessionData.endDate
                              ? format(bulkSessionData.endDate, "PPP")
                              : "No end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bulkSessionData.endDate}
                            onSelect={(date) =>
                              setBulkSessionData((prev) => ({
                                ...prev,
                                endDate: date,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-blue-900 font-semibold">
                    Frequency *
                  </Label>
                  <Select
                    value={bulkSessionData.frequency}
                    onValueChange={(
                      value: "daily" | "weekly" | "biweekly" | "monthly"
                    ) =>
                      setBulkSessionData((prev) => ({
                        ...prev,
                        frequency: value,
                      }))
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Days of Week */}
              <div>
                <Label className="text-blue-900 font-semibold">
                  Days of Week *
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-3">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={bulkSessionData.daysOfWeek.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label
                        htmlFor={`day-${day.value}`}
                        className="text-blue-700 text-sm cursor-pointer"
                      >
                        {day.label.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <Label className="text-blue-900 font-semibold">
                  Time Slots *
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-3">
                  {timeSlots.map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${time}`}
                        checked={bulkSessionData.timeSlots.includes(time)}
                        onCheckedChange={() => handleTimeSlotToggle(time)}
                      />
                      <Label
                        htmlFor={`time-${time}`}
                        className="text-blue-700 text-sm cursor-pointer"
                      >
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="maxSessions"
                    className="text-blue-900 font-semibold"
                  >
                    Maximum Sessions (Optional)
                  </Label>
                  <Input
                    id="maxSessions"
                    type="number"
                    value={bulkSessionData.maxSessions || ""}
                    onChange={(e) =>
                      setBulkSessionData((prev) => ({
                        ...prev,
                        maxSessions: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="Leave empty for no limit"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipHolidays"
                      checked={bulkSessionData.skipHolidays}
                      onCheckedChange={(checked) =>
                        setBulkSessionData((prev) => ({
                          ...prev,
                          skipHolidays: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="skipHolidays" className="text-blue-700">
                      Skip holidays and weekends
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoReschedule"
                      checked={bulkSessionData.autoReschedule}
                      onCheckedChange={(checked) =>
                        setBulkSessionData((prev) => ({
                          ...prev,
                          autoReschedule: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="autoReschedule" className="text-blue-700">
                      Auto-reschedule conflicts
                    </Label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-blue-900 font-semibold">
                  Session Notes
                </Label>
                <Textarea
                  id="notes"
                  value={bulkSessionData.notes}
                  onChange={(e) =>
                    setBulkSessionData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Add any notes or instructions for these sessions"
                  className="border-blue-200 focus:border-blue-400"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <div className="space-x-3">
                  <Button
                    onClick={() => setIsPreviewOpen(true)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={
                      !bulkSessionData.course ||
                      !bulkSessionData.topic ||
                      bulkSessionData.students.length === 0
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Sessions
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    !bulkSessionData.course ||
                    !bulkSessionData.topic ||
                    bulkSessionData.students.length === 0
                  }
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Create Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">
                    Session Templates
                  </CardTitle>
                  <CardDescription>
                    Manage your recurring session templates
                  </CardDescription>
                </div>
                <Dialog
                  open={isTemplateDialogOpen}
                  onOpenChange={setIsTemplateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-blue-900">
                        Create Session Template
                      </DialogTitle>
                      <DialogDescription>
                        Create a reusable template for recurring sessions
                      </DialogDescription>
                    </DialogHeader>
                    {/* Template creation form would go here */}
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="templateName" className="text-blue-900">
                          Template Name *
                        </Label>
                        <Input
                          id="templateName"
                          placeholder="Enter template name"
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="templateDescription"
                          className="text-blue-900"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="templateDescription"
                          placeholder="Describe this template"
                          className="border-blue-200 focus:border-blue-400"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsTemplateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Create Template
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="border border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900">
                          {template.name}
                        </h3>
                        <Badge
                          className={
                            template.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <p className="text-blue-700 text-sm mb-4">
                        {template.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Frequency:</span>
                          <span className="text-blue-900 capitalize">
                            {template.frequency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Duration:</span>
                          <span className="text-blue-900">
                            {template.duration} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Type:</span>
                          <span className="text-blue-900 capitalize">
                            {template.sessionType.replace("-", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Students:</span>
                          <span className="text-blue-900">
                            {template.students.length}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-6">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            loadTemplate(template.id);
                            setActiveTab("bulk");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Active Recurring Sessions
              </CardTitle>
              <CardDescription>
                Manage your ongoing recurring session schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates
                  .filter((t) => t.isActive)
                  .map((template) => (
                    <div
                      key={template.id}
                      className="border border-blue-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">
                            {template.name}
                          </h3>
                          <p className="text-blue-700">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-700">
                            <Repeat className="h-3 w-3 mr-1" />
                            {template.frequency}
                          </Badge>
                          <Badge variant="outline">
                            {template.sessionType === "group" ? (
                              <Users className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {template.sessionType}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-blue-600 text-sm">Course:</span>
                          <p className="text-blue-900 font-medium">
                            {template.course}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-600 text-sm">
                            Duration:
                          </span>
                          <p className="text-blue-900 font-medium">
                            {template.duration} minutes
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-600 text-sm">
                            Students:
                          </span>
                          <p className="text-blue-900 font-medium">
                            {template.students.length} enrolled
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-600 text-sm">
                            Next Session:
                          </span>
                          <p className="text-blue-900 font-medium">
                            Jan 15, 2024
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 text-sm">
                              24 sessions completed
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-700 text-sm">
                              2 sessions missed
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Session Preview</DialogTitle>
            <DialogDescription>
              Preview of sessions that will be created (showing first 20
              sessions)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {generateSessionsPreview(bulkSessionData).map((session, index) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border border-blue-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-blue-900">{session.topic}</h4>
                  <p className="text-blue-700 text-sm">
                    {session.student} • {session.course}
                  </p>
                  <p className="text-blue-600 text-xs">
                    {format(session.date, "PPP")} at {session.time} •{" "}
                    {session.duration} min
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {session.type}
                </Badge>
              </div>
            ))}
            {generateSessionsPreview(bulkSessionData).length === 20 && (
              <p className="text-blue-600 text-center text-sm">
                ... and more sessions based on your configuration
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <CalendarDays className="h-4 w-4 mr-2" />
              Create All Sessions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
