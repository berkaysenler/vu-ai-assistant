// src/components/profile/profile-overlay.tsx
"use client";

import { useState, useEffect } from "react";
import { ProfileSettingsForm } from "./profile-settings-form";

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function ProfileOverlay({
  isOpen,
  onClose,
  returnUrl,
}: ProfileOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll when overlay is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating
          ? "bg-black bg-opacity-50 backdrop-blur-sm"
          : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
    >
      {/* Overlay Content */}
      <div
        className={`w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        style={{
          maxHeight: "90vh",
          minHeight: "60vh",
        }}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Discord-style X button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
            title="Close profile settings"
          >
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors"
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

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 100px)" }}
        >
          <div className="p-6">
            <ProfileSettingsForm />
          </div>
        </div>
      </div>
    </div>
  );
}
