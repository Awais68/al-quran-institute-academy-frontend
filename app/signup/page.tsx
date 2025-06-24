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
import {
  CalendarIcon,
  CalendarRangeIcon,
  EyeIcon,
  EyeOffIcon,
  LucideLetterText,
  MailIcon,
  Moon,
  Star,
  UserIcon,
} from "lucide-react";
// import { IslamicBackground } from "@/components/islamic-background";
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar28 } from "@/components/datepicker";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UploadImage from "@/components/UploadingImage";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick: () => void;
}

export default function Signup({
  open,

  onOpenChange,
  onLoginClick,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  //  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [date, setDate] = useState();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      fatherName: e.target.fatherName.value,
      email: e.target.email.value,
      gender: e.target.gender.value,
      phone: e.target.phone.value,
      // dob: e.target.dob.value,
      app: e.target.app.value,
      suitableTime: e.target.suitableTime.value,
      course: e.target.course.value,
      city: e.target.city.value,
      country: e.target.country.value,
      password: e.target.password.value,
      image: e.target.image.value,

      //   role: "student",
    };
    console.log("data==>>>", data);

    try {
      const response = await axios.post(AppRoutes.signup, data);

      console.log("Signup URL ===>", AppRoutes.signup);

      console.log(response);
      if (response.status === 200 || response.status === 201) {
        router.push("/students");
      }
    } catch (err: any) {
      console.log("api error==>", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* <IslamicBackground /> */}
      <div className="relative z-2 min-h-screen flex items-center justify-center px-4 py-0">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm border-blue-200/50 md:max-w-[70%]">
          <CardHeader className="text-center">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-0"
            >
              <div className="">
                <img
                  src="/images/logo.png"
                  height={100}
                  width={300}
                  alt="Logo Loading..."
                  className="flex justify-center mx-auto  "
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="border-blue-200 focus:border-blue-400 pl-10"
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName" className="text-blue-900">
                    Father Name
                  </Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    placeholder="Father Name"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
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
              <div className="grid grid-cols-1  w-full  md:grid-cols-2 gap-4 ">
                <div className="w-full mx-auto ">
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
                  <Label htmlFor="phone" className="text-blue-900">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="border-blue-200 focus:border-blue-400 mx-auto"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-blue-900">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    //   type="string"
                    placeholder="New York"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-blue-900">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    //   type="string"
                    placeholder="United State"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <Label htmlFor="dob" className="text-blue-900">
                    Date of Birth
                  </Label>

                  
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
                      <SelectItem value="whatsApp">WhatsApp</SelectItem>
                      <SelectItem value="teams">Teams</SelectItem>
                      <SelectItem value="googleMeet">Google Meet</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="suitableTime" className="text-blue-900">
                    Suitable Timing For Student
                  </Label>
                  <Select name="suitableTime" required>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select Your Timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1200">12:00AM</SelectItem>
                      <SelectItem value="1230">12:30AM</SelectItem>
                      <SelectItem value="0100">01:00AM</SelectItem>
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
                      <SelectItem value="qaida">
                        Basic Rules of Qaida Course
                      </SelectItem>
                      <SelectItem value="tajweed">Tajweed</SelectItem>
                      <SelectItem value="nazra">Nazra Quran</SelectItem>
                      <SelectItem value="hifz">Hifz zul Quran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <UploadImage/>

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

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-blue-700">
                  I agree to the{" "}
                  <Link href=" " className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Account
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-blue-700 text-sm">
                Already have an account?{" "}
                <Link
                  href=""
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
