// src/components/profile/profile-overlay.tsx (FIXED - Centered modal content)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/theme-context";
import { useChats } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";
import { ProfileSettingsForm } from "./profile-settings-form";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

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
  const { getThemeClasses, isDark } = useTheme();
  const { chats } = useChats();
  const { user } = useUser();
  const router = useRouter();

  // Delete chats modal state
  const [showDeleteChatsModal, setShowDeleteChatsModal] = useState(false);
  const [isDeletingChats, setIsDeletingChats] = useState(false);

  // Delete account modal state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const themeClasses = getThemeClasses();

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
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleDeleteAllChats = async () => {
    setIsDeletingChats(true);
    try {
      const response = await fetch("/api/user/delete-chats", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert("All chats deleted successfully!");
        window.location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Delete chats error:", error);
      alert("An error occurred while deleting chats");
    } finally {
      setIsDeletingChats(false);
      setShowDeleteChatsModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          confirmationText: "DELETE MY ACCOUNT",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          "Account deleted successfully. You will now be redirected to the login page."
        );
        router.push("/auth/login");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred while deleting your account");
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountModal(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isAnimating ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
        }`}
        onClick={handleBackdropClick}
      >
        {/* FIXED: Centered modal with better max width and spacing */}
        <div
          className={`w-full max-w-5xl rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
            isAnimating
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
          style={{
            maxHeight: "90vh",
            minHeight: "60vh",
            // Ensure solid background in dark mode
            backgroundColor: isDark ? "rgb(17, 24, 39)" : "white",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Header with Close Button - CENTERED */}
          <div
            className={`flex items-center justify-between p-6 ${themeClasses.borderLight} border-b text-center`}
          >
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                Profile Settings
              </h1>
              <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                Manage your account settings and preferences
              </p>
            </div>

            {/* Enhanced Close Button */}
            <button
              onClick={handleClose}
              className={`p-2 rounded-full ${themeClasses.hover} transition-colors group ml-4`}
              title="Close profile settings"
            >
              <svg
                className={`w-6 h-6 ${themeClasses.textMuted} group-hover:${themeClasses.text} transition-colors`}
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

          {/* Scrollable Content - CENTERED */}
          <div
            className={`overflow-y-auto ${themeClasses.background}`}
            style={{ maxHeight: "calc(90vh - 100px)" }}
          >
            <div className="p-8 space-y-8">
              {/* Profile Settings Form - Now properly centered */}
              <ProfileSettingsForm />

              {/* Account Information Card - CENTERED */}
              <div className="flex justify-center">
                <div
                  className={`w-full max-w-2xl ${themeClasses.card} p-8 rounded-xl border text-center`}
                >
                  <h3
                    className={`text-xl font-semibold ${themeClasses.text} mb-6`}
                  >
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <dt
                        className={`font-medium ${themeClasses.textMuted} mb-2`}
                      >
                        Account Status
                      </dt>
                      <dd className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${themeClasses.successLight}`}
                        >
                          ✓ Verified
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt
                        className={`font-medium ${themeClasses.textMuted} mb-2`}
                      >
                        Member Since
                      </dt>
                      <dd className={`${themeClasses.text} font-medium`}>
                        March 2025
                      </dd>
                    </div>
                    <div>
                      <dt
                        className={`font-medium ${themeClasses.textMuted} mb-2`}
                      >
                        Last Login
                      </dt>
                      <dd className={`${themeClasses.text} font-medium`}>
                        Today
                      </dd>
                    </div>
                    <div>
                      <dt
                        className={`font-medium ${themeClasses.textMuted} mb-2`}
                      >
                        Total Chats
                      </dt>
                      <dd className={`${themeClasses.text} font-medium`}>
                        {chats.length}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone - CENTERED */}
              <div className="flex justify-center">
                <div
                  className={`w-full max-w-2xl ${themeClasses.background} p-8 rounded-xl border-2 border-red-200 dark:border-red-800/50 text-center`}
                >
                  <h3
                    className={`text-xl font-semibold ${themeClasses.error} mb-2`}
                  >
                    Danger Zone
                  </h3>
                  <p className={`text-sm ${themeClasses.textMuted} mb-6`}>
                    These actions are permanent and cannot be undone.
                  </p>

                  <div className="space-y-4 max-w-md mx-auto">
                    <button
                      onClick={() => setShowDeleteChatsModal(true)}
                      disabled={isDeletingChats || chats.length === 0}
                      className={`w-full px-6 py-3 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isDeletingChats
                        ? " Deleting..."
                        : ` Delete All Chat History (${chats.length} chats)`}
                    </button>

                    <button
                      onClick={() => setShowDeleteAccountModal(true)}
                      disabled={isDeletingAccount}
                      className={`w-full px-6 py-3 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isDeletingAccount
                        ? "Deleting Account..."
                        : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Chats Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteChatsModal}
        onClose={() => setShowDeleteChatsModal(false)}
        onConfirm={handleDeleteAllChats}
        title="Delete All Chat History"
        description="Are you sure you want to delete all your chat history? This will permanently remove all your conversations and cannot be undone."
        itemName={`${chats.length} chat${chats.length !== 1 ? "s" : ""}`}
        confirmText="Delete All Chats"
        isLoading={isDeletingChats}
        requiresTyping={false}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This will remove all your data, including chat history, settings, and personal information."
        itemName="DELETE MY ACCOUNT"
        confirmText="Delete Account"
        isLoading={isDeletingAccount}
        requiresTyping={true}
      />
    </>
  );
}
