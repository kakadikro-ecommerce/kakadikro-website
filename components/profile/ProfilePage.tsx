"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  getUserProfile,
  updateUserProfile as updateProfileApi,
  changePassword as changePasswordApi,
} from "@/redux/api/userApi";
import {
  setUser,
  updateUserProfile,
  logoutUser,
} from "@/redux/slice/userSlice";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/lib/validations/profile";
import { showAlert } from "@/components/ui/alert";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser?.name || "",
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: UpdateProfileInput) => {
    setLoadingProfile(true);
    try {
      await updateProfileApi(data);
      dispatch(updateUserProfile({ name: data.name }));
      showAlert({ type: "success", message: "Profile updated" });
    } catch {
      showAlert({ type: "error", message: "Update failed" });
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    console.log("🔥 SUBMIT CLICKED");
    console.log("FORM DATA:", data);

    if (!currentUser?._id) {
      console.log("❌ No user ID");
      return;
    }

    setLoadingPassword(true);
    try {
      await changePasswordApi(currentUser._id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showAlert({ type: "success", message: "Password updated" });
      reset();
    } catch {
      showAlert({ type: "error", message: "Password update failed" });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    router.push("/");
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const inputClassName =
    "w-full mt-1 px-3 py-2 text-sm rounded-md border bg-white transition-all duration-200 outline-none " +
    "hover:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:border-orange-400";

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#f1e5dc] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              User Profile
            </h2>
            <h2 className="text-sm font-semibold text-gray-900">
              {currentUser.name}
            </h2>
            <p className="text-sm text-gray-900">{currentUser.email}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
              {currentUser.isActive !== false ? "Active" : "Inactive"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm bg-[var(--brand-brown)] text-white px-4 py-1.5 rounded-md hover:rounded-2xl transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <form
            onSubmit={handleProfile(onProfileSubmit)}
            className="bg-white rounded-2xl p-6 shadow-md border border-[#f1e5dc] space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Update Profile
            </h2>

            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                {...regProfile("name")}
                placeholder="Enter your full name"
                className={`${inputClassName} ${profileErrors.name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-orange-100"
                  }`}
              />
              {profileErrors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {profileErrors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={currentUser.email}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="bg-[var(--brand-brown)] text-white px-4 py-2 text-sm rounded-md hover:rounded-2xl transition"
            >
              {loadingProfile ? "Saving..." : "Save"}
            </button>
          </form>

          <form
            onSubmit={handlePwd(
              onPasswordSubmit,
              (errors) => {
                console.log("❌ VALIDATION ERRORS:", errors);
              }
            )}
            className="bg-white rounded-2xl p-6 shadow-md border border-[#f1e5dc] space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>

            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  {...regPwd("currentPassword")}
                  placeholder="Enter current password"
                  className={`${inputClassName} pr-10 ${pwdErrors.currentPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-orange-100"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-3.5 text-gray-500"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwdErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {pwdErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  {...regPwd("newPassword")}
                  placeholder="Enter new password"
                  className={`${inputClassName} pr-10 ${pwdErrors.newPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-orange-100"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-3.5 text-gray-500"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwdErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {pwdErrors.newPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="bg-[var(--brand-brown)] text-white px-4 py-2 text-sm rounded-md hover:rounded-2xl transition"
            >
              {loadingPassword ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}