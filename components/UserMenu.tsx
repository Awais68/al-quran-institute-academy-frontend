"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const profileImg =
    user?.avatar || user?.profileImage || user?.image || undefined;
  const userName = user?.name || user?.email || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <Avatar>
        <AvatarImage src={profileImg} alt={userName} />
        <AvatarFallback>{userName[0]}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-gray-800">{userName}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow text-sm ml-2"
      >
        Logout
      </button>
    </div>
  );
}
