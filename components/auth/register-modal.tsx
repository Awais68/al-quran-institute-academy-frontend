// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface RegisterModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onLoginClick: () => void
// }

// export default function RegisterModal({ open, onOpenChange, onLoginClick }: RegisterModalProps) {
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [phone, setPhone] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState(false)


//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields")
//       return
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }

//     setIsLoading(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // Show success message
//       setSuccess(true)

//       // Reset form
//       setName("")
//       setEmail("")
//       setPassword("")
//       setConfirmPassword("")

//       // Close modal after 2 seconds
//       setTimeout(() => {
//         onOpenChange(false)
//         setSuccess(false)
//       }, 2000)
//     } catch (err) {
//       setError("Registration failed. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
//         <DialogHeader>
//           <DialogTitle className="text-center text-2xl font-bold text-primary-800">Create an Account</DialogTitle>
//         </DialogHeader>

//         {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

//         {success ? (
//           <div className="bg-green-50 text-green-600 p-4 rounded-md text-center">
//             <h3 className="font-medium text-lg mb-1">Registration Successful!</h3>
//             <p>Your account has been created.</p>
//           </div>
//         ) : (
//           <form onSubmit={handleRegister} className="space-y-4 pt-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <UserIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   id="name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Your full name"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="register-email">Email</Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <MailIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   id="register-email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your.email@example.com"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <MailIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   id="phone"
//                   type="number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="+92-335-220-4606"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="register-password">Password</Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <LockIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   id="register-password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="pl-10"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3"
//                 >
//                   {showPassword ? (
//                     <EyeOffIcon className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirm-password">Confirm Password</Label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <LockIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   id="confirm-password"
//                   type={showPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className={cn("w-full bg-primary-600 hover:bg-primary-700", isLoading && "opacity-70 cursor-not-allowed")}
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating Account..." : "Register"}
//             </Button>

//             <div className="text-center text-sm text-gray-500">
//               Already have an account?{" "}
//               <button
//                 type="button"
//                 onClick={onLoginClick}
//                 className="text-primary-600 hover:text-primary-800 font-medium"
//               >
//                 Login
//               </button>
//             </div>
//           </form>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
