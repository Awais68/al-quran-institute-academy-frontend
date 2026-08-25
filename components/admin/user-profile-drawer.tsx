"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { Mail, Phone, MapPin, BookOpen, Clock, DollarSign, UserCheck } from "lucide-react";

interface UserProfileDrawerProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function UserProfileDrawer({ user, open, onOpenChange, onUpdate }: UserProfileDrawerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: user?.role || 'Student',
    fees: user?.fees || 0,
    suitableTime: user?.suitableTime || '',
    course: user?.course || '',
    status: user?.status || 'pending',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'Student',
        fees: user.fees || 0,
        suitableTime: user.suitableTime || '',
        course: user.course || '',
        status: user.status || 'pending',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      await apiClient.put(`/user/admin/updateUser/${user._id}`, formData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>View and edit user details</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">Roll No: {user.roll_no || 'N/A'}</p>
              <Badge variant="secondary" className="mt-1">{user.role}</Badge>
            </div>
          </div>

          <Separator />

          {/* Read-only Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{user.city ? `${user.city}, ${user.country}` : user.country}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-700">Edit Details</h4>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees ($)</Label>
              <Input
                id="fees"
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData({...formData, fees: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timing">Suitable Timing</Label>
              <Input
                id="timing"
                value={formData.suitableTime}
                onChange={(e) => setFormData({...formData, suitableTime: e.target.value})}
                placeholder="e.g., 10:00 AM - 11:00 AM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData({...formData, course: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Qaida">Qaida</SelectItem>
                  <SelectItem value="Tajweed">Tajweed</SelectItem>
                  <SelectItem value="Nazra">Nazra</SelectItem>
                  <SelectItem value="Hifz">Hifz</SelectItem>
                  <SelectItem value="Namaz">Namaz</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleUpdate} disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
