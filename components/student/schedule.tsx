"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import apiClient from "@/lib/api";
import { formatDistanceToNow, format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Video,
    Music,
    PlayCircle,
    User,
} from "lucide-react";

interface Session {
    _id: string;
    teacherId: {
        _id: string;
        name: string;
        email: string;
        image?: string;
    };
    studentId: string;
    course: string;
    scheduledDate: string;
    duration: number;
    topic?: string;
    status: "scheduled" | "completed" | "cancelled" | "ongoing";
    notes?: string;
    teacherNotes?: string;
    meetingLink?: string;
}

interface Lesson {
    _id: string;
    title: string;
    date: string;
    time: string;
    type: "upcoming" | "completed";
    rules?: string;
    teacherNotes?: string;
}

interface RecitationPractice {
    _id: string;
    title: string;
    type: "video" | "audio";
    url: string;
    addedBy: string;
    addedAt: string;
}

export default function Schedule() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [recitationPractices, setRecitationPractices] = useState<RecitationPractice[]>([]);
    const [loading, setLoading] = useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [practicesLoading, setPracticesLoading] = useState(false);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user?.id && !user?._id) return;

        const fetchSessions = async () => {
            setSessionsLoading(true);
            try {
                const res = await apiClient.get("/sessions");
                setSessions(res.data.data?.sessions || []);
            } catch (err: any) {
                console.warn("Failed to load sessions:", err);
            } finally {
                setSessionsLoading(false);
            }
        };

        const fetchLessons = async () => {
            setLoading(true);
            try {
                const userId = user.id || user._id;
                const res = await apiClient.get(`/lessons/student/${userId}?type=upcoming`);
                const data = res.data.data;
                setLessons(Array.isArray(data) ? data : Array.isArray(data?.lessons) ? data.lessons : []);
            } catch (err: any) {
                setError("Failed to load lessons");
            } finally {
                setLoading(false);
            }
        };

        const fetchRecitationPractices = async () => {
            setPracticesLoading(true);
            try {
                const userId = user.id || user._id;
                const res = await apiClient.get(`/lessons/recitation/${userId}`);
                setRecitationPractices(res.data.data?.practices || []);
            } catch (err: any) {
                console.warn("Failed to load recitation practices:", err);
            } finally {
                setPracticesLoading(false);
            }
        };

        fetchSessions();
        fetchLessons();
        fetchRecitationPractices();
    }, [user?.id, user?._id]);

    const handleJoinSession = (session: Session) => {
        if (session.meetingLink) {
            router.push(session.meetingLink);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-700";
            case "ongoing":
                return "bg-green-100 text-green-700";
            case "completed":
                return "bg-gray-100 text-gray-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const upcomingSessions = sessions.filter(
        (s) => s.status === "scheduled" && new Date(s.scheduledDate) > new Date()
    );

    return (
        <div className="space-y-6">
            {/* Scheduled Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Video className="h-5 w-5" />
                        Scheduled Classes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sessionsLoading && <p>Loading sessions...</p>}

                    {!sessionsLoading && upcomingSessions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No upcoming classes scheduled</p>
                            <p className="text-sm">
                                Your teacher will schedule classes for you soon
                            </p>
                        </div>
                    )}

                    {upcomingSessions.map((session) => (
                        <div
                            key={session._id}
                            className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg">
                                        {session.course}
                                        {session.topic && ` - ${session.topic}`}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span>Teacher: {session.teacherId.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {format(new Date(session.scheduledDate), "PPP")}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {format(new Date(session.scheduledDate), "p")} ({session.duration} min)
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(session.scheduledDate), { addSuffix: true })}
                                    </p>
                                </div>
                                <Badge className={getStatusColor(session.status)}>
                                    {session.status}
                                </Badge>
                            </div>

                            {session.notes && (
                                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                        📋 Session Notes:
                                    </p>
                                    <p className="text-sm text-gray-700">{session.notes}</p>
                                </div>
                            )}

                            {session.status === "scheduled" && (
                                <Button
                                    onClick={() => handleJoinSession(session)}
                                    className="mt-3 w-full bg-green-600 hover:bg-green-700"
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Session
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Upcoming Lessons */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Calendar className="h-5 w-5" />
                        Upcoming Lessons
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading && <p>Loading lessons...</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && lessons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No upcoming lessons scheduled</p>
                            <p className="text-sm">
                                Your teacher will add lessons for you soon
                            </p>
                        </div>
                    )}

                    {Array.isArray(lessons) && lessons.map((lesson) => (
                        <div
                            key={lesson._id}
                            className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg">
                                        {lesson.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(lesson.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {lesson.time}
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    variant={lesson.type === "upcoming" ? "default" : "secondary"}
                                    className="bg-green-100 text-green-700"
                                >
                                    {lesson.type === "upcoming" ? "Upcoming" : "Completed"}
                                </Badge>
                            </div>

                            {lesson.rules && (
                                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                        📋 Lesson Rules:
                                    </p>
                                    <p className="text-sm text-gray-700">{lesson.rules}</p>
                                </div>
                            )}

                            {lesson.teacherNotes && (
                                <div className="mt-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                                    <p className="text-sm font-medium text-yellow-900 mb-1">
                                        👨‍🏫 Teacher's Notes:
                                    </p>
                                    <p className="text-sm text-gray-700">{lesson.teacherNotes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Recitation Practice */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Music className="h-5 w-5" />
                        Recitation Practice
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {practicesLoading && <p>Loading practice materials...</p>}

                    {!practicesLoading && recitationPractices.length > 0 && recitationPractices.map((practice) => (
                        <div
                            key={practice._id}
                            className="p-4 border border-purple-200 rounded-lg bg-purple-50/50 hover:bg-purple-50 transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div
                                        className={`p-2 rounded-lg ${practice.type === "video"
                                            ? "bg-red-100"
                                            : "bg-blue-100"
                                            }`}
                                    >
                                        {practice.type === "video" ? (
                                            <Video className="h-5 w-5 text-red-600" />
                                        ) : (
                                            <Music className="h-5 w-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {practice.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Added by {practice.addedBy}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(practice.addedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open(practice.url, "_blank")}
                                >
                                    <PlayCircle className="h-4 w-4" />
                                    {practice.type === "video" ? "Watch" : "Listen"}
                                </Button>
                            </div>
                        </div>
                    ))}

                    {!practicesLoading && recitationPractices.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No practice materials available yet</p>
                            <p className="text-sm">
                                Your teacher will upload practice videos/audios soon
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
