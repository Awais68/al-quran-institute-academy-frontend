"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, DollarSign, CheckCircle2, XCircle, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import FeeReceiptDialog from "./fee-receipt-dialog";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  course: string;
  fatherName?: string;
  fees?: number;
  feesPaid?: boolean;
  status?: string;
  createdAt?: string;
  roll_no?: string;
  image?: string;
}

interface FeeReportProps {
  canUpdateFee?: boolean; // true for admin, false for teacher
}

export default function FeeReport({ canUpdateFee = false }: FeeReportProps) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get("/students/getAllStudents");
      const raw = response.data?.data?.students || response.data?.data || [];
      setStudents(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.warn("Error fetching students for fee report:", error);
      toast({
        title: "Error",
        description: "Failed to load student fee data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeeStatus = async (student: Student) => {
    if (!canUpdateFee) return;
    setUpdatingId(student._id);
    try {
      await apiClient.patch(`/students/updateFeeStatus/${student._id}`, {
        feesPaid: !student.feesPaid,
      });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id ? { ...s, feesPaid: !s.feesPaid } : s
        )
      );
      toast({
        title: "Updated",
        description: `Fee status updated to ${!student.feesPaid ? "Paid" : "Pending"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to update fee status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewReceipt = (student: Student) => {
    setSelectedStudent(student);
    setReceiptOpen(true);
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "paid"
        ? s.feesPaid === true
        : s.feesPaid !== true;
    return matchSearch && matchStatus;
  });

  const totalStudents = students.length;
  const paidCount = students.filter((s) => s.feesPaid).length;
  const pendingCount = totalStudents - paidCount;
  const totalRevenue = students.filter((s) => s.feesPaid).reduce((sum, s) => sum + (s.fees || 100), 0);
  const pendingRevenue = students.filter((s) => !s.feesPaid).reduce((sum, s) => sum + (s.fees || 100), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-blue-900">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-3xl font-bold text-green-700">{paidCount}</p>
            <p className="text-xs text-green-600">${totalRevenue} collected</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-red-600">{pendingCount}</p>
            <p className="text-xs text-red-500">${pendingRevenue} outstanding</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Collection Rate</p>
            <p className="text-3xl font-bold text-purple-700">
              {totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No students found</p>
            ) : (
              filtered.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.image} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {student.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                        {student.roll_no && (
                          <Badge variant="outline" className="text-xs">{student.roll_no}</Badge>
                        )}
                        <Badge
                          className={
                            student.feesPaid
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-red-100 text-red-700 border-red-300"
                          }
                          variant="outline"
                        >
                          {student.feesPaid ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {student.email} • {student.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3">
                    <span className="font-bold text-gray-900 text-sm">${student.fees || 100}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewReceipt(student)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                    {canUpdateFee && (
                      <Button
                        size="sm"
                        variant={student.feesPaid ? "destructive" : "default"}
                        onClick={() => handleToggleFeeStatus(student)}
                        disabled={updatingId === student._id}
                        className={student.feesPaid ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        {updatingId === student._id
                          ? "..."
                          : student.feesPaid
                          ? "Mark Unpaid"
                          : "Mark Paid"}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <FeeReceiptDialog
          student={selectedStudent}
          open={receiptOpen}
          onClose={() => {
            setReceiptOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
