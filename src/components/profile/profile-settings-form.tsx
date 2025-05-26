"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  displayName: string;
  email: string;
  emailChangePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  theme: string;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  emailChangePassword?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const themeOptions = [
  { value: "blue", name: "Blue", color: "bg-blue-600" },
  { value: "green", name: "Green", color: "bg-green-600" },
  { value: "purple", name: "Purple", color: "bg-purple-600" },
  { value: "red", name: "Red", color: "bg-red-600" },
  { value: "orange", name: "Orange", color: "bg-orange-600" },
  { value: "indigo", name: "Indigo", color: "bg-indigo-600" },
];

export function ProfileSettingsForm() {
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    email: "",
    emailChangePassword: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    theme: "blue",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName || user.fullName,
        email: user.email,
        theme: user.theme || "blue",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear success message when making changes
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate display name
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters long";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // If email is being changed, require password
    if (formData.email.toLowerCase() !== user?.email.toLowerCase()) {
      if (!formData.emailChangePassword) {
        newErrors.emailChangePassword =
          "Password is required to change email address";
      }
    }

    // Validate password fields only if user is trying to change password
    const isPasswordChange = formData.newPassword.trim() !== "";
    if (isPasswordChange) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters long";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(
          formData.newPassword
        )
      ) {
        newErrors.newPassword =
          "Password must contain uppercase, lowercase, and number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const updateData: any = {
        displayName: formData.displayName.trim(),
        email: formData.email.toLowerCase().trim(),
        theme: formData.theme,
      };

      // Include email change password if email is being changed
      if (formData.email.toLowerCase() !== user?.email.toLowerCase()) {
        updateData.emailChangePassword = formData.emailChangePassword;
      }

      // Include password fields if user is changing password
      if (formData.newPassword.trim() !== "") {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      console.log("Sending update data:", {
        ...updateData,
        emailChangePassword: updateData.emailChangePassword
          ? "[HIDDEN]"
          : undefined,
        currentPassword: updateData.currentPassword ? "[HIDDEN]" : undefined,
        newPassword: updateData.newPassword ? "[HIDDEN]" : undefined,
      });

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log("Update response:", data);

      if (data.success) {
        setSuccessMessage(data.message);

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          emailChangePassword: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // Refresh user data to get the latest information
        await refreshUser();

        // If theme was changed, refresh the page to apply new theme
        if (updateData.theme !== user?.theme) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Unable to load user data</p>
      </div>
    );
  }

  const isEmailChanged =
    formData.email.toLowerCase() !== user.email.toLowerCase();

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="p-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
            {successMessage}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                error={errors.displayName}
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
              />
              {isEmailChanged && (
                <p className="mt-1 text-xs text-orange-600">
                  ⚠️ Changing your email will require verification
                </p>
              )}
            </div>
          </div>

          {/* Email Change Password Field */}
          {isEmailChanged && (
            <div className="mt-4">
              <label
                htmlFor="emailChangePassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password for Email Change
              </label>
              <Input
                id="emailChangePassword"
                name="emailChangePassword"
                type="password"
                value={formData.emailChangePassword}
                onChange={handleInputChange}
                error={errors.emailChangePassword}
                placeholder="Enter your current password to confirm email change"
              />
              <p className="mt-1 text-xs text-gray-500">
                For security, we need your password to change your email address
              </p>
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Theme Preference
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Current theme:{" "}
            <span className="font-medium capitalize">
              {user.theme || "blue"}
            </span>
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {themeOptions.map((theme) => (
              <label
                key={theme.value}
                className={`relative cursor-pointer rounded-lg p-3 flex flex-col items-center space-y-2 border-2 transition-colors ${
                  formData.theme === theme.value
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.value}
                  checked={formData.theme === theme.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full ${theme.color}`}></div>
                <span className="text-xs font-medium text-gray-900">
                  {theme.name}
                </span>
                {formData.theme === theme.value && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Change Password
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Leave password fields empty if you don't want to change your
            password
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword}
                placeholder="Enter your current password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  error={errors.newPassword}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" loading={isLoading} className="px-8">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
