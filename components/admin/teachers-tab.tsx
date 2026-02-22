"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { GraduationCap, Mail, Phone, Users, Calendar } from "lucide-react";
import Image from "next/image";

interface TeachersTabProps {
  teachers: any[];
  onRefresh: () => void;
}

export default function TeachersTab({ teachers, onRefresh }: TeachersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers Management</h2>
        <Button>Add New Teacher</Button>
      </div>

      {teachers && teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher, index) => (
            <Card key={teacher._id || index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={teacher.image || '/images/default-avatar.png'}
                    alt={teacher.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{teacher.name}</h3>
                    <Badge variant="secondary">{teacher.status || 'active'}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <div className="flex flex-wrap gap-1">
                      {teacher.specialization?.map((spec: string) => (
                        <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{teacher.assignedStudents?.length || 0} Students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No teachers found</p>
            <Button>Add Your First Teacher</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
