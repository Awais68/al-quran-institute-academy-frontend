"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, Lock, Image as ImageIcon, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";

// Same rule the backend enforces, so the user sees the problem on the field
// instead of a 400 a second later.
const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type PasswordFieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type ProfileFieldErrors = {
  name?: string;
  phone?: string;
};

interface SettingsTabProps {
  user: any;
  onUpdate: () => void;
}

export default function SettingsTab({ user, onUpdate }: SettingsTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Field-level errors: a toast tells you *that* something is wrong, the red
  // field tells you *which* one.
  const [passwordErrors, setPasswordErrors] = useState<PasswordFieldErrors>({});
  const [profileErrors, setProfileErrors] = useState<ProfileFieldErrors>({});

  const invalid = (hasError?: string) =>
    hasError && "border-red-500 focus-visible:ring-red-500";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: ProfileFieldErrors = {};
    if (!profileData.name.trim()) nextErrors.name = "Name is required";
    if (profileData.phone && !/^\d{10,15}$/.test(profileData.phone.replace(/\D/g, "")))
      nextErrors.phone = "Enter a valid phone number (10 to 15 digits)";

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      await apiClient.put('/user/updateUser', profileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: getErrorMessage(error, {
          endpoint: "/user",
          fallback: "Failed to update profile",
        }),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: PasswordFieldErrors = {};
    if (!passwordData.currentPassword)
      nextErrors.currentPassword = "Enter your current password";
    if (!PASSWORD_RULE.test(passwordData.newPassword))
      nextErrors.newPassword =
        "Must be 8+ characters with uppercase, lowercase, number and special character";
    else if (passwordData.newPassword === passwordData.currentPassword)
      nextErrors.newPassword =
        "The new password must be different from the current one";
    if (passwordData.confirmPassword !== passwordData.newPassword)
      nextErrors.confirmPassword = "New passwords do not match";

    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      await apiClient.put('/user/changePassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error: any) {
      toast({
        title: "Error",
        description: getErrorMessage(error, {
          endpoint: "/user",
          fallback: "Failed to change password",
        }),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.role}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => {
                        setProfileData({...profileData, name: e.target.value});
                        setProfileErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Enter your name"
                      aria-invalid={Boolean(profileErrors.name)}
                      className={cn(invalid(profileErrors.name))}
                    />
                    {profileErrors.name && (
                      <p className="text-xs font-medium text-red-600">{profileErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => {
                        setProfileData({...profileData, phone: e.target.value});
                        setProfileErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Enter phone number"
                      aria-invalid={Boolean(profileErrors.phone)}
                      className={cn(invalid(profileErrors.phone))}
                    />
                    {profileErrors.phone && (
                      <p className="text-xs font-medium text-red-600">{profileErrors.phone}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, currentPassword: e.target.value});
                      setPasswordErrors((prev) => ({ ...prev, currentPassword: undefined }));
                    }}
                    placeholder="Enter current password"
                    required
                    aria-invalid={Boolean(passwordErrors.currentPassword)}
                    className={cn(invalid(passwordErrors.currentPassword))}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs font-medium text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, newPassword: e.target.value});
                      setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }}
                    placeholder="Enter new password"
                    required
                    aria-invalid={Boolean(passwordErrors.newPassword)}
                    className={cn(invalid(passwordErrors.newPassword))}
                  />
                  {passwordErrors.newPassword ? (
                    <p className="text-xs font-medium text-red-600">{passwordErrors.newPassword}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Must contain 8+ characters with uppercase, lowercase, number and special character
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, confirmPassword: e.target.value});
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="Confirm new password"
                    required
                    aria-invalid={Boolean(passwordErrors.confirmPassword)}
                    className={cn(invalid(passwordErrors.confirmPassword))}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs font-medium text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="text-4xl">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload New Image
                </Button>
                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
