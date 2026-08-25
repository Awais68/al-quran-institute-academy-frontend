"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
} from "lucide-react";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  course: string;
  suitableTime: string;
  fatherName?: string;
  age?: number;
  gender?: string;
  dob?: string;
  image?: string;
  status?: string;
  feesPaid?: boolean;
  fees?: number;
  createdAt?: string;
}

interface StudentProfileDialogProps {
  student: Student;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function StudentProfileDialog({
  student,
  open,
  onClose,
  onUpdate,
}: StudentProfileDialogProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(student);
  const [saving, setSaving] = useState(false);

  const courses = [
    "Quran Reading (Nazara)",
    "Quran Memorization (Hifz)",
    "Tajweed Rules",
    "Quran Translation",
    "Tafsir (Quran Explanation)",
    "Islamic Studies for Kids",
    "Arabic Language",
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/user/admin/updateUser/${student._id}`, formData);
      toast({
        title: "Success",
        description: "Student profile updated successfully",
      });
      setEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.warn('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Student Profile</span>
            {!editing ? (
              <Button onClick={() => setEditing(true)} size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setEditing(false)} size="sm" variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            View and manage student information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-blue-200">
              <AvatarImage src={student.image} alt={student.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                {student.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant={student.feesPaid ? "default" : "destructive"}
                  className={student.feesPaid ? "bg-green-500" : "bg-red-500"}
                >
                  {student.feesPaid ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Unpaid</>
                  )}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {student.status || 'active'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                {editing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{student.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Father's Name</Label>
                {editing ? (
                  <Input
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{student.fatherName || 'N/A'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{student.age || 'N/A'} years</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                {editing ? (
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    <User className="h-4 w-4" />
                    <span>{student.gender || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Contact Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                {editing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{student.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                {editing ? (
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{student.country}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                {editing ? (
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{student.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Course Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Course Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Enrolled Course</Label>
                {editing ? (
                  <Select
                    value={formData.course}
                    onValueChange={(value) => setFormData({ ...formData, course: value })}
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
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{student.course}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Suitable Time</Label>
                {editing ? (
                  <Input
                    value={formData.suitableTime}
                    onChange={(e) => setFormData({ ...formData, suitableTime: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{student.suitableTime}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Fee Amount</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={formData.fees || 100}
                    onChange={(e) => setFormData({ ...formData, fees: parseInt(e.target.value) })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>${student.fees || 100}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                {editing ? (
                  <Select
                    value={formData.feesPaid ? "paid" : "unpaid"}
                    onValueChange={(value) => setFormData({ ...formData, feesPaid: value === "paid" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={student.feesPaid ? "default" : "destructive"}
                    className={student.feesPaid ? "bg-green-500" : "bg-red-500"}
                  >
                    {student.feesPaid ? (
                      <><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Unpaid</>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
