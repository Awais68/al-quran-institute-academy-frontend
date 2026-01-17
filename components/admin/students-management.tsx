"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  DollarSign,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentProfileDialog from "./student-profile-dialog";
import FeeReceiptDialog from "./fee-receipt-dialog";

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

interface StudentsManagementProps {
  onStatsUpdate?: () => void;
}

export default function StudentsManagement({ onStatsUpdate }: StudentsManagementProps) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const courses = [
    "Quran Reading (Nazara)",
    "Quran Memorization (Hifz)",
    "Tajweed Rules",
    "Quran Translation",
    "Tafsir (Quran Explanation)",
    "Islamic Studies for Kids",
    "Arabic Language",
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchTerm, filterCourse, filterCountry, filterStatus, filterPayment, sortBy]);

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get('/getAllStudents');
      setStudents(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm) ||
        student.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (filterCourse !== "all") {
      filtered = filtered.filter((student) => student.course === filterCourse);
    }

    // Country filter
    if (filterCountry !== "all") {
      filtered = filtered.filter((student) => student.country === filterCountry);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }

    // Payment filter
    if (filterPayment !== "all") {
      const isPaid = filterPayment === "paid";
      filtered = filtered.filter((student) => student.feesPaid === isPaid);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "date":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "fees":
          return (b.fees || 0) - (a.fees || 0);
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const handlePaymentToggle = async (studentId: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/user/admin/updateUser/${studentId}`, {
        feesPaid: !currentStatus,
      });
      
      toast({
        title: "Success",
        description: `Payment status updated to ${!currentStatus ? 'Paid' : 'Unpaid'}`,
      });
      
      fetchStudents();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const uniqueCountries = [...new Set(students.map(s => s.country).filter(Boolean))];

  if (loading) {
    return <div className="text-center py-12">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Course" />
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

        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger>
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="fees">Fees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredStudents.length}</span> of{" "}
          <span className="font-semibold">{students.length}</span> students
        </p>
      </div>

      {/* Students Grid */}
      <AnimatePresence mode="wait">
        {filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No students found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.image} alt={student.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            {student.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {student.name}
                          </h3>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowProfile(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePaymentToggle(student._id, student.feesPaid || false)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Toggle Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowReceipt(true);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Fee Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{student.city}, {student.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="h-3 w-3" />
                        <span className="truncate">{student.course}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{student.suitableTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
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
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${student.fees || 100}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      {selectedStudent && (
        <>
          <StudentProfileDialog
            student={selectedStudent}
            open={showProfile}
            onClose={() => {
              setShowProfile(false);
              setSelectedStudent(null);
            }}
            onUpdate={() => {
              fetchStudents();
              if (onStatsUpdate) onStatsUpdate();
            }}
          />
          <FeeReceiptDialog
            student={selectedStudent}
            open={showReceipt}
            onClose={() => {
              setShowReceipt(false);
              setSelectedStudent(null);
            }}
          />
        </>
      )}
    </div>
  );
}
