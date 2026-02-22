"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { EyeIcon, EyeOffIcon, MailIcon, UserIcon } from "lucide-react";
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");
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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "al-quran-institute");

    const cloudName = "dcp2soyzn";

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();

    return data.secure_url;
  };

  // Image upload handler
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setUploading(false);
      return;
    }
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      // alert("Image uploaded successfully!");
    } catch (error) {
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
  const validatePassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!imageUrl) {
      setError("Please upload an image before submitting the form.");
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
      phone: e.target.phone.value,
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
        setTimeout(() => {
          if (selectedRole === 'Admin') {
            router.push("/currentUser");
          } else if (selectedRole === 'Teacher') {
            router.push("/teacher");
          } else if (selectedRole === 'Student') {
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
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response?.data
          : JSON.stringify(err.response?.data)) ||
        err.message ||
        "Signup failed. Please try again later."
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

  // Show spinner while hydrating, checking auth, or redirecting logged-in user
  if (!mounted || authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* <IslamicBackground /> */}
      <div className="relative z-2 min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-6">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm border-blue-100/50 md:max-w-2xl lg:max-w-4xl">
          <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-2 sm:mb-0"
            >
              <div className="w-full">
                <Image
                  src="/images/logo.png"
                  height={80}
                  width={240}
                  alt="Logo Loading..."
                  className="flex justify-center mx-auto w-auto h-16 sm:h-20 md:h-24"
                />
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 block mt-2">
                  Al-Quran Institute Online
                </span>
              </div>
            </Link>
            <CardTitle className="text-xl sm:text-2xl text-blue-900 mt-2">
              Join Us Now
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-blue-700">
              Create your account to start learning the Quran
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show error or success message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-center">
                {typeof error === "string" ? error : JSON.stringify(error)}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-md text-center">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-blue-900 text-sm sm:text-base">Register As</Label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {['Student', 'Teacher', 'Admin'].map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setSelectedRole(roleOption)}
                      className={cn(
                        "px-2 sm:px-4 py-2.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all touch-manipulation",
                        selectedRole === roleOption
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300"
                      )}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
                {selectedRole === 'Admin' && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ First Admin registration is auto-approved. Additional admins require approval.
                  </p>
                )}
                {selectedRole === 'Teacher' && (
                  <p className="text-xs text-blue-600 mt-1">
                    👨‍🏫 Teacher accounts have access to student management
                  </p>
                )}
              </div>

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
                    <PhoneNumberInput />
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
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
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
                    <PhoneNumberInput />
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
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
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
                    <PhoneNumberInput />
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
                      onChange={handleUploadImage}
                      className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
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
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 sm:h-12 text-sm sm:text-base font-medium touch-manipulation"
                disabled={uploading || isSubmitting}
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
