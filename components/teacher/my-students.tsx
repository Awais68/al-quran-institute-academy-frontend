"use client";

import { useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "@/app/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreVertical, Eye, Edit, MessageCircle, Phone, FileText, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import ProfileSidebar from "@/components/student/profile-sidebar";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  country: string;
  city: string;
  image?: string;
  roll_no: string;
  feesPaid: boolean;
  status: string;
  role?: string;
  teacherInstructions?: string;
  adminNotes?: string;
}

interface MyStudentsProps {
  students: Student[];
  onRefresh: () => void;
}

export default function MyStudents({ students, onRefresh }: MyStudentsProps) {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [instructions, setInstructions] = useState("");
  const [progress, setProgress] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const courses = [...new Set(students.map((s) => s.course))];

  const handleOpenInstructions = (student: Student) => {
    setSelectedStudent(student);
    setInstructions(student.teacherInstructions || "");
    setIsInstructionsDialogOpen(true);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setProfileOpen(true);
  };

  const handleEditProgress = (student: Student) => {
    setSelectedStudent(student);
    setProgress("");
    setIsProgressOpen(true);
  };

  const handleSendFeedback = (student: Student) => {
    setSelectedStudent(student);
    setFeedback("");
    setIsFeedbackOpen(true);
  };

  const handleContact = (student: Student) => {
    setSelectedStudent(student);
    setIsContactOpen(true);
  };

  const handleSaveInstructions = async () => {
    if (!selectedStudent) return;

    setIsSaving(true);
    try {
      await apiClient.patch(`/user/students/${selectedStudent._id}/instructions`, {
        teacherInstructions: instructions
      });

      toast({
        title: "Success",
        description: "Instructions updated successfully",
      });

      setIsInstructionsDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to update instructions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!selectedStudent || !progress) return;

    setIsSaving(true);
    try {
      toast({
        title: "Success",
        description: "Progress updated successfully",
      });
      setIsProgressOpen(false);
      setProgress("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedStudent || !feedback) return;

    setIsSaving(true);
    try {
      toast({
        title: "Success",
        description: "Feedback sent successfully",
      });
      setIsFeedbackOpen(false);
      setFeedback("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send feedback",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl text-blue-900">My Students</CardTitle>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900">
                            {student.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {student.roll_no}
                          </Badge>
                          <Badge
                            variant={student.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>{student.email}</span>
                          <span>•</span>
                          <span>{student.course}</span>
                          <span>•</span>
                          <span>{student.city}, {student.country}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/studentbyId/${student._id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const roomId = `room-${student._id}-${Date.now()}`;
                          const socket = io("http://localhost:4000");
                          socket.emit("call-student", {
                            studentId: student._id,
                            teacherName: user?.name || "Teacher",
                            roomId: roomId
                          });
                          setTimeout(() => {
                            router.push(`/video-call/${roomId}`);
                            socket.disconnect();
                          }, 500);
                        }}>
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenInstructions(student)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Instructions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Feedback
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Instructions Dialog */}
      <Dialog open={isInstructionsDialogOpen} onOpenChange={setIsInstructionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Instructions</DialogTitle>
            <DialogDescription>
              Add instructions or notes for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions for Student</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions, study guidelines, or important notes for the student..."
                rows={8}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                These instructions will be visible to the student and admin.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsInstructionsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveInstructions} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Instructions"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile View Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-blue-200">
                  <AvatarImage src={selectedStudent.image} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    {selectedStudent.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <Badge className={selectedStudent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">Roll Number</Label>
                  <p className="font-semibold">{selectedStudent.roll_no || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedStudent.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">Course</Label>
                  <p className="font-semibold">{selectedStudent.course}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">Fee Status</Label>
                  <Badge variant={selectedStudent.feesPaid ? 'default' : 'destructive'}>
                    {selectedStudent.feesPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">Location</Label>
                  <p className="font-semibold">{selectedStudent.city}, {selectedStudent.country}</p>
                </div>
              </div>

              {selectedStudent.teacherInstructions && (
                <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                  <Label className="text-gray-600">Teacher Instructions</Label>
                  <p className="text-sm">{selectedStudent.teacherInstructions}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Edit Dialog */}
      <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student Progress</DialogTitle>
            <DialogDescription>
              Update progress notes for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="progress">Progress Notes</Label>
              <Textarea
                id="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="Enter progress updates, completed lessons, areas of improvement..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsProgressOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProgress} disabled={isSaving || !progress}>
              {isSaving ? "Saving..." : "Save Progress"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Send feedback to {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback Message</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback, suggestions, or encouragement for the student..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFeedbackOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={isSaving || !feedback}>
              {isSaving ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Student</DialogTitle>
            <DialogDescription>
              Contact information for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="text-sm text-gray-600">Phone</Label>
                  <p className="font-semibold">{selectedStudent.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <p className="font-semibold">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={() => window.location.href = `tel:${selectedStudent.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button className="flex-1" onClick={() => window.location.href = `mailto:${selectedStudent.email}`}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Sidebar */}
      {selectedStudent && (
        <ProfileSidebar
          open={profileOpen}
          onOpenChange={setProfileOpen}
          student={{ ...selectedStudent, role: "Student" }}
          canEdit={true}
        />
      )}
    </Card>
  );
}
