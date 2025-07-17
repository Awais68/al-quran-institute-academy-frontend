"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./login-modal";
import Link from "next/link";

interface AuthButtonsProps {
  className?: string;
  variant?: "default" | "mobile";
  isScrolled?: boolean;
}

export default function AuthButtons({
  className,
  variant = "default",
  isScrolled,
}: AuthButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signup, setSignup] = useState(false);

  const openLoginModal = () => {
    setSignup(false);
    setLoginOpen(true);
  };

  const openSignupModal = () => {
    setLoginOpen(false);
    setSignup(true);
  };
  const baseClass = isScrolled ? "text-gray-900" : "text-white";

  if (variant === "mobile") {
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        <Button variant="outline" className="w-full" onClick={openLoginModal}>
          Login
        </Button>
        <Link
          href="/signup"
          className="w-full bg-accent-500 hover:bg-accent-600 text-white border-black"
        >
          Register
        </Link>

        <LoginModal
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onRegisterClick={openSignupModal}
         
          
        />
        {/* <data
          open={signup}
          onOpenChange={openSignupModal}
          onLoginClick={openLoginModal}
        /> */}
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
      />
      {/* <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onLoginClick={openLoginModal}
      /> */}
    </div>
  );
}
