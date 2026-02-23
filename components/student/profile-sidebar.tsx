"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Edit,
  Save,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  course?: string;
  enrollmentDate?: string;
  suitableTime?: string;
  days?: string[];
  country?: string;
  city?: string;
  status?: string;
  teacherInstructions?: string;
  adminNotes?: string;
}

interface ProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  canEdit?: boolean; // true for admin/teacher
}

export default function ProfileSidebar({
  open,
  onOpenChange,
  student,
  canEdit = false,
}: ProfileSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  // Fetch fresh student data when sidebar opens
  useEffect(() => {
    if (open && student?._id) {
      const fetchStudentById = async () => {
        setFetchingProfile(true);
        try {
          const response = await apiClient.get(`/students/getAStudent/${student._id}`);
          const freshData = response.data?.data?.student || response.data?.data;
          if (freshData) {
            setFormData({ ...freshData, role: freshData.role || "Student" });
          }
        } catch (error) {
          // Fallback to passed prop data if fetch fails
          setFormData(student);
        } finally {
          setFetchingProfile(false);
        }
      };
      fetchStudentById();
    }
  }, [open, student?._id]);

  const handleInputChange = (field: keyof Student, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    try {
      await apiClient.put(`/students/updateStudent/${formData._id}`, {
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        course: formData.course,
        suitableTime: formData.suitableTime,
        days: formData.days,
      });

      toast({
        title: "Profile updated",
        description: "Student profile has been updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(student);
    setIsEditing(false);
  };

  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        {fetchingProfile && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {!fetchingProfile && !formData && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No profile data available
          </div>
        )}
        {!fetchingProfile && formData && (
        <>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl text-blue-900">Student Profile</SheetTitle>
            {canEdit && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          <SheetDescription>
            {isEditing ? "Edit student information" : "View student profile details"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Picture and Basic Info */}
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-blue-200">
                  <AvatarImage src={formData.image} alt={formData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-bold text-gray-900">{formData.name}</h3>
                <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {formData.role}
                </Badge>
                {formData.status && (
                  <Badge
                    variant="outline"
                    className={`mt-2 ${
                      formData.status === "Active"
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-gray-50 border-gray-300 text-gray-800"
                    }`}
                  >
                    {formData.status}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h4>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h4>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter country"
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter city"
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <Separator />

          {/* Course Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Details
            </h4>

            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              {isEditing && canEdit ? (
                <Select
                  value={formData.course || ""}
                  onValueChange={(value) => handleInputChange("course", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quran Recitation">Quran Recitation</SelectItem>
                    <SelectItem value="Tajweed">Tajweed</SelectItem>
                    <SelectItem value="Hifz (Memorization)">Hifz (Memorization)</SelectItem>
                    <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                    <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="course"
                  value={formData.course || "Not assigned"}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>

            {/* Enrollment Date */}
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Enrollment Date
              </Label>
              <Input
                id="enrollmentDate"
                value={formatDate(formData.enrollmentDate)}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <Separator />

          {/* Schedule Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Class Schedule
            </h4>

            {/* Suitable Time */}
            <div className="space-y-2">
              <Label htmlFor="suitableTime">Suitable Time</Label>
              {isEditing && canEdit ? (
                <Select
                  value={formData.suitableTime || ""}
                  onValueChange={(value) => handleInputChange("suitableTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</SelectItem>
                    <SelectItem value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</SelectItem>
                    <SelectItem value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</SelectItem>
                    <SelectItem value="8:00 PM - 10:00 PM">8:00 PM - 10:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="suitableTime"
                  value={formData.suitableTime || "Not set"}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>

            {/* Days */}
            <div className="space-y-2">
              <Label>Preferred Days</Label>
              {isEditing && canEdit ? (
                <div className="grid grid-cols-2 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (day) => (
                      <Button
                        key={day}
                        variant={formData.days?.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentDays = formData.days || [];
                          const newDays = currentDays.includes(day)
                            ? currentDays.filter((d) => d !== day)
                            : [...currentDays, day];
                          handleInputChange("days", newDays);
                        }}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.days && formData.days.length > 0 ? (
                    formData.days.map((day) => (
                      <Badge key={day} variant="outline">
                        {day}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Not set</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Teacher Instructions */}
          {formData.teacherInstructions && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Instructions from Teacher
                </h4>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Guidelines</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-wrap">
                    {formData.teacherInstructions}
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}

          {/* Admin Notes */}
          {canEdit && formData.adminNotes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Admin Notes
                </h4>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Administrative Information</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-wrap">
                    {formData.adminNotes}
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {isEditing && canEdit && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
        </>
        )}
      </SheetContent>
    </Sheet>
  );
}
