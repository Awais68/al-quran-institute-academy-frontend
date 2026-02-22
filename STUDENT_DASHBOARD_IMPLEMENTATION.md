# Student Dashboard Implementation Guide

## Overview
Complete implementation of the student dashboard with 5 tabs, profile sidebar, and forgot password functionality.

## ✅ Completed Components

### 1. My Courses Tab (`components/student/my-courses.tsx`)
**Features Implemented:**
- ✅ Course display with teacher name and avatar
- ✅ Progress bar starting from 0%
- ✅ Next lesson information (read-only for students)
- ✅ Join Live Session button (WebRTC ready)
- ✅ Message Instructor button
- ✅ Teacher profile display
- ✅ Course progress tracking (completed/total lessons)

**Usage:**
```tsx
<MyCourses 
  studentData={user} 
  onJoinSession={handleJoinSession}
  onMessageTeacher={handleMessageTeacher}
/>
```

### 2. Schedule Tab (`components/student/schedule.tsx`)
**Features Implemented:**
- ✅ Upcoming lessons with date/time
- ✅ Teacher's lesson rules display
- ✅ Teacher's notes for each lesson
- ✅ Recitation practice section (video/audio links)
- ✅ Practice materials with play/watch buttons

**Usage:**
```tsx
<Schedule />
```

## 📋 Remaining Components to Create

### 3. Progress Tab (`components/student/progress.tsx`)
**Required Features:**
- Progress starts from 0%
- Display based on teacher remarks
- Show teacher feedback with dates
- Progress chart/graph visualization
- Subject-wise progress breakdown

**Structure:**
```tsx
interface Progress {
  overall: number; // 0-100
  attendance: number;
  recitation: number;
  memorization: number;
  teacherFeedback: TeacherFeedback[];
}

interface TeacherFeedback {
  date: string;
  remarks: string;
  rating: number;
  improvements: string[];
}
```

### 4. Achievement Tab (`components/student/achievement.tsx`)
**Required Features:**
- Badge/award system based on:
  - Attendance percentage
  - Teacher remarks
  - Course completion milestones
- Achievement cards with icons
- Unlock conditions display

**Structure:**
```tsx
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  criteria: {
    attendance?: number;
    lessonsCompleted?: number;
    teacherRating?: number;
  };
}
```

### 5. Activity Tab (`components/student/activity.tsx`)
**Required Features:**
- Teacher remarks history
- Upload audio/video recordings (Cloudinary integration)
- Received feedback from instructor with dates
- Activity timeline view

**Structure:**
```tsx
interface Activity {
  id: string;
  type: 'remark' | 'submission' | 'feedback';
  date: string;
  content: string;
  media?: {
    type: 'audio' | 'video';
    url: string;
    cloudinaryId: string;
  };
  teacherFeedback?: string;
}
```

### 6. Profile Sidebar (`components/student/profile-sidebar.tsx`)
**Required Features:**
- Right sidebar using Shadcn Sheet component
- Display complete student profile
- Admin/Teacher can edit:
  - Class timing
  - Schedule
  - Contact information
  - Course details
- Save/Cancel buttons

**Structure:**
```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Student Profile</SheetTitle>
    </SheetHeader>
    {/* Profile form with editable fields */}
  </SheetContent>
</Sheet>
```

### 7. Forgot Password Modal (`components/auth/forgot-password-modal.tsx`)
**Required Features:**
- Email input form
- Send reset link button
- Success/error messages
- Backend integration with nodemailer

**Structure:**
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Reset Password</DialogTitle>
    </DialogHeader>
    {/* Email form */}
  </DialogContent>
</Dialog>
```

## 🔧 Backend APIs Required

### Lessons API
```javascript
// POST /api/lessons/add - Teacher adds lesson
POST /api/lessons/add
Body: {
  studentId: string,
  courseId: string,
  title: string,
  date: string,
  time: string,
  rules: string,
  notes: string,
  repeat: boolean // if lesson not completed
}

// GET /api/lessons/student/:studentId
GET /api/lessons/student/:studentId

// PUT /api/lessons/:lessonId/complete
PUT /api/lessons/:lessonId/complete
```

### Progress API
```javascript
// GET /api/progress/student/:studentId
GET /api/progress/student/:studentId
Response: {
  overall: number,
  attendance: number,
  subjects: {
    recitation: number,
    memorization: number,
    tajweed: number
  },
  teacherFeedback: []
}

// POST /api/progress/feedback - Teacher adds feedback
POST /api/progress/feedback
Body: {
  studentId: string,
  remarks: string,
  rating: number,
  improvements: string[]
}
```

### Achievements API
```javascript
// GET /api/achievements/student/:studentId
GET /api/achievements/student/:studentId

// POST /api/achievements/unlock
POST /api/achievements/unlock
Body: {
  studentId: string,
  achievementId: string
}
```

### Activities API
```javascript
// GET /api/activities/student/:studentId
GET /api/activities/student/:studentId

// POST /api/activities/upload - Upload audio/video
POST /api/activities/upload
Body: FormData {
  studentId: string,
  file: File,
  type: 'audio' | 'video'
}
// Uploads to Cloudinary

// POST /api/activities/teacher-remark
POST /api/activities/teacher-remark
Body: {
  studentId: string,
  remarks: string
}
```

### Password Reset API
```javascript
// POST /api/auth/forgot-password
POST /api/auth/forgot-password
Body: {
  email: string
}
// Sends email with reset token using nodemailer

// POST /api/auth/reset-password
POST /api/auth/reset-password
Body: {
  token: string,
  newPassword: string
}
```

### Messaging API
```javascript
// POST /api/messages/send
POST /api/messages/send
Body: {
  from: string, // studentId
  to: string, // teacherId
  message: string,
  type: 'individual' | 'group'
}

