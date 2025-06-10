// src/app/auth/login/page.tsx (FIXED - Single loading spinner)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useTheme } from "@/lib/context/theme-context";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { getThemeClasses, isDark } = useTheme();

  const themeClasses = getThemeClasses();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log("Attempting login...");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        console.log("Login successful, redirecting...");
        router.push("/dashboard");
      } else {
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.backgroundSecondary} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      {/* Theme Selector - Top Right */}
      <div className="fixed top-6 right-6 z-10">
        <ThemeSelector />
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center p-3">
              <Image
                src="/vu-logo.png"
                alt="Victoria University Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl font-bold ${themeClasses.text} mb-2 tracking-tight`}
          >
            Welcome Back!
          </h1>
          <p className={`text-lg ${themeClasses.textMuted} mb-8`}>
            Sign in to your Victoria University Assistant
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`${themeClasses.background} py-8 px-6 shadow-xl rounded-2xl ${themeClasses.border} border transition-all duration-300`}
          style={{
            backgroundColor: isDark ? "rgb(31, 41, 55)" : "white",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.general && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    {errors.general}
                  </span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-semibold ${themeClasses.text} mb-2`}
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
                className="text-base py-3"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-semibold ${themeClasses.text} mb-2`}
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Enter your password"
                className="text-base py-3"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`h-4 w-4 ${themeClasses.primary.replace("bg-", "text-")} focus:ring-2 ${themeClasses.primaryFocus} border-gray-300 dark:border-gray-600 rounded transition-colors`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${themeClasses.text} select-none`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className={`${themeClasses.primaryText} hover:underline font-medium transition-colors`}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button - FIXED: Removed loading prop, using custom content only */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${themeClasses.textMuted}`}>
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className={`${themeClasses.primaryText} hover:underline font-semibold transition-colors`}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-xs ${themeClasses.textMuted}`}>
            © 2025 Victoria University Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
