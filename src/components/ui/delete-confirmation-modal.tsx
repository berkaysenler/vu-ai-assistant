// src/components/ui/delete-confirmation-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/context/theme-context";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string; // What's being deleted
  confirmText?: string;
  isLoading?: boolean;
  requiresTyping?: boolean; // If true, user must type the item name
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmText = "Delete",
  isLoading = false,
  requiresTyping = false,
}: DeleteConfirmationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [typedText, setTypedText] = useState("");
  const { getThemeClasses } = useTheme();

  const themeClasses = getThemeClasses();

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
    if (isLoading) return; // Don't allow closing while loading

    setIsAnimating(false);
    setTypedText("");
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    if (requiresTyping && itemName && typedText !== itemName) {
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
    if (e.key === "Enter" && canConfirm && !isLoading) {
      handleConfirm();
    }
  };

  const canConfirm = requiresTyping && itemName ? typedText === itemName : true;

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
        className={`w-full max-w-md ${themeClasses.background} rounded-xl shadow-2xl transform transition-all duration-200 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 ${themeClasses.borderLight} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Danger Icon */}
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
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
              </div>
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
                {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`p-1 rounded-full ${themeClasses.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                className={`w-5 h-5 ${themeClasses.textMuted}`}
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
          <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
            {description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  This action cannot be undone
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {itemName
                    ? `"${itemName}" will be permanently deleted.`
                    : "This will permanently delete the selected item."}
                </p>
              </div>
            </div>
          </div>

          {/* Typing Confirmation */}
          {requiresTyping && itemName && (
            <div className="space-y-3">
              <p className={`text-sm ${themeClasses.text}`}>
                To confirm, please type{" "}
                <span className="font-mono font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-red-600 dark:text-red-400">
                  "{itemName}"
                </span>{" "}
                below:
              </p>
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                className={`w-full px-3 py-2 ${themeClasses.border} border rounded-md ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={`Type "${itemName}" here`}
                disabled={isLoading}
                autoFocus
              />
              {typedText && typedText !== itemName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please type exactly: "{itemName}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`px-6 py-4 ${themeClasses.backgroundSecondary} rounded-b-xl flex space-x-3`}
        >
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium ${themeClasses.textSecondary} ${themeClasses.border} border rounded-lg ${themeClasses.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
            <span>{isLoading ? "Deleting..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
