"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegisterClick: () => void
}

export default function LoginModal({ open, onOpenChange, onRegisterClick }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just close the modal on success
      onOpenChange(false)

      // Reset form
      setEmail("")
      setPassword("")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary-800">Login to Madarsa Hajira</DialogTitle>
        </DialogHeader>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-primary-600 hover:text-primary-800">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={cn("w-full bg-primary-600 hover:bg-primary-700", isLoading && "opacity-70 cursor-not-allowed")}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Register
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
