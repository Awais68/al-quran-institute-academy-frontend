import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, BookOpen, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <div className="bg-black">
      <Sidebar className="bg-black border-r border-gray-800">
        <SidebarHeader className="bg-black border-b border-gray-800">
          <div className="flex h-[60px] items-center px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img src="/images/logo.png" alt="Logo" className="h-6 w-8" />
              <span className="font-bold text-white">Admin Dashboard</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-black">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Link href="/teacher" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teacher
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Link href="/#courses" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-black border-t border-gray-800">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
