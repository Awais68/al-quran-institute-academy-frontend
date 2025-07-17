"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Clock,
  Users,
  Repeat,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react"

interface RecurringSession {
  id: string
  name: string
  course: string
  sessionType: "one-on-one" | "group"
  frequency: "daily" | "weekly" | "biweekly" | "monthly"
  duration: number
  students: string[]
  instructor: string
  startDate: Date
  endDate?: Date
  status: "active" | "paused" | "completed" | "cancelled"
  completedSessions: number
  totalSessions: number
  missedSessions: number
  nextSessionDate: Date
  lastSessionDate?: Date
  topic: string
  notes: string
  createdAt: Date
}

export function RecurringSessionManager() {
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data for recurring sessions
  const recurringSessions: RecurringSession[] = [
    {
      id: "1",
      name: "Ahmad's Weekly Tajweed",
      course: "Tajweed Mastery",
      sessionType: "one-on-one",
      frequency: "weekly",
      duration: 60,
      students: ["ahmad"],
      instructor: "Sheikh Ahmed Al-Qari",
      startDate: new Date("2023-11-01"),
      status: "active",
      completedSessions: 12,
      totalSessions: 24,
      missedSessions: 1,
      nextSessionDate: new Date("2024-01-15T10:00:00"),
      lastSessionDate: new Date("2024-01-08T10:00:00"),
      topic: "Progressive Tajweed Rules",
      notes: "Focus on practical application",
      createdAt: new Date("2023-10-25"),
    },
    {
      id: "2",
      name: "Group Memorization Sessions",
      course: "Quran Memorization",
      sessionType: "group",
      frequency: "weekly",
      duration: 90,
      students: ["ahmad", "muhammad", "omar"],
      instructor: "Sheikh Ahmed Al-Qari",
      startDate: new Date("2023-12-01"),
      status: "active",
      completedSessions: 6,
      totalSessions: 20,
      missedSessions: 0,
      nextSessionDate: new Date("2024-01-13T14:00:00"),
      lastSessionDate: new Date("2024-01-06T14:00:00"),
      topic: "Surah Memorization Practice",
      notes: "Group recitation and peer learning",
      createdAt: new Date("2023-11-25"),
    },
    {
      id: "3",
      name: "Fatima's Bi-weekly Sessions",
      course: "Quran Memorization",
      sessionType: "one-on-one",
      frequency: "biweekly",
      duration: 45,
      students: ["fatima"],
      instructor: "Sheikh Ahmed Al-Qari",
      startDate: new Date("2023-12-01"),
      status: "paused",
      completedSessions: 4,
      totalSessions: 12,
      missedSessions: 2,
      nextSessionDate: new Date("2024-01-16T15:00:00"),
      lastSessionDate: new Date("2023-12-19T15:00:00"),
      topic: "Memorization Techniques",
      notes: "Student requested temporary pause",
      createdAt: new Date("2023-11-28"),
    },
  ]

  const filteredSessions = recurringSessions.filter(
    (session) => filterStatus === "all" || session.status === filterStatus,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <Square className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const handlePauseSession = (sessionId: string) => {
    // Implementation for pausing session
    console.log("Pausing session:", sessionId)
  }

  const handleResumeSession = (sessionId: string) => {
    // Implementation for resuming session
    console.log("Resuming session:", sessionId)
  }

  const handleStopSession = (sessionId: string) => {
    // Implementation for stopping session
    console.log("Stopping session:", sessionId)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Repeat className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {recurringSessions.filter((s) => s.status === "active").length}
                </p>
                <p className="text-blue-700 text-sm">Active Series</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {recurringSessions.reduce((sum, s) => sum + s.completedSessions, 0)}
                </p>
                <p className="text-blue-700 text-sm">Total Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {recurringSessions.reduce((sum, s) => sum + s.missedSessions, 0)}
                </p>
                <p className="text-blue-700 text-sm">Missed Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(
                    recurringSessions.reduce(
                      (sum, s) => sum + calculateProgress(s.completedSessions, s.totalSessions),
                      0,
                    ) / recurringSessions.length,
                  )}
                  %
                </p>
                <p className="text-blue-700 text-sm">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Label className="text-blue-900 font-semibold">Filter by Status:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {session.sessionType === "group" ? (
                      <Users className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{session.name}</h3>
                    <p className="text-blue-700">
                      {session.course} • {session.topic}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-blue-600 mt-1">
                      <span className="flex items-center">
                        <Repeat className="h-3 w-3 mr-1" />
                        {session.frequency}
                      </span>
                      <span>{session.duration} min</span>
                      <span>
                        {session.students.length} student{session.students.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(session.status)}>
                    {getStatusIcon(session.status)}
                    <span className="ml-1 capitalize">{session.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Progress Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 text-sm">Progress</span>
                    <span className="text-blue-900 font-semibold">
                      {session.completedSessions}/{session.totalSessions}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(session.completedSessions, session.totalSessions)}
                    className="h-2"
                  />
                  <p className="text-blue-600 text-xs mt-1">
                    {calculateProgress(session.completedSessions, session.totalSessions)}% complete
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Next Session:</span>
                    <span className="text-blue-900 font-medium">{session.nextSessionDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Last Session:</span>
                    <span className="text-blue-900 font-medium">
                      {session.lastSessionDate?.toLocaleDateString() || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Completed:</span>
                    <span className="text-green-700 font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {session.completedSessions}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Missed:</span>
                    <span className="text-red-700 font-medium flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {session.missedSessions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-600">
                  Started: {session.startDate.toLocaleDateString()}
                  {session.endDate && ` • Ends: ${session.endDate.toLocaleDateString()}`}
                </div>

                <div className="flex space-x-2">
                  {session.status === "active" && (
                    <>
                      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedSession(session.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modify
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-blue-900">Modify Recurring Session</DialogTitle>
                            <DialogDescription>Update the settings for this recurring session</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="sessionName" className="text-blue-900">
                                Session Name
                              </Label>
                              <Input
                                id="sessionName"
                                defaultValue={session.name}
                                className="border-blue-200 focus:border-blue-400"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="frequency" className="text-blue-900">
                                  Frequency
                                </Label>
                                <Select defaultValue={session.frequency}>
                                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
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
                              <div>
                                <Label htmlFor="duration" className="text-blue-900">
                                  Duration
                                </Label>
                                <Select defaultValue={session.duration.toString()}>
                                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                    <SelectItem value="90">90 minutes</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button variant="outline" onClick={() => setIsModifyDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => handlePauseSession(session.id)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    </>
                  )}

                  {session.status === "paused" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => handleResumeSession(session.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-blue-900">Stop Recurring Session</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to stop this recurring session? This will cancel all future sessions in
                          this series. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleStopSession(session.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Stop Session Series
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
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
            <Repeat className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No recurring sessions found</h3>
            <p className="text-blue-700 mb-4">
              {filterStatus !== "all"
                ? `No ${filterStatus} recurring sessions at the moment`
                : "You haven't set up any recurring sessions yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
