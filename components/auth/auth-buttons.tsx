"use client";

import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./login-modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { AppRoutes } from "@/app/constant/constant.js";

interface AuthButtonsProps {
  className?: string;
  variant?: "default" | "mobile";
  isScrolled?: boolean;
  preFilledEmail?: string;
}

export default function AuthButtons({
  className,
  variant = "default",
  isScrolled,
  preFilledEmail,
}: AuthButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signup, setSignup] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        } else {
          const response = await axios.get(AppRoutes.getCurrentUser, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response?.data?.data);
        }
      } catch (error) {}
    };
    getCurrentUserInfo();
  }, []);

  // Check for login query parameter and pre-filled email
  useEffect(() => {
    const showLogin = searchParams.get("showLogin");
    const email = searchParams.get("email");

    if (showLogin === "true" && email) {
      setLoginOpen(true);
      // Clear the URL parameters to prevent reopening on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("showLogin");
      url.searchParams.delete("email");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const openLoginModal = () => {
    setSignup(false);
    setLoginOpen(true);
  };

  const openSignupModal = () => {
    setLoginOpen(false);
    setSignup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const baseClass = isScrolled ? "text-gray-900" : "text-white";

  const emailToPreFill = preFilledEmail || searchParams.get("email") || "";

  if (user) {
    const profileImg =
      user.avatar || user.profileImage || user.image || undefined;
    const userName = user.name || user.email;
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar>
          <AvatarImage src={profileImg} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="bg-white text-primary-600 hover:bg-primary-50"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        <Button variant="outline" className="w-full" onClick={openLoginModal}>
          Login
        </Button>
        <Link
          href="/signup"
          className="w-full bg-accent-500 hover:bg-accent-600 text-blue-900 border-blue-900"
        >
          Register
        </Link>

        <LoginModal
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onRegisterClick={openSignupModal}
          preFilledEmail={emailToPreFill}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="outline"
        className="bg-white text-primary-600 hover:bg-primary-50"
        onClick={openLoginModal}
      >
        Login
      </Button>
      <Link href="/signup" className="w-full bg-accent-500 hover:bg-accent-600">
        Register
      </Link>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onRegisterClick={openSignupModal}
        preFilledEmail={emailToPreFill}
      />
    </div>
  );
}
