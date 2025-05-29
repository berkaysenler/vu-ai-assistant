// src/components/ui/text-input-modal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./button";

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
      {/* Modal Content */}
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                maxLength={maxLength}
              />

              {/* Character count and error */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  {error ? (
                    <span className="text-red-600">{error}</span>
                  ) : (
                    <span className="text-gray-400">
                      {required && "Required"}
                    </span>
                  )}
                </div>
                <span className="text-gray-400">
                  {value.length}/{maxLength}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              loading={isLoading}
              className="flex-1"
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
