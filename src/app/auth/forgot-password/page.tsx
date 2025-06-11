// src/app/auth/forgot-password/page.tsx (UPDATED - Themed design with dark/light mode)
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useTheme } from "@/lib/context/theme-context";

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { getThemeClasses, isDark } = useTheme();

  const themeClasses = getThemeClasses();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear errors when user starts typing
    if (errors.email || errors.general) {
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={`min-h-screen ${themeClasses.backgroundSecondary} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
      >
        {/* Theme Selector - Top Right */}
        <div className="fixed top-6 right-6 z-10">
          <ThemeSelector />
        </div>

        {/* Success Content */}
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-3">
                <Image
                  src="/vu-logo.png"
                  alt="Victoria University Logo"
                  width={84}
                  height={84}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl font-bold ${themeClasses.text} mb-2 tracking-tight`}
            >
              Check Your Email
            </h1>
            <p className={`text-lg ${themeClasses.textMuted} mb-8`}>
              We've sent you a password reset link
            </p>
          </div>

          {/* Success Card */}
          <div
            className={`${themeClasses.background} py-8 px-6 shadow-xl rounded-2xl ${themeClasses.border} border transition-all duration-300`}
            style={{
              backgroundColor: isDark ? "rgb(31, 41, 55)" : "white",
              boxShadow: isDark
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <p className={`text-base ${themeClasses.text}`}>
                  We've sent a password reset link to{" "}
                  <span className={`font-semibold ${themeClasses.primaryText}`}>
                    {email}
                  </span>
                </p>
                <p className={`text-sm ${themeClasses.textMuted}`}>
                  If you don't see the email, check your spam folder. The link
                  will expire in 1 hour.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Link href="/auth/login" className="block">
                  <Button className="w-full py-3 text-base font-semibold">
                    Back to Login
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className={`w-full text-sm ${themeClasses.primaryText} hover:underline font-medium transition-colors py-2`}
                >
                  Try a different email address
                </button>
              </div>
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
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-3">
              <Image
                src="/vu-logo.png"
                alt="Victoria University Logo"
                width={84}
                height={84}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className={`text-3xl font-bold ${themeClasses.text} mb-2 tracking-tight`}
          >
            Forgot Password?
          </h1>
          <p className={`text-lg ${themeClasses.textMuted} mb-8`}>
            Enter your email to reset your password
          </p>
        </div>

        {/* Reset Form */}
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
                value={email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
                className="text-base py-3"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full py-3 ${themeClasses.primary} text-base font-semibold tracking-wide`}
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
                  Sending Reset Link...
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 text-center space-y-3">
            <p className={`text-sm ${themeClasses.textMuted}`}>
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className={`${themeClasses.primaryText} hover:underline font-semibold transition-colors`}
              >
                Sign in
              </Link>
            </p>
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
