"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  createdAt?: string;
}

interface FeeReceiptDialogProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export default function FeeReceiptDialog({ student, open, onClose }: FeeReceiptDialogProps) {
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptNumber = `AQI-${student._id.slice(-6).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Receipt is being downloaded as PDF",
    });
    window.print();
  };

  const handleEmail = () => {
    const subject = `Fee Receipt - ${receiptNumber}`;
    const body = `Dear ${student.name},\n\nPlease find attached your fee receipt for Al-Quran Institute Academy.\n\nReceipt Number: ${receiptNumber}\nAmount: $${student.fees || 100}\nCourse: ${student.course}\n\nThank you for your payment.\n\nBest Regards,\nAl-Quran Institute Academy`;
    
    window.location.href = `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fee Receipt</DialogTitle>
          <DialogDescription>
            Download or print the fee receipt for {student.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 print:hidden">
            <Button onClick={handlePrint} variant="outline" size="sm" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleEmail} variant="outline" size="sm" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          </div>

          {/* Receipt Content */}
          <div
            ref={receiptRef}
            className="bg-white p-8 rounded-lg border-2 border-gray-200"
            style={{ minHeight: '600px' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Al-Quran Institute Academy
              </h1>
              <p className="text-sm text-gray-600">
                Learn Quran Online with Expert Teachers
              </p>
              <p className="text-sm text-gray-600">
                Email: aqionline786@gmail.com | Phone: +92 340 320 1940
              </p>
            </div>

            <Separator className="my-6" />

            {/* Receipt Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-600 mb-1">Receipt Number</p>
                <p className="font-semibold text-gray-900">{receiptNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Date of Issue</p>
                <p className="font-semibold text-gray-900">{issueDate}</p>
              </div>
            </div>

            {/* Student Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Father's Name</p>
                    <p className="font-medium text-gray-900">{student.fatherName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      {student.city}, {student.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Enrolled Course</p>
                    <p className="font-medium text-gray-900">{student.course}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Details</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-gray-700">Description</th>
                    <th className="text-right py-2 text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-600">Monthly Tuition Fee</td>
                    <td className="text-right py-3 text-gray-900 font-medium">
                      ${student.fees || 100}
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-3 font-semibold text-gray-900">Total Amount</td>
                    <td className="text-right py-3 font-bold text-gray-900 text-lg">
                      ${student.fees || 100}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Status */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <p className={`font-bold text-lg ${student.feesPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {student.feesPaid ? 'PAID' : 'UNPAID'}
                  </p>
                </div>
                {student.feesPaid && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                    <p className="font-medium text-gray-900">{issueDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                This is a computer-generated receipt and does not require a signature.
              </p>
              <p className="text-sm text-gray-600">
                For any queries, please contact us at aqionline786@gmail.com
              </p>
              <p className="text-xs text-gray-500 mt-4">
                © 2026 Al-Quran Institute Academy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </Dialog>
  );
}
