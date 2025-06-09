// src/components/ui/text-input-modal.tsx (FIXED - Full theme integration)
"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/context/theme-context";

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  description?: string;
  placeholder?: string;
  initialValue?: string;
  submitText?: string;
  cancelText?: string;
  maxLength?: number;
  required?: boolean;
  validation?: (value: string) => string | null; // Returns error message or null if valid
  isLoading?: boolean;
}

export function TextInputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  placeholder = "",
  initialValue = "",
  submitText = "Save",
  cancelText = "Cancel",
  maxLength = 100,
  required = true,
  validation,
  isLoading = false,
}: TextInputModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // FIXED: Add theme integration
  const { getThemeClasses, isDark } = useTheme();
  const themeClasses = getThemeClasses();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setValue(initialValue);
      setError(null);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 200);
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialValue]);

  const handleClose = () => {
    if (isLoading) return; // Don't allow closing while loading

    setIsAnimating(false);
    setError(null);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedValue = value.trim();

    // Validate required
    if (required && !trimmedValue) {
      setError("This field is required");
      return;
    }

    // Custom validation
    if (validation) {
      const validationError = validation(trimmedValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Clear error and submit
    setError(null);
    onSubmit(trimmedValue);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    }
  };

  const canSubmit = !isLoading && (required ? value.trim().length > 0 : true);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isAnimating
          ? "bg-black bg-opacity-50 backdrop-blur-sm"
          : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* FIXED: Modal Content with proper theme styling */}
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-200 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        style={{
          // FIXED: Ensure solid background in dark mode
          backgroundColor: isDark ? "rgb(31, 41, 55)" : "white",
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* FIXED: Header with theme colors */}
        <div className={`px-6 py-4 ${themeClasses.borderLight} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div
                className={`w-10 h-10 ${themeClasses.primaryLight} rounded-full flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${themeClasses.primaryText}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
                  {title}
                </h3>
                {description && (
                  <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* FIXED: Close button with theme colors */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`p-2 rounded-full ${themeClasses.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed group`}
              title="Close"
            >
              <svg
                className={`w-5 h-5 ${themeClasses.textMuted} group-hover:${themeClasses.text} transition-colors`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* FIXED: Content with theme styling */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-3">
              {/* FIXED: Input with theme colors */}
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={isLoading}
                className={`w-full px-4 py-3 ${themeClasses.border} border rounded-lg transition-colors text-base font-medium ${
                  error
                    ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                    : `${themeClasses.primaryFocus}`
                } disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.background} ${themeClasses.text} placeholder:${themeClasses.textMuted}`}
                style={{
                  // FIXED: Ensure solid background for input in dark mode
                  backgroundColor: isDark ? "rgb(55, 65, 81)" : "white",
                }}
                maxLength={maxLength}
              />

              {/* FIXED: Character count and error with theme colors */}
              <div className="flex justify-between items-center text-sm">
                <div>
                  {error ? (
                    <span className={`${themeClasses.error} font-medium`}>
                      ⚠️ {error}
                    </span>
                  ) : (
                    <span className={themeClasses.textMuted}>
                      {required && "Required field"}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    value.length > maxLength * 0.9
                      ? "text-orange-500 dark:text-orange-400"
                      : themeClasses.textMuted
                  }`}
                >
                  {value.length}/{maxLength}
                </span>
              </div>
            </div>
          </div>

          {/* FIXED: Action Buttons with theme colors */}
          <div
            className={`px-6 py-4 rounded-b-xl flex space-x-3`}
            style={{
              // FIXED: Ensure solid background for footer in dark mode
              backgroundColor: isDark
                ? "rgb(55, 65, 81)"
                : "rgb(249, 250, 251)",
            }}
          >
            {/* FIXED: Cancel Button with theme styling */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 text-base font-medium ${themeClasses.textSecondary} ${themeClasses.border} border rounded-lg ${themeClasses.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {cancelText}
            </button>

            {/* FIXED: Submit Button with proper theme colors */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex-1 px-4 py-3 text-base font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${themeClasses.primary} ${themeClasses.primaryHover} ${themeClasses.primaryFocus}`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4"
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
              )}
              <span>{isLoading ? "Saving..." : submitText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
