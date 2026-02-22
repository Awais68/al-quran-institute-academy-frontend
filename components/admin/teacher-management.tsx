"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit, Eye, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  qualification: string;
  experience: string;
  expertise: string;
  bio?: string;
  image?: string;
  status: string;
  role: string;
}

export default function TeacherManagement() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await apiClient.get("/getAllStudents");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const teacherData = data.filter(
        (user: any) => user.role === "Teacher"
      );
      setTeachers(teacherData);
      setLoading(false);
    } catch (error) {
      console.warn("Error fetching teachers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewDialogOpen(true);
  };

  const handleUpdateTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await apiClient.put(`/user/admin/updateUser/${selectedTeacher._id}`, selectedTeacher);
      toast({
        title: "Success",
        description: "Teacher profile updated successfully",
      });
      setIsEditDialogOpen(false);
      fetchTeachers();
    } catch (error) {
      console.warn("Error updating teacher:", error);
      toast({
        title: "Error",
        description: "Failed to update teacher profile",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (teacherId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await apiClient.put(`/user/admin/updateUser/${teacherId}`, {
        status: newStatus,
      });
      toast({
        title: "Success",
        description: `Teacher ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      });
      fetchTeachers();
    } catch (error) {
      console.warn("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update teacher status",
        variant: "destructive",
      });
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-900">
            Teacher Management
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No teachers found</p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <Card key={teacher._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={teacher.image} alt={teacher.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {teacher.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900">
                            {teacher.name}
                          </h3>
                          <Badge
                            variant={
                              teacher.status === "active" ? "default" : "secondary"
                            }
                          >
                            {teacher.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {teacher.email} • {teacher.phone}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{teacher.qualification}</Badge>
                          <Badge variant="outline">
                            {teacher.experience} years exp
                          </Badge>
                          <Badge variant="outline">{teacher.expertise}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTeacher(teacher)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTeacher(teacher)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          teacher.status === "active" ? "destructive" : "default"
                        }
                        onClick={() => handleToggleStatus(teacher._id, teacher.status)}
                      >
                        {teacher.status === "active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Teacher Profile</DialogTitle>
              <DialogDescription>View teacher details</DialogDescription>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={selectedTeacher.image}
                      alt={selectedTeacher.name}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                      {selectedTeacher.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">
                      {selectedTeacher.name}
                    </h3>
                    <p className="text-gray-600">{selectedTeacher.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="font-medium">{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Gender</Label>
                    <p className="font-medium capitalize">{selectedTeacher.gender}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Location</Label>
                    <p className="font-medium">
                      {selectedTeacher.city}, {selectedTeacher.country}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <p className="font-medium capitalize">{selectedTeacher.status}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Qualification</Label>
                    <p className="font-medium">{selectedTeacher.qualification}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Experience</Label>
                    <p className="font-medium">{selectedTeacher.experience} years</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-500">Expertise</Label>
                    <p className="font-medium">{selectedTeacher.expertise}</p>
                  </div>
                  {selectedTeacher.bio && (
                    <div className="col-span-2">
                      <Label className="text-gray-500">Bio</Label>
                      <p className="text-sm">{selectedTeacher.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Teacher Profile</DialogTitle>
              <DialogDescription>
                Update teacher information and credentials
              </DialogDescription>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={selectedTeacher.name}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedTeacher.email}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={selectedTeacher.phone}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-gender">Gender</Label>
                    <Select
                      value={selectedTeacher.gender}
                      onValueChange={(value) =>
                        setSelectedTeacher({ ...selectedTeacher, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      value={selectedTeacher.country}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={selectedTeacher.city}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-qualification">Qualification</Label>
                    <Input
                      id="edit-qualification"
                      value={selectedTeacher.qualification}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          qualification: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-experience">Experience (years)</Label>
                    <Input
                      id="edit-experience"
                      value={selectedTeacher.experience}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-expertise">Expertise</Label>
                    <Input
                      id="edit-expertise"
                      value={selectedTeacher.expertise}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          expertise: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      value={selectedTeacher.bio || ""}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          bio: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedTeacher.status}
                      onValueChange={(value) =>
                        setSelectedTeacher({ ...selectedTeacher, status: value })
                      }
                    >
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTeacher}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
