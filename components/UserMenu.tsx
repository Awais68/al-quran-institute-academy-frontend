"use client";
import { useContext } from "react";
import apiClient from "@/lib/api";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { CHANGE_PASSWORD_PATH } from "@/lib/api";
import { dashboardPathForRole } from "@/lib/dashboard-path";

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
    if (user?.role) router.push(dashboardPathForRole(user.role));
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
        onClick={() => router.push(CHANGE_PASSWORD_PATH)}
        className="hidden sm:inline text-sm font-medium text-primary-600 hover:text-primary-800"
      >
        Change password
      </button>
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
