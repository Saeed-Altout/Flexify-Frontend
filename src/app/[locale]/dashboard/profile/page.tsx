"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCurrentUserQuery,
  useChangePasswordMutation,
} from "@/modules/auth/auth-hook";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/modules/users/users-hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/inputs/password-input";
import { EmailInput } from "@/components/inputs/email-input";
import { User, Mail, Phone, Shield, Upload, Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValidationsSchema } from "@/hooks/use-validations-schema";
import type { IUpdateProfileRequest } from "@/modules/users/users-type";
import type { IChangePasswordRequest } from "@/modules/auth/auth-type";
import { OverviewTab } from "./_components/overview-tab";
import { useAuthStore } from "@/stores/use-auth-store";
import { EditProfileTab } from "./_components/edit-profile-tab";
import { ChangePasswordTab } from "./_components/change-password-tab";

export default function ProfilePage() {
  const {
    user: storeUser,
    isLoading,
    isInitialized,
    setIsInitialized,
    setUser,
  } = useAuthStore();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfileMutation();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formInitializedRef = useRef<string | null>(null);
  const { email, password } = useValidationsSchema();

  console.log(storeUser);

  // Profile edit schema
  const profileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: email(),
    phone: z.string().optional(),
  });

  // Change password schema
  const changePasswordSchema = z
    .object({
      currentPassword: password(),
      newPassword: password(),
      confirmPassword: password(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: storeUser?.firstName || "",
      lastName: storeUser?.lastName || "",
      email: storeUser?.email || "",
      phone: storeUser?.phone || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (storeUser && storeUser?.id !== formInitializedRef.current) {
      profileForm.reset({
        firstName: storeUser?.firstName || "",
        lastName: storeUser?.lastName || "",
        email: storeUser?.email,
        phone: storeUser?.phone || "",
      });
      formInitializedRef.current = storeUser?.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUser?.id]);

  const handleProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    const updateData: IUpdateProfileRequest = {
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      email: values.email,
      phone: values.phone || undefined,
    };
    updateProfile(updateData, {
      onSuccess: () => {},
    });
  };

  const handlePasswordSubmit = (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    const passwordData: IChangePasswordRequest = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    changePassword(passwordData, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    uploadAvatar(file, {
      onSuccess: () => {
        setUser(storeUser);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized || !storeUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const first = storeUser?.firstName?.charAt(0) || "";
    const last = storeUser?.lastName?.charAt(0) || "";
    return first + last || storeUser?.email?.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your account information
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab user={storeUser} />
        </TabsContent>

        <TabsContent value="edit">
          <EditProfileTab user={storeUser} />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordTab />
        </TabsContent>

        <TabsContent value="avatar">
          <Card>
            <CardHeader>
              <CardTitle>Upload Avatar</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
