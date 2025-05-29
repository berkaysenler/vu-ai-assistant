// src/components/ui/confirmation-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  requiresTyping?: string; // If provided, user must type this exact text to confirm
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  requiresTyping,
  isLoading = false,
}: ConfirmationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTypedText("");
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTypedText("");
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    if (requiresTyping && typedText !== requiresTyping) {
      return; // Don't confirm if typing requirement isn't met
    }
    onConfirm();
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
    if (e.key === "Enter" && !requiresTyping && !isLoading) {
      handleConfirm();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          headerBg: "bg-red-600",
          icon: (
            <svg
              className="w-6 h-6 text-white"
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
          ),
          confirmBg: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          headerBg: "bg-orange-600",
          icon: (
            <svg
              className="w-6 h-6 text-white"
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
          ),
          confirmBg: "bg-orange-600 hover:bg-orange-700",
        };
      default: // info
        return {
          headerBg: "bg-blue-600",
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          confirmBg: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const typeStyles = getTypeStyles();
  const canConfirm = !requiresTyping || typedText === requiresTyping;

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
        <div
          className={`${typeStyles.headerBg} px-6 py-4 rounded-t-xl flex items-center space-x-3`}
        >
          {typeStyles.icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4 leading-relaxed">{message}</p>

          {/* Typing confirmation if required */}
          {requiresTyping && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                To confirm, please type <strong>"{requiresTyping}"</strong>{" "}
                below:
              </p>
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Type "${requiresTyping}" here`}
                disabled={isLoading}
                autoFocus
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${typeStyles.confirmBg} flex items-center justify-center space-x-2`}
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
              <span>{isLoading ? "Processing..." : confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
