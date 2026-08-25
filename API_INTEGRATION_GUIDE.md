# Backend API Integration Reference

## Backend Status
✅ Backend is running on http://localhost:4000
✅ All new models created successfully
✅ All new routes registered successfully

## New Models Created
1. `/models/Lesson.js` - For lessons and schedule
2. `/models/Progress.js` - For student progress tracking
3. `/models/Achievement.js` - For achievements system
4. `/models/Activity.js` - For student activities and submissions
5. `/models/RecitationPractice.js` - For practice materials

## New API Endpoints Created

### 1. Lessons API (`/lessons`)

#### Get Student Lessons
```javascript
GET /lessons/student/:studentId?type=upcoming
// Returns: { success: boolean, data: { lessons: [] } }
```

#### Add Lesson (Teacher)
```javascript
POST /lessons/add
Body: {
  studentId: string,
  courseId: string,
  title: string,
  date: date,
  time: string,
  rules: string,
  teacherNotes: string
}
```

#### Mark Lesson Complete
```javascript
PUT /lessons/:lessonId/complete
// Returns: { success: boolean, data: { lesson } }
```

#### Get Recitation Practices
```javascript
GET /lessons/recitation/:studentId
// Returns: { success: boolean, data: { practices: [] } }
```

#### Add Recitation Practice (Teacher)
```javascript
POST /lessons/recitation/add
Body: {
  studentId: string,
  title: string,
  type: "video" | "audio",
  url: string,
  cloudinaryId: string
}
```

### 2. Progress API (`/progress`)

#### Get Student Progress
```javascript
GET /progress/student/:studentId
// Returns: { 
//   success: boolean, 
//   data: { 
//     progress: {
//       overall: number,
//       attendance: number,
//       recitation: number,
//       memorization: number,
//       tajweed: number,
//       teacherFeedback: []
//     }
//   } 
// }
```

#### Add Teacher Feedback
```javascript
POST /progress/feedback
Body: {
  studentId: string,
  remarks: string,
  rating: number (1-5),
  improvements: string[]
}
```

#### Update Progress (Teacher)
```javascript
PUT /progress/update/:studentId
Body: {
  overall: number (0-100),
  attendance: number (0-100),
  recitation: number (0-100),
  memorization: number (0-100),
  tajweed: number (0-100)
}
```

### 3. Achievements API (`/achievements`)

#### Get Student Achievements
```javascript
GET /achievements/student/:studentId
// Returns: { success: boolean, data: { achievements: [] } }
// Auto-initializes 8 default achievements if none exist
```

#### Unlock Achievement
```javascript
POST /achievements/unlock
Body: {
  studentId: string,
  achievementId: string
}
```

#### Update Achievement Progress
```javascript
PUT /achievements/progress
Body: {
  studentId: string,
  achievementId: string,
  progress: number (0-100)
}
```

### 4. Activities API (`/activities`)

#### Get Student Activities
```javascript
GET /activities/student/:studentId?type=remark|submission|feedback
// Returns: { success: boolean, data: { activities: [] } }
```

#### Upload Practice (Student)
```javascript
POST /activities/upload
Headers: { 'Content-Type': 'multipart/form-data' }
Body: FormData {
  file: File (audio/video, max 50MB),
  studentId: string,
  note: string (optional)
}
// Auto-uploads to Cloudinary
// Returns: { success: boolean, data: { activity } }
```

#### Add Teacher Remark
```javascript
POST /activities/teacher-remark
Body: {
  studentId: string,
  remarks: string
}
```

#### Add Feedback to Submission
```javascript
PUT /activities/:activityId/feedback
Body: {
  feedback: string
}
```

## Frontend Components Update Instructions

### components/student/schedule.tsx
**Current**: Uses mock data
**Update needed**: 
```typescript
// Add imports
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";

// In component
const { user } = useContext(AuthContext);

useEffect(() => {
  const fetchSchedule = async () => {
    try {
      // Get lessons
      const lessonsRes = await apiClient.get(`/lessons/student/${user._id}?type=upcoming`);
      const lessons = lessonsRes.data.data?.lessons || [];
      setLessons(lessons);

      // Get recitation practices
      const practicesRes = await apiClient.get(`/lessons/recitation/${user._id}`);
      const practices = practicesRes.data.data?.practices || [];
      setRecitationPractices(practices);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (user?._id) fetchSchedule();
}, [user]);
```

### components/student/progress.tsx
**Current**: Uses mock data
**Update needed**:
```typescript
const fetchProgress = async () => {
  try {
    const response = await apiClient.get(`/progress/student/${studentId}`);
    setProgress(response.data.data.progress);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### components/student/achievement.tsx
**Current**: Uses mock data
**Update needed**:
```typescript
const fetchAchievements = async () => {
  try {
    const response = await apiClient.get(`/achievements/student/${studentId}`);
    setAchievements(response.data.data.achievements);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### components/student/activity.tsx
**Current**: Uses mock data with Cloudinary upload placeholder
**Update needed**:
```typescript
// Get activities
const fetchActivities = async () => {
  try {
    const response = await apiClient.get(`/activities/student/${studentId}`);
    setActivities(response.data.data.activities);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Upload file
const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("studentId", studentId);
    formData.append("note", uploadNote);

    const response = await apiClient.post("/activities/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    toast({ title: "Upload successful!" });
    fetchActivities(); // Refresh list
  } catch (error) {
    toast({ title: "Upload failed", variant: "destructive" });
  }
};
```

## Testing the APIs

### Test with curl or Postman:

1. **Get student lessons:**
```bash
curl -X GET http://localhost:4000/lessons/student/STUDENT_ID \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

2. **Get student progress:**
```bash
curl -X GET http://localhost:4000/progress/student/STUDENT_ID \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

3. **Get achievements:**
```bash
curl -X GET http://localhost:4000/achievements/student/STUDENT_ID \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

4. **Get activities:**
```bash
curl -X GET http://localhost:4000/activities/student/STUDENT_ID \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

## Response Format

All endpoints follow this format:
```javascript
{
  success: boolean,
  data: { ... },
  error: boolean,
  message: string
}
```

## Error Handling

All endpoints include error handling and will return:
```javascript
{
  success: false,
  data: null,
  error: true,
  message: "Error description"
}
```

## Authentication

All endpoints require authentication via JWT token in HttpOnly cookie.
The token is automatically sent by `apiClient` with `withCredentials: true`.

## Next Steps

1. ✅ Backend models created
2. ✅ Backend routes created
3. ✅ Routes registered in index.js
4. ✅ Backend running on port 4000
5. ⏳ Update frontend components to replace mock data with API calls
6. ⏳ Test all endpoints with actual data
7. ⏳ Add WebRTC for video calling (separate implementation)
8. ⏳ Add forgot password email functionality with nodemailer

## File Uploads

The `/activities/upload` endpoint automatically:
- Validates file type (audio/video only)
- Validates file size (max 50MB)
- Uploads to Cloudinary
- Stores Cloudinary URL and public ID
- Creates activity record with media info

No additional Cloudinary configuration needed in frontend!