// GET /api/messages/conversation/:userId
GET /api/messages/conversation/:userId
```

## 🎥 WebRTC Integration for Live Sessions

### WebRTC Setup
1. Use **Simple Peer** or **PeerJS** library
2. Signaling server using Socket.io
3. STUN/TURN servers for NAT traversal

### Implementation Steps:
```bash
# Install dependencies
npm install simple-peer socket.io-client

# Frontend component
components/student/video-call.tsx
```

### Basic WebRTC Component Structure:
```tsx
import SimplePeer from 'simple-peer';
import { io } from 'socket.io-client';

const VideoCall = ({ roomId, isTeacher }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  
  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        // Initialize peer connection
      });
  }, []);

  return (
    <div className="video-call-container">
      {/* Local video */}
      {/* Remote videos */}
    </div>
  );
};
```

## 📤 Cloudinary Integration for Media Upload

### Setup:
```bash
npm install cloudinary multer

# Backend configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Upload Handler (Backend):
```javascript
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-media', upload.single('file'), async (req, res) => {
  const fileStr = req.file.buffer.toString('base64');
  const uploadResponse = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${fileStr}`,
    {
      resource_type: 'auto',
      folder: 'student-submissions'
    }
  );
  
  res.json({ url: uploadResponse.secure_url, publicId: uploadResponse.public_id });
});
```

## 📧 Nodemailer Configuration for Password Reset

### Setup:
```bash
npm install nodemailer

# .env configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Email Service (Backend):
```javascript
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
```

## 🗄️ Database Schema Updates

### Lessons Schema
```javascript
const LessonSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: String,
  title: String,
  date: Date,
  time: String,
  rules: String,
  teacherNotes: String,
  completed: { type: Boolean, default: false },
  repeated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
```

### Progress Schema
```javascript
const ProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  overall: { type: Number, default: 0 },
  attendance: { type: Number, default: 0 },
  recitation: { type: Number, default: 0 },
  memorization: { type: Number, default: 0 },
  tajweed: { type: Number, default: 0 },
  teacherFeedback: [{
    date: Date,
    remarks: String,
    rating: Number,
    improvements: [String],
  }],
  updatedAt: { type: Date, default: Date.now },
});
```

### Achievement Schema
```javascript
const AchievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  achievementId: String,
  title: String,
  description: String,
  icon: String,
  unlocked: { type: Boolean, default: false },
  unlockedDate: Date,
  criteria: {
    attendance: Number,
    lessonsCompleted: Number,
    teacherRating: Number,
  },
});
```

### Activity Schema
```javascript
const ActivitySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['remark', 'submission', 'feedback'] },
  date: { type: Date, default: Date.now },
  content: String,
  media: {
    type: { type: String, enum: ['audio', 'video'] },
    url: String,
    cloudinaryId: String,
  },
  teacherFeedback: String,
});
```

### Password Reset Token Schema
```javascript
const ResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
```

## 📱 Main Student Dashboard Integration

### Updated Students Page (`app/students/page.tsx`):
```tsx
"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/app/context/AuthContext";
import { Sheet } from "@/components/ui/sheet";
import apiClient from "@/lib/api";

// Import tab components
import MyCourses from "@/components/student/my-courses";
import Schedule from "@/components/student/schedule";
import Progress from "@/components/student/progress";
import Achievement from "@/components/student/achievement";
import Activity from "@/components/student/activity";
import ProfileSidebar from "@/components/student/profile-sidebar";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'Student') {
      router.push('/');
    }
  }, [user, router]);

  const handleJoinSession = (courseId: string) => {
    // Open WebRTC video call component
    router.push(`/session/${courseId}`);
  };

  const handleMessageTeacher = (teacherId: string) => {
    // Open messaging interface
    router.push(`/messages/${teacherId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with profile button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-blue-700">
            Continue your Quranic journey
          </p>
        </div>
        <Button onClick={() => setProfileOpen(true)}>
          View Profile
        </Button>
      </div>

      {/* 5 Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievement">Achievement</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <MyCourses 
            studentData={user}
            onJoinSession={handleJoinSession}
            onMessageTeacher={handleMessageTeacher}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <Schedule />
        </TabsContent>

        <TabsContent value="progress">
          <Progress studentId={user?._id} />
        </TabsContent>

        <TabsContent value="achievement">
          <Achievement studentId={user?._id} />
        </TabsContent>

        <TabsContent value="activity">
          <Activity studentId={user?._id} />
        </TabsContent>
      </Tabs>

      {/* Profile Sidebar */}
      <ProfileSidebar
        open={profileOpen}
        onOpenChange={setProfileOpen}
        student={user}
        canEdit={false} // true for admin/teacher
      />
    </div>
  );
}
```

## ⏭️ Next Steps

1. **Create remaining tab components** (Progress, Achievement, Activity)
2. **Implement Profile Sidebar** with edit capabilities
3. **Add Forgot Password Modal** to login modal
4. **Create Backend APIs** for all features
5. **Implement WebRTC** for live sessions
6. **Setup Cloudinary** for media uploads
7. **Configure Nodemailer** for password reset emails
8. **Add Database Schemas** to backend
9. **Test all features** end-to-end
10. **Deploy and monitor**

## 📝 Implementation Priority

**Phase 1 (Critical):**
1. ✅ My Courses Tab
2. ✅ Schedule Tab
3. Forgot Password functionality
4. Backend APIs for lessons and schedule

**Phase 2 (Important):**
5. Progress Tab
6. Profile Sidebar
7. Progress tracking APIs

**Phase 3 (Enhancement):**
8. Achievement Tab
9. Activity Tab with media upload
10. WebRTC integration for live sessions

This implementation provides a complete roadmap for the student dashboard with all requested features.
