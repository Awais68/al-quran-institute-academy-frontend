"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, MailIcon, UserIcon, AlertCircle, RefreshCw } from "lucide-react";
import { AppRoutes } from "@/app/constant/constant";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/loader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { setAuthToken } from "@/lib/auth-token";
import { getErrorMessage, SERVER_STARTING_HINT } from "@/lib/error-handler";
import dynamic from "next/dynamic";

// Dynamically import heavy components to reduce initial bundle size
const Calendar22 = dynamic(
  () => import("@/components/datepicker").then((m) => ({ default: m.Calendar22 })),
  { ssr: false, loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded-md" /> }
);
const PhoneNumberInput = dynamic(() => import("@/components/npmPhone"), {
  ssr: false,
  loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded-md" />,
});
const CountryCitySelector = dynamic(() => import("@/components/country-city"), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100 animate-pulse rounded-md" />,
});
const LoginModal = dynamic(() => import("@/components/auth/login-modal"), {
  ssr: false,
});

export default function Signup() {
  const { user, setUser, loading: authLoading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartHint, setShowStartHint] = useState(false);
  const [uploadError, setUploadError] = useState("");
  // Controlled so the digits-only value is posted. The rendered input shows
  // "+92 335 220 4606" (16 chars) which the backend rejects — it caps phone at
  // 15 characters (routers/auth.js Joi .max(15)).
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  // Public signup can only ever create a Student account. Teacher and Admin
  // accounts are provisioned from the admin panel. A role chosen in the browser
  // is attacker-controlled input, so it must never be an authorisation
  // decision — the backend has to force this role server-side as well.
  const SIGNUP_ROLE = "Student";
  const selectedRole: string = SIGNUP_ROLE;
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);

  const openLoginModal = () => {
    setLoginOpen(true);
  };
  const dobtoage = (dob: Date | undefined) => {
    if (!dob) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--; // Birthday not yet reached this year
    }

    return age;
  };

  // Uploads through the backend /upload endpoint, which signs the request to
  // Cloudinary server-side. The old direct browser -> Cloudinary call used an
  // unsigned preset that no longer exists, so every upload came back 400 and
  // the user only ever saw "check your internet connection".
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(AppRoutes.uploadImage, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({} as any));

    if (!response.ok) {
      throw new Error(
        data?.message || `Image upload failed (${response.status}).`
      );
    }

    const url = data?.data?.url || data?.url || data?.secure_url;
    if (!url) {
      throw new Error("Image upload failed: server did not return an image URL.");
    }

    return url;
  };

  // Client-side guard rails. These are a courtesy to the user, not security —
  // the Cloudinary upload preset itself must also restrict formats, file size
  // and folder, because anyone can post to it directly.
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

  // Image upload handler
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError("Please choose a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("That image is over 2 MB. Please choose a smaller one.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      setUploadError("");
      // alert("Image uploaded successfully!");
    } catch (error) {
      // Show what actually went wrong — a generic "check your connection" hid
      // real server errors (bad file type, size limit, misconfigured storage).
      const message =
        error instanceof Error && error.message
          ? error.message
          : "We couldn't upload your photo. Please try again.";
      console.error("Profile image upload failed:", error);
      setUploadError(message);
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  // Generate 24-hour time slots in 30-minute intervals
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const value = `${hour.toString().padStart(2, "0")}${minute}`;
    // Format to 12-hour with AM/PM
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return {
      value,
      label: `${hour12.toString().padStart(2, "0")}:${minute}${ampm}`,
    };
  });

  // const [date, setDate] = useState();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const validatePassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  // After a few seconds of waiting, tell the user the backend may be starting
  // up (free-tier servers sleep and take up to a minute to wake).
  useEffect(() => {
    if (!isSubmitting) {
      setShowStartHint(false);
      return;
    }
    const timer = setTimeout(() => setShowStartHint(true), 8000);
    return () => clearTimeout(timer);
  }, [isSubmitting]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowStartHint(false);
    setIsSubmitting(true);

    if (!imageUrl) {
      setError("Please upload an image before submitting the form.");
      setIsSubmitting(false);
      return;
    }

    const emailValue = e.target.email.value as string;
    if (!EMAIL_RE.test(emailValue.trim())) {
      setError("Please enter a valid email address. For example: name@example.com");
      setIsSubmitting(false);
      return;
    }

    // Same bounds the backend enforces, so the user sees the problem here
    // instead of a 400 from /auth/signup.
    if (phone.length < 10 || phone.length > 15) {
      setError("Please enter a valid phone number (10 to 15 digits).");
      setIsSubmitting(false);
      return;
    }

    const password = e.target.password.value;
    if (!validatePassword(password)) {
      setError("Password must contain at least 8 characters with uppercase, lowercase, number and special character");
      setIsSubmitting(false);
      return;
    }

    const age = date ? dobtoage(date) : null;

    let data: any = {
      name: e.target.name.value.toUpperCase(),
      email: e.target.email.value,
      phone,
      gender: e.target.gender.value,
      city: selectedCity || null,
      country: selectedCountry,
      password: e.target.password.value,
      image: imageUrl,
      role: selectedRole,
    };

    // Add role-specific fields
    if (selectedRole === 'Student') {
      data = {
        ...data,
        fatherName: e.target.fatherName.value.toUpperCase(),
        dob: date ? date.toISOString() : null, // Convert Date object to ISO string for consistency
        age: age,
        app: e.target.app.value,
        suitableTime: e.target.suitableTime.value,
        course: e.target.course.value,
        classDays: selectedDays,
      };
    } else if (selectedRole === 'Teacher') {
      data = {
        ...data,
        qualification: e.target.qualification.value,
        experience: e.target.experience.value,
        expertise: e.target.expertise.value,
        bio: e.target.bio?.value || '',
      };
    }
    // Admin role only needs basic fields (already included above)

    try {
      const response = await apiClient.post(AppRoutes.signup, data);
      if (response.status === 200 || response.status === 201) {
        // Get user data and token from response if available
        const responseData = response.data;

        // Store token in localStorage + cookie (for middleware) if available in response
        if (responseData.data && responseData.data.token) {
          setAuthToken(responseData.data.token);
        }

        // Update AuthContext with user data if available
        if (responseData.data && responseData.data.user) {
          const userData = responseData.data.user;
          // Update AuthContext immediately to reflect logged in state
          setUser(userData);
        }

        setSuccess(
          "Signup successful! Welcome to Al Quran Institute Online. Redirecting to your dashboard..."
        );

        // Redirect directly to appropriate dashboard based on role
        // Trust the role the server assigned, never the one the client sent.
        const assignedRole = responseData?.data?.user?.role ?? SIGNUP_ROLE;
        setTimeout(() => {
          if (assignedRole === 'Admin') {
            router.push("/currentUser");
          } else if (assignedRole === 'Teacher') {
            router.push("/teacher");
          } else if (assignedRole === 'Student') {
            router.push("/students");
          } else {
            router.push("/");
          }
        }, 1000);
      } else {
        setError("Signup failed. Please try again later.");
      }
    } catch (err: any) {
      setError(
        getErrorMessage(err, {
          endpoint: "/auth/signup",
          fallback: "Signup failed. Please try again later.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  // Redirect already-logged-in users to their respective dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        router.replace('/currentUser');
      } else if (user.role === 'Teacher') {
        router.replace('/teacher');
      } else if (user.role === 'Student') {
        router.replace('/students');
      }
    }
  }, [user, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only blank the page while an already-logged-in user is being redirected away.
  // NOTE: this used to also gate on `!mounted || authLoading`, which meant the
  // server-rendered HTML contained nothing but a spinner — the form never existed
  // in the DOM for crawlers, and any hydration failure left the page permanently
  // blank. The form now renders on the server; auth state only overlays it.
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="sr-only">Redirecting to your dashboard…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-sky-100">
      {/* soft blurred shapes behind the glass card */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="relative z-2 min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-6">
        <Card className="glass-panel w-full max-w-md md:max-w-2xl lg:max-w-4xl">
          <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-2 sm:mb-0"
            >
              <div className="w-full">
                <Image
                  src="/images/al-quran-institute-online-logo.png"
                  height={80}
                  width={240}
                  alt="Al-Quran Institute Online logo"
                  className="flex justify-center mx-auto w-auto h-16 sm:h-20 md:h-24"
                />
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 block mt-2">
                  Al-Quran Institute Online
                </span>
              </div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight text-blue-900 mt-2">
              Create Your Student Account
            </h1>
            <CardDescription className="text-sm sm:text-base text-blue-700">
              Create your account to start learning the Quran
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show error or success message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-md text-sm leading-snug"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}
            {uploadError && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-md text-sm leading-snug"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <span>{uploadError}</span>
              </div>
            )}
            {success && (
              <div
                role="status"
                className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 p-3 mb-4 rounded-md text-sm leading-snug"
              >
                <span className="mt-0.5 block h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span>{success}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields for All Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative space-y-2">
                  <Label htmlFor="name" className="text-blue-900 text-sm sm:text-base">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full Name"
                      required
                      className="border-blue-200 focus:border-blue-400 pl-9 sm:pl-10 uppercase h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                </div>
                {selectedRole === 'Student' && (
                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="text-blue-900 text-sm sm:text-base">
                      Father Name
                    </Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="Father Name"
                      required
                      className="border-blue-200 focus:border-blue-400 uppercase h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                )}
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="email" className="text-blue-900 text-sm sm:text-base">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="border-blue-200 focus:border-blue-400 pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>
              {/* Role-Specific Fields */}
              {selectedRole === 'Student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="w-full space-y-2">
                    <Label htmlFor="gender" className="text-blue-900 text-sm sm:text-base">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900 text-sm sm:text-base">Phone Number</Label>
                    <PhoneNumberInput value={phone} onChange={setPhone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suitableTime" className="text-blue-900 text-sm sm:text-base">
                      Suitable Class Timing (Pakistan Time)
                    </Label>
                    <Select name="suitableTime" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Your Timing" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-blue-900 text-sm sm:text-base">Date of Birth</Label>
                    <Calendar22 date={date} onChange={setDate} />
                    {date && (
                      <p className="text-blue-700 mt-1 text-xs sm:text-sm">
                        Your Age: {dobtoage(date)} years
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app" className="text-blue-900 text-sm sm:text-base">
                      Class Application
                    </Label>
                    <Select name="app" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Application" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Teams">Teams</SelectItem>
                        <SelectItem value="Google Meet">Google Meet</SelectItem>
                        <SelectItem value="Telegram">Telegram</SelectItem>
                        <SelectItem value="Zoom">Zoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-blue-900 text-sm sm:text-base">
                      Course
                    </Label>
                    <Select name="course" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Your Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Qaida">Basic Rules of Qaida Course</SelectItem>
                        <SelectItem value="Tajweed">Tajweed</SelectItem>
                        <SelectItem value="Nazra">Nazra Quran</SelectItem>
                        <SelectItem value="Hifz">Hifz zul Quran</SelectItem>
                        <SelectItem value="Namaz">Namaz Course</SelectItem>
                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                        <SelectItem value="Arabic">Arabic Language Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="classDays" className="text-blue-900 text-sm sm:text-base">
                      Class Days
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center gap-2 text-blue-800 text-xs sm:text-sm touch-manipulation">
                          <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDays([...selectedDays, day]);
                              } else {
                                setSelectedDays(selectedDays.filter((d) => d !== day));
                              }
                            }}
                            className="h-4 w-4 sm:h-5 sm:w-5"
                          />
                          <span className="select-none">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-full space-y-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-full space-y-3 sm:space-y-4">
                    <Label className="text-blue-900 text-sm sm:text-base">Upload Photo</Label>
                    <input 
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded document preview"
                        width={160}
                        height={160}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mx-auto sm:mx-0"
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedRole === 'Teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-blue-900 text-sm sm:text-base">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900 text-sm sm:text-base">Phone Number</Label>
                    <PhoneNumberInput value={phone} onChange={setPhone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-blue-900 text-sm sm:text-base">
                      Qualification
                    </Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      placeholder="e.g., Alim, Hafiz, Master's"
                      required
                      className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-blue-900 text-sm sm:text-base">
                      Teaching Experience (Years)
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      placeholder="e.g., 5"
                      required
                      min="0"
                      className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="expertise" className="text-blue-900 text-sm sm:text-base">
                      Areas of Expertise
                    </Label>
                    <Input
                      id="expertise"
                      name="expertise"
                      placeholder="e.g., Tajweed, Hifz, Arabic Language"
                      required
                      className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="bio" className="text-blue-900 text-sm sm:text-base">
                      Brief Bio (Optional)
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      placeholder="Tell us about yourself and your teaching philosophy..."
                      className="w-full border border-blue-200 rounded-md p-2 sm:p-3 focus:border-blue-400 focus:outline-none text-sm sm:text-base resize-none"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-full space-y-3 sm:space-y-4">
                    <Label className="text-blue-900 text-sm sm:text-base">Upload Photo</Label>
                    <input 
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded document preview"
                        width={160}
                        height={160}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mx-auto sm:mx-0"
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedRole === 'Admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-blue-900 text-sm sm:text-base">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900 text-sm sm:text-base">Phone Number</Label>
                    <PhoneNumberInput value={phone} onChange={setPhone} />
                  </div>
                  <div className="col-span-full space-y-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-full space-y-3 sm:space-y-4">
                    <Label className="text-blue-900 text-sm sm:text-base">Upload Photo</Label>
                    <input 
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded document preview"
                        width={160}
                        height={160}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md mx-auto sm:mx-0"
                      />
                    )}
                  </div>
                  <div className="col-span-full bg-orange-50 border border-orange-200 p-3 sm:p-4 rounded-md">
                    <p className="text-orange-800 text-xs sm:text-sm">
                      <strong>Note:</strong> The first Admin registration is automatically approved. Subsequent admin accounts require approval from existing administrators.
                    </p>
                  </div>
                </div>
              )}

              <div className="relative space-y-2">
                <Label htmlFor="password" className="text-red-700 text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="border-blue-200 focus:border-pink-400 pr-10 sm:pr-12 h-10 sm:h-11 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 p-2 hover:bg-blue-50 rounded-md touch-manipulation"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-600">Must contain uppercase, lowercase, number, and special character (min 8 chars)</p>
              </div>
              {showStartHint && isSubmitting && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                  <span>{SERVER_STARTING_HINT}</span>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 sm:h-12 text-sm sm:text-base font-medium touch-manipulation"
                // `authLoading`/`mounted` gate the action, not the markup, so the
                // form is always present in the server-rendered HTML.
                disabled={!mounted || authLoading || uploading || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    <span className="text-sm sm:text-base">Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <LoginModal
              open={loginOpen}
              onOpenChange={setLoginOpen}
              onRegisterClick={() => {
                setLoginOpen(false);
                // agar chaho to yahan signup logic bhi laga sakte ho
              }}
            />


            <Separator className="my-4 sm:my-6" />

            <div className="text-center">
              <p className="text-blue-700 text-xs sm:text-sm">
                Already have an account?{" "}
                {/* <Link
                  // href="/signin"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={openLoginModal}
                >
                  Sign in here
                </Link> */}
                <Button
                  // variant="outline"
                  className="bg-white text-blue-500 mx-0 p-0 font-bold hover:bg-white hover:text-black text-xs sm:text-sm touch-manipulation"
                  onClick={openLoginModal}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
