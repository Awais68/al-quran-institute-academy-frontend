"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  Download,
  Mail,
  CreditCard,
  Calendar,
  User,
  Phone,
  MapPin,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  fees: number;
  feeStatus: "paid" | "unpaid" | "partial";
  totalFeePaid: number;
  city: string;
  country: string;
  status: string;
  roll_no?: string;
}

interface Payment {
  _id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  notes: string;
  status: string;
}

interface StudentProfileEnhancedProps {
  studentId: string;
  isAdmin?: boolean;
}

export default function StudentProfileEnhanced({ studentId, isAdmin = false }: StudentProfileEnhancedProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingPayment, setAddingPayment] = useState(false);
  const { toast } = useToast();

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "cash",
    notes: "",
    paymentDate: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    fetchStudentData();
    fetchPaymentHistory();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const response = await apiClient.get(`/user/${studentId}`);
      if (response.data) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch student:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await apiClient.get(`/fees/payment-history/${studentId}`);
      if (response.data.success) {
        setStudent(response.data.data.student);
        setPayments(response.data.data.payments);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    setAddingPayment(true);
    try {
      const response = await apiClient.post(`/fees/add-payment/${studentId}`, paymentForm);
      if (response.data.success) {
        toast({
          title: "Payment Added",
          description: `Receipt ${response.data.data.receiptNumber} generated successfully`
        });
        fetchStudentData();
        fetchPaymentHistory();
        setPaymentForm({
          amount: "",
          paymentMethod: "cash",
          notes: "",
          paymentDate: new Date().toISOString().split("T")[0]
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add payment",
        variant: "destructive"
      });
    } finally {
      setAddingPayment(false);
    }
  };

  const handleToggleFeeStatus = async (newStatus: string) => {
    try {
      const response = await apiClient.put(`/fees/toggle-status/${studentId}`, {
        feeStatus: newStatus
      });
      if (response.data.success) {
        toast({
          title: "Status Updated",
          description: `Fee status changed to ${newStatus}`
        });
        fetchStudentData();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleDownloadReceipt = (receiptNumber: string) => {
    window.open(`${apiClient.defaults.baseURL}/fees/receipt/${receiptNumber}`, "_blank");
  };

  const handleEmailReceipt = async (receiptNumber: string) => {
    try {
      const response = await apiClient.post(`/fees/send-receipt/${receiptNumber}`, {
        recipientEmail: student?.email
      });
      if (response.data.success) {
        toast({
          title: "Receipt Sent",
          description: `Receipt emailed to ${student?.email}`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send receipt",
        variant: "destructive"
      });
    }
  };

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const balance = student.fees - student.totalFeePaid;
  const paymentProgress = (student.totalFeePaid / student.fees) * 100;

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
      unpaid: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
      partial: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertCircle }
    };
    const variant = variants[status as keyof typeof variants] || variants.unpaid;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} border px-3 py-1 text-sm font-semibold flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{student.email}</p>
              </div>
            </div>
            {getStatusBadge(student.feeStatus)}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-semibold">{student.roll_no || "Not Assigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{student.city}, {student.country}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p className="font-semibold">{student.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={student.status === "active" ? "default" : "secondary"}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Summary Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Fee</p>
              <p className="text-3xl font-bold text-gray-900">${student.fees}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-3xl font-bold text-green-600">${student.totalFeePaid}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Balance</p>
              <p className="text-3xl font-bold text-red-600">${balance}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{paymentProgress.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1 gap-2">
                    <CreditCard className="h-4 w-4" />
                    Add Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={paymentForm.paymentMethod}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="online">Online Payment</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentForm.paymentDate}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes..."
                        value={paymentForm.notes}
                        onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleAddPayment}
                      disabled={addingPayment}
                      className="w-full"
                    >
                      {addingPayment ? "Adding..." : "Add Payment"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Select
                value={student.feeStatus}
                onValueChange={handleToggleFeeStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Mark as Paid</SelectItem>
                  <SelectItem value="unpaid">Mark as Unpaid</SelectItem>
                  <SelectItem value="partial">Mark as Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No payments recorded yet</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod.replace("_", " ")}
                      </p>
                      {payment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                      )}
                      <p className="text-xs text-blue-600 mt-1">
                        Receipt: {payment.receiptNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadReceipt(payment.receiptNumber)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmailReceipt(payment.receiptNumber)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
