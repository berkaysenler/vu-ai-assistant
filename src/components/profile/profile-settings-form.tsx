// src/components/profile/profile-settings-form.tsx (FIXED - Immediate updates without refresh)
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { useTheme } from "@/lib/context/theme-context";
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
  {
    value: "blue",
    name: "Blue",
    color: "bg-blue-500",
    darkColor: "bg-blue-400",
  },
  {
    value: "green",
    name: "Green",
    color: "bg-green-500",
    darkColor: "bg-green-400",
  },
  {
    value: "purple",
    name: "Purple",
    color: "bg-purple-500",
    darkColor: "bg-purple-400",
  },
  { value: "red", name: "Red", color: "bg-red-500", darkColor: "bg-red-400" },
  {
    value: "orange",
    name: "Orange",
    color: "bg-orange-500",
    darkColor: "bg-orange-400",
  },
  {
    value: "indigo",
    name: "Indigo",
    color: "bg-indigo-500",
    darkColor: "bg-indigo-400",
  },
];

export function ProfileSettingsForm() {
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const {
    getThemeClasses,
    isDark,
    colorTheme,
    darkMode,
    setColorTheme,
    setDarkMode,
  } = useTheme();
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

  const themeClasses = getThemeClasses();

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

  // FIXED: Handle theme change immediately without page refresh
  const handleThemeChange = (newTheme: string) => {
    setFormData((prev) => ({ ...prev, theme: newTheme }));
    // Apply theme immediately in the UI
    setColorTheme(newTheme as any);
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

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

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

        // FIXED: Force refresh user data and wait for it to complete
        console.log("Profile updated successfully, refreshing user data...");
        await refreshUser();
        console.log("User data refresh completed");

        // Force a small delay to ensure state propagation
        setTimeout(() => {
          console.log("Updated user:", user);
        }, 100);
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
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${themeClasses.primary.replace("bg-", "border-")}`}
        ></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className={`${themeClasses.error}`}>Unable to load user data</p>
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
          <div
            className={`p-4 text-sm ${themeClasses.successLight} border rounded-md`}
          >
            {successMessage}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div
            className={`p-4 text-sm ${themeClasses.errorLight} border border-red-200 dark:border-red-800/30 rounded-md`}
          >
            {errors.general}
          </div>
        )}

        {/* Personal Information Section */}
        <div className={`${themeClasses.card} p-6 rounded-lg border`}>
          <h3 className={`text-lg font-medium ${themeClasses.text} mb-4`}>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="displayName"
                className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
                className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
                <p className={`mt-1 text-xs ${themeClasses.warning}`}>
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
                className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
              <p className={`mt-1 text-xs ${themeClasses.textMuted}`}>
                For security, we need your password to change your email address
              </p>
            </div>
          )}
        </div>

        {/* Theme & Appearance Section */}
        <div className={`${themeClasses.card} p-6 rounded-lg border`}>
          <h3 className={`text-lg font-medium ${themeClasses.text} mb-4`}>
            Theme & Appearance
          </h3>

          {/* Current Theme Info */}
          <div
            className={`${themeClasses.backgroundSecondary} p-4 rounded-lg mb-4`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 ${isDark ? themeOptions.find((t) => t.value === colorTheme)?.darkColor : themeOptions.find((t) => t.value === colorTheme)?.color} rounded-full`}
              ></div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text}`}>
                  Current:{" "}
                  {themeOptions.find((t) => t.value === colorTheme)?.name} •{" "}
                  {isDark ? "Dark" : "Light"}
                </p>
                <p className={`text-xs ${themeClasses.textMuted}`}>
                  Theme changes apply immediately
                </p>
              </div>
            </div>
          </div>

          {/* Color Theme Selection */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-3`}
            >
              Color Theme
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {themeOptions.map((theme) => (
                <label
                  key={theme.value}
                  className={`relative cursor-pointer rounded-lg p-3 flex flex-col items-center space-y-2 border-2 transition-colors ${
                    formData.theme === theme.value
                      ? `${themeClasses.primaryBorder} ${themeClasses.primaryLight}`
                      : `${themeClasses.border} ${themeClasses.hover}`
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={formData.theme === theme.value}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full ${isDark ? theme.darkColor : theme.color} shadow-sm`}
                  ></div>
                  <span className={`text-xs font-medium ${themeClasses.text}`}>
                    {theme.name}
                  </span>
                  {formData.theme === theme.value && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
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

          {/* Dark Mode Selection */}
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-3`}
            >
              Brightness Mode
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "light",
                  name: "Light",
                  icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
                },
                {
                  value: "dark",
                  name: "Dark",
                  icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
                },
                {
                  value: "system",
                  name: "System",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    darkMode === mode.value
                      ? `${themeClasses.primaryLight} ${themeClasses.primaryText} font-medium`
                      : `${themeClasses.hover}`
                  }`}
                >
                  <input
                    type="radio"
                    name="darkMode"
                    value={mode.value}
                    checked={darkMode === mode.value}
                    onChange={(e) => setDarkMode(e.target.value as any)}
                    className="sr-only"
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={mode.icon}
                    />
                  </svg>
                  <span className={`text-sm ${themeClasses.text}`}>
                    {mode.name}
                  </span>
                  {darkMode === mode.value && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className={`${themeClasses.card} p-6 rounded-lg border`}>
          <h3 className={`text-lg font-medium ${themeClasses.text} mb-4`}>
            Change Password
          </h3>
          <p className={`text-sm ${themeClasses.textMuted} mb-4`}>
            Leave password fields empty if you don't want to change your
            password
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
                  className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
                  className={`block text-sm font-medium ${themeClasses.text} mb-1`}
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
