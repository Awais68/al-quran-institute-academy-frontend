"use client";

import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./login-modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/lib/api";
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
    // The AuthContext handles user info retrieval automatically
    // No need to manually fetch user data here
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

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookie
      await apiClient.post('/auth/logout'); // Assuming there's a logout endpoint
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side state and token
      localStorage.removeItem('token');
      setUser(null);
      router.replace("/");
    }
  };

  const handleProfileClick = () => {
    if (user?.role === 'Teacher') {
      router.push('/teacher');
    } else if (user?.role === 'Student') {
      router.push('/students');
    } else if (user?.role === 'Admin') {
      router.push('/currentUser');
    }
  };

  const baseClass = isScrolled ? "text-gray-900" : "text-white";

  const emailToPreFill = preFilledEmail || searchParams.get("email") || "";

  if (user) {
    const profileImg =
      user.avatar || user.profileImage || user.image || undefined;
    const userName = user?.name || user?.email || "U";
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div 
          onClick={handleProfileClick}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Avatar>
            <AvatarImage src={profileImg} alt={userName} />
            <AvatarFallback>
              {userName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
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
        {/* <Button variant="outline" className="w-full" onClick={openLoginModal}>
          Login
        </Button> */}
        <Button
          variant="outline"
          className="
    w-full
    bg-blue-300/50
    text-black
    backdrop-blur-sm
    shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]
    border border-black/30
    hover:bg-blue-500 hover:text-white
    transition
  " onClick={openLoginModal}
        >
          Login
        </Button>
        <Link href="/signup" className="w-full border-black hover:bg-primary-50">
          {/* <Button variant="outline" className=" w-full bg-black text-white">Register</Button> */}
          {/* Register */}
          <Button
            variant="outline"
            className="
    w-full
    bg-blue-300/70
    text-black
    backdrop-blur-sm
    shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]
    border border-black/30
    hover:bg-blue-600 hover:text-white
    transition
  "
          >
            Register
          </Button>

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
      <Link href="/signup" className="w-full border-black ">
        <Button variant="outline" className="bg-white text-primary-600 hover:bg-primary-50">Register</Button>
        {/* Register */}
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
