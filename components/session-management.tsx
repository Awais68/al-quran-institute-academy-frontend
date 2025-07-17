"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarIcon,
  Clock,
  Video,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Play,
  Pause,
  Square,
  MessageCircle,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Add the BulkSessionScheduler import at the top
import { BulkSessionScheduler } from "./bulk-session-scheduler"

export function SessionManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false)

  // Mock session data
  const sessions = [
    {
      id: "1",
      student: "Ahmad Hassan",
      course: "Tajweed Mastery",
      date: "2024-01-15T10:00:00",
      duration: 60,
      type: "One-on-One",
      topic: "Noon Sakinah Rules - Advanced",
      status: "scheduled",
      meetingLink: "https://meet.example.com/abc123",
      notes: "Focus on Ikhfa rule with specific letters",
      studentAvatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      student: "Fatima Al-Zahra",
      course: "Quran Memorization",
      date: "2024-01-15T15:00:00",
      duration: 45,
      type: "One-on-One",
      topic: "Surah Al-Mulk - Verses 1-10",
      status: "scheduled",
      meetingLink: "https://meet.example.com/def456",
      notes: "Review previous memorization and add new verses",
      studentAvatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      student: "Group Session",
      course: "Tajweed Mastery",
      date: "2024-01-15T18:00:00",
      duration: 90,
      type: "Group",
      topic: "Practical Recitation Practice",
      status: "scheduled",
      meetingLink: "https://meet.example.com/group789",
      notes: "Group practice session for advanced students",
      participants: ["Ahmad Hassan", "Muhammad Ali", "Omar Abdullah"],
    },
    {
      id: "4",
      student: "Muhammad Ali",
      course: "Tajweed Mastery",
      date: "2024-01-12T14:00:00",
      duration: 60,
      type: "One-on-One",
      topic: "Advanced Qira'at Introduction",
      status: "completed",
      meetingLink: "https://meet.example.com/ghi012",
      notes: "Excellent session, student ready for advanced studies",
      studentAvatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      student: "Aisha Rahman",
      course: "Kids Quran Program",
      date: "2024-01-14T16:00:00",
      duration: 30,
      type: "One-on-One",
      topic: "Arabic Alphabet Review",
      status: "missed",
      meetingLink: "https://meet.example.com/jkl345",
      notes: "Student did not attend, need to follow up with parents",
      studentAvatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || session.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-yellow-100 text-yellow-700"
      case "missed":
        return "bg-red-100 text-red-700"
      case "cancelled":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "Group" ? <Users className="h-4 w-4" /> : <Video className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/instructor">
            <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">Session Management</h1>
        </div>
        <Dialog open={isNewSessionOpen} onOpenChange={setIsNewSessionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-blue-900">Schedule New Session</DialogTitle>
              <DialogDescription>Create a new session for your student</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student" className="text-blue-900">
                    Student *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmad">Ahmad Hassan</SelectItem>
                      <SelectItem value="fatima">Fatima Al-Zahra</SelectItem>
                      <SelectItem value="muhammad">Muhammad Ali</SelectItem>
                      <SelectItem value="aisha">Aisha Rahman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sessionType" className="text-blue-900">
                    Session Type *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-on-one">One-on-One</SelectItem>
                      <SelectItem value="group">Group Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-900">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-blue-200 focus:border-blue-400"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time" className="text-blue-900">
                    Time *
                  </Label>
                  <Input id="time" type="time" className="border-blue-200 focus:border-blue-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-blue-900">
                    Duration (minutes) *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course" className="text-blue-900">
                    Course *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tajweed">Tajweed Mastery</SelectItem>
                      <SelectItem value="memorization">Quran Memorization</SelectItem>
                      <SelectItem value="kids">Kids Quran Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="topic" className="text-blue-900">
                  Session Topic *
                </Label>
                <Input
                  id="topic"
                  placeholder="Enter the topic for this session"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-blue-900">
                  Session Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or preparation instructions for this session"
                  className="border-blue-200 focus:border-blue-400"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsNewSessionOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Schedule Session</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList>
          <TabsTrigger value="single" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Single Schedule
          </TabsTrigger>
          {/* Add a new tab for bulk scheduling in the existing session management
          // In the TabsList, add a new TabsTrigger: */}
          <TabsTrigger value="bulk" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Bulk Schedule
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          {/* Filters and Search */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Search sessions by student or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-400">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="bg-white/80 backdrop-blur-sm border-blue-200/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">{getTypeIcon(session.type)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">{session.topic}</h3>
                        <p className="text-blue-700">
                          {session.student} • {session.course}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-blue-600 mt-1">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(session.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span>{session.duration} min</span>
                          <Badge className={getStatusColor(session.status)}>{session.status.replace("_", " ")}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {session.type}
                          </Badge>
                        </div>
                        {session.participants && (
                          <p className="text-sm text-blue-600 mt-1">Participants: {session.participants.join(", ")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {session.status === "scheduled" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {session.status === "in_progress" && (
                        <>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            <Square className="h-4 w-4 mr-1" />
                            End
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {session.status === "completed" && (
                        <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-700 text-sm">{session.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No sessions found</h3>
                <p className="text-blue-700 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't scheduled any sessions yet"}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsNewSessionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Your First Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        {/* Add the corresponding TabsContent: */}
        <TabsContent value="bulk" className="mt-8">
          <BulkSessionScheduler />
        </TabsContent>
      </Tabs>
    </div>
  )
}
