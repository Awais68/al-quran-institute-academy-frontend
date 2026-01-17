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
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar22 } from "@/components/datepicker";
import PhoneNumberInput from "@/components/npmPhone";
import CountryCitySelector from "@/components/country-city";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/loader";
import Image from "next/image";
import LoginModal from "@/components/auth/login-modal";
import { cn } from "@/lib/utils";

export default function Signup({ }: // params,
  // searchParams,
  {
    params?: any;
    searchParams?: any;
  }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [age, setAge] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [signup, setSignup] = useState(false);
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
    setSignup(false);
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
        dob: date,
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
      const response = await axios.post(AppRoutes.signup, data);
      if (response.status === 200 || response.status === 201) {
        setSuccess(
          "Signup successful! Welcome to Al Quran Institute Online. You can now login with your credentials."
        );
        setTimeout(() => {
          // Redirect to home page with query parameters to show login modal
          router.push(
            `/?showLogin=true&email=${encodeURIComponent(e.target.email.value)}`
          );
        }, 2000);
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
  const [student, setStudent] = useState<any[]>([]);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axios.get(AppRoutes.getStudent);

        setStudent(response?.data?.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    getAllStudents();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null; // Ya skeleton/loader

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* <IslamicBackground /> */}
      <div className="relative z-2 min-h-screen flex items-center justify-center px-4 py-0">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm border-blue-100/50 md:max-w-[70%]">
          <CardHeader className="text-center">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-0"
            >
              <div className="">
                <Image
                  src="/images/logo.png"
                  height={100}
                  width={300}
                  alt="Logo Loading..."
                  className="flex justify-center mx-auto"
                />
                <span className="text-2xl font-bold text-blue-900">
                  Al-Quran Institute Online
                </span>
              </div>
            </Link>
            <CardTitle className="text-2xl text-blue-900">
              Join Us Now
            </CardTitle>
            <CardDescription className="text-blue-700">
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
                <Label className="text-blue-900">Register As</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Student', 'Teacher', 'Admin'].map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setSelectedRole(roleOption)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        selectedRole === roleOption
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="name" className="text-blue-900">
                    Full Name
                  </Label>
                  <div className="absolute inset-y-10 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className=" h-5 w-6 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="border-blue-200 focus:border-blue-400 pl-10   uppercase"
                  />
                </div>
                {selectedRole === 'Student' && (
                  <div>
                    <Label htmlFor="fatherName" className="text-blue-900">
                      Father Name
                    </Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="Father Name"
                      required
                      className="border-blue-200 focus:border-blue-400 uppercase"
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="email" className="text-blue-900">
                  Email
                </Label>
                <div className="absolute inset-y-11 left-0 flex items-center pl-3 pointer-events-none">
                  <MailIcon className=" h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="border-blue-200 focus:border-blue-400 pl-10"
                />
              </div>
              {/* Role-Specific Fields */}
              {selectedRole === 'Student' && (
                <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4">
                  <div className="w-full mx-auto">
                    <Label htmlFor="gender" className="text-blue-900">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <PhoneNumberInput />
                  </div>
                  <div>
                    <Label htmlFor="suitableTime" className="text-blue-900">
                      Suitable Class Timing (Pakistan Time)
                    </Label>
                    <Select name="suitableTime" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
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
                  <div>
                    <Label htmlFor="dob" className="text-blue-900">Date of Birth</Label>
                    <Calendar22 date={date} onChange={setDate} />
                    {date && (
                      <p className="text-blue-700 mt-1">
                        Your Age: {dobtoage(date)} years
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="app" className="text-blue-900">
                      Class Application
                    </Label>
                    <Select name="app" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
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
                  <div>
                    <Label htmlFor="course" className="text-blue-900">
                      Course
                    </Label>
                    <Select name="course" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
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
                  <div>
                    <Label htmlFor="classDays" className="text-blue-900">
                      Class Days
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center gap-2 text-blue-800">
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
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <Label className="text-blue-900">Upload Photo</Label>
                    <input type="file" onChange={handleUploadImage} />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={160}
                        height={160}
                        className="w-40 h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedRole === 'Teacher' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender" className="text-blue-900">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <PhoneNumberInput />
                  </div>
                  <div>
                    <Label htmlFor="qualification" className="text-blue-900">
                      Qualification
                    </Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      placeholder="e.g., Alim, Hafiz, Master's in Islamic Studies"
                      required
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="text-blue-900">
                      Teaching Experience (Years)
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      placeholder="e.g., 5"
                      required
                      min="0"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="expertise" className="text-blue-900">
                      Areas of Expertise
                    </Label>
                    <Input
                      id="expertise"
                      name="expertise"
                      placeholder="e.g., Tajweed, Hifz, Arabic Language"
                      required
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bio" className="text-blue-900">
                      Brief Bio (Optional)
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      placeholder="Tell us about yourself and your teaching philosophy..."
                      className="w-full border border-blue-200 rounded-md p-2 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <Label className="text-blue-900">Upload Photo</Label>
                    <input type="file" onChange={handleUploadImage} />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={160}
                        height={160}
                        className="w-40 h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedRole === 'Admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender" className="text-blue-900">
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <PhoneNumberInput />
                  </div>
                  <div className="col-span-2">
                    <CountryCitySelector
                      onCountryChange={setSelectedCountry}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <Label className="text-blue-900">Upload Photo</Label>
                    <input type="file" onChange={handleUploadImage} />
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={160}
                        height={160}
                        className="w-40 h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="col-span-2 bg-orange-50 border border-orange-200 p-4 rounded-md">
                    <p className="text-orange-800 text-sm">
                      <strong>Note:</strong> The first Admin registration is automatically approved. Subsequent admin accounts require approval from existing administrators.
                    </p>
                  </div>
                </div>
              )}

              <div className="relative">
                <Label htmlFor="password" className="text-red-700 ">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className=" border-blue-200 focus:border-pink-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-sm text-blue-500"
                >
                  {/* {showPassword ? "Hide" : "Show"} */}
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={uploading || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Creating Account...
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


            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-blue-700 text-sm">
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
                  className="bg-white text-blue-500 mx-0 p-0 font-bold hover:bg-white hover:text-black"
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
