"use client";
import { useContext } from "react";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const profileImg =
    user?.avatar || user?.profileImage || user?.image || undefined;
  const userName = user?.name || user?.email || "U";

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookie
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout error:', error);
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

  return (
    <div className="flex items-center gap-2 ml-auto">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors" 
        role="button" 
        aria-label="Go to profile"
        onClick={handleProfileClick}
      >
        <Avatar>
          <AvatarImage src={profileImg} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-800">
          {userName}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow text-sm ml-2"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
}
