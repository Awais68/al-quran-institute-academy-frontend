"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, FileText, Edit, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  fatherName: string;
  course: string;
}

interface ProgressReportProps {
  students: Student[];
  onRefresh: () => void;
}

export default function ProgressReport({ students, onRefresh }: ProgressReportProps) {
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [report, setReport] = useState({
    studentId: "",
    studentName: "",
    course: "",
    attendance: 100,
    recitationQuality: 5,
    tajweedAccuracy: 5,
    memorizationProgress: 5,
    overallPerformance: "Excellent",
    strengths: "",
    areasForImprovement: "",
    teacherRemarks: "",
    nextGoals: "",
  });

  const [feedback, setFeedback] = useState({
    studentId: "",
    studentName: "",
    parentEmail: "",
    subject: "",
    message: "",
  });

  const handleStudentSelect = (studentId: string, type: "report" | "feedback") => {
    const student = students.find((s) => s._id === studentId);
    if (!student) return;

    setSelectedStudent(student);

    if (type === "report") {
      setReport({
        ...report,
        studentId: student._id,
        studentName: student.name,
        course: student.course,
      });
    } else {
      setFeedback({
        ...feedback,
        studentId: student._id,
        studentName: student.name,
        parentEmail: student.email,
        subject: `Progress Update for ${student.name}`,
      });
    }
  };

  const handleSendReport = async () => {
    try {
      // In a real app, this would be an API call
      toast({
        title: "Report Generated",
        description: `Progress report for ${report.studentName} has been generated successfully.`,
      });
      setIsReportDialogOpen(false);
      resetReport();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const handleSendFeedback = async () => {
    try {
      // In a real app, this would send email via API
      toast({
        title: "Feedback Sent",
        description: `Feedback has been sent to parent at ${feedback.parentEmail}`,
      });
      setIsFeedbackDialogOpen(false);
      resetFeedback();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback",
        variant: "destructive",
      });
    }
  };

  const resetReport = () => {
    setReport({
      studentId: "",
      studentName: "",
      course: "",
      attendance: 100,
      recitationQuality: 5,
      tajweedAccuracy: 5,
      memorizationProgress: 5,
      overallPerformance: "Excellent",
      strengths: "",
      areasForImprovement: "",
      teacherRemarks: "",
      nextGoals: "",
    });
  };

  const resetFeedback = () => {
    setFeedback({
      studentId: "",
      studentName: "",
      parentEmail: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-blue-900">
          Progress Reports & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Generate Progress Report */}
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900 mb-1">
                        Generate Progress Report
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create detailed progress report for students
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Student Progress Report</DialogTitle>
                <DialogDescription>
                  Fill out the progress report for the selected student
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student">Select Student</Label>
                    <Select
                      value={report.studentId}
                      onValueChange={(value) => handleStudentSelect(value, "report")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student._id} value={student._id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Course</Label>
                    <Input value={report.course} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="attendance">Attendance (%)</Label>
                    <Input
                      id="attendance"
                      type="number"
                      min="0"
                      max="100"
                      value={report.attendance}
                      onChange={(e) =>
                        setReport({ ...report, attendance: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="performance">Overall Performance</Label>
                    <Select
                      value={report.overallPerformance}
                      onValueChange={(value) =>
                        setReport({ ...report, overallPerformance: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                        <SelectItem value="Needs Improvement">
                          Needs Improvement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="recitation">Recitation (1-5)</Label>
                    <Input
                      id="recitation"
                      type="number"
                      min="1"
                      max="5"
                      value={report.recitationQuality}
                      onChange={(e) =>
                        setReport({
                          ...report,
                          recitationQuality: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tajweed">Tajweed (1-5)</Label>
                    <Input
                      id="tajweed"
                      type="number"
                      min="1"
                      max="5"
                      value={report.tajweedAccuracy}
                      onChange={(e) =>
                        setReport({
                          ...report,
                          tajweedAccuracy: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="memorization">Memorization (1-5)</Label>
                    <Input
                      id="memorization"
                      type="number"
                      min="1"
                      max="5"
                      value={report.memorizationProgress}
                      onChange={(e) =>
                        setReport({
                          ...report,
                          memorizationProgress: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="strengths">Strengths</Label>
                  <Textarea
                    id="strengths"
                    value={report.strengths}
                    onChange={(e) =>
                      setReport({ ...report, strengths: e.target.value })
                    }
                    placeholder="Student's key strengths..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">Areas for Improvement</Label>
                  <Textarea
                    id="improvements"
                    value={report.areasForImprovement}
                    onChange={(e) =>
                      setReport({ ...report, areasForImprovement: e.target.value })
                    }
                    placeholder="Areas that need more attention..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="remarks">Teacher Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={report.teacherRemarks}
                    onChange={(e) =>
                      setReport({ ...report, teacherRemarks: e.target.value })
                    }
                    placeholder="Your observations and comments..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Next Goals</Label>
                  <Textarea
                    id="goals"
                    value={report.nextGoals}
                    onChange={(e) =>
                      setReport({ ...report, nextGoals: e.target.value })
                    }
                    placeholder="Goals for the next period..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsReportDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Send Feedback to Parents */}
          <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-full">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900 mb-1">
                        Send Feedback to Parents
                      </h3>
                      <p className="text-sm text-gray-600">
                        Email progress updates to parents
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Feedback to Parent</DialogTitle>
                <DialogDescription>
                  Compose and send feedback email to student's parent
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedback-student">Select Student</Label>
                  <Select
                    value={feedback.studentId}
                    onValueChange={(value) => handleStudentSelect(value, "feedback")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parent-email">Parent Email</Label>
                  <Input
                    id="parent-email"
                    type="email"
                    value={feedback.parentEmail}
                    onChange={(e) =>
                      setFeedback({ ...feedback, parentEmail: e.target.value })
                    }
                    placeholder="parent@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={feedback.subject}
                    onChange={(e) =>
                      setFeedback({ ...feedback, subject: e.target.value })
                    }
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={feedback.message}
                    onChange={(e) =>
                      setFeedback({ ...feedback, message: e.target.value })
                    }
                    placeholder="Write your feedback message here..."
                    rows={8}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFeedbackDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendFeedback} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
