"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LoginModal from "./login-modal"
import RegisterModal from "./register-modal"

interface AuthButtonsProps {
  className?: string
  variant?: "default" | "mobile"
  isScrolled?: boolean
}

export default function AuthButtons({ className, variant = "default", isScrolled }: AuthButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const openLoginModal = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  const openRegisterModal = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }
  const baseClass = isScrolled ? "text-gray-900" : "text-white"

  if (variant === "mobile") {
    
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        <Button variant="outline" className="w-full" onClick={openLoginModal}>
          Login
        </Button>
        <Button className="w-full bg-accent-500 hover:bg-accent-600" onClick={openRegisterModal}>
          Register
        </Button>

        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onRegisterClick={openRegisterModal} />
        <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} onLoginClick={openLoginModal} />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button variant="outline" className="bg-white text-primary-600 hover:bg-primary-50" onClick={openLoginModal}>
        Login
      </Button>
      <Button className="bg-accent-500 text-gray-300 hover:text-accent-700" onClick={openRegisterModal}>
        Register
      </Button>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onRegisterClick={openRegisterModal} />
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} onLoginClick={openLoginModal} />
    </div>
  )
}
