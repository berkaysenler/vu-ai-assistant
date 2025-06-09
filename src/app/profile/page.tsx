// src/app/profile/page.tsx (FIXED - Properly centered design)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useChats } from "@/lib/hooks/use-chats";
import { useTheme } from "@/lib/context/theme-context";

export default function ProfilePage() {
  const {
    chats,
    activeChat,
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
  } = useChats();

  const { getThemeClasses } = useTheme();
  const router = useRouter();

  // Delete chats modal state
  const [showDeleteChatsModal, setShowDeleteChatsModal] = useState(false);
  const [isDeletingChats, setIsDeletingChats] = useState(false);

  // Delete account modal state
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const themeClasses = getThemeClasses();

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
        // Refresh the page to update the chat list
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

  return (
    <>
      <DashboardLayout
        chats={chats}
        activeChat={null} // Don't show any chat as active on profile page
        isLoading={isLoading}
        createNewChat={createNewChat}
        selectChat={selectChat}
        deleteChat={deleteChat}
      >
        {/* FIXED: Centered container with proper max width and spacing */}
        <div className="flex justify-center min-h-full py-8 px-4">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Page Header - Centered */}
            <div
              className={`${themeClasses.borderLight} border-b pb-6 text-center`}
            >
              <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
                Profile Settings
              </h1>
              <p
                className={`text-lg ${themeClasses.textMuted} max-w-2xl mx-auto`}
              >
                Manage your account settings, preferences, and data
              </p>
            </div>

            {/* Profile Settings Form - Centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <ProfileSettingsForm />
              </div>
            </div>

            {/* Account Information Card - Centered */}
            <div className="flex justify-center">
              <div
                className={`w-full max-w-3xl ${themeClasses.card} p-8 rounded-xl border shadow-sm`}
              >
                <h3
                  className={`text-xl font-semibold ${themeClasses.text} mb-6 text-center`}
                >
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-2`}
                    >
                      Account Status
                    </dt>
                    <dd className="flex justify-center md:justify-start">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${themeClasses.successLight}`}
                      >
                        ✓ Verified Account
                      </span>
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-2`}
                    >
                      Member Since
                    </dt>
                    <dd className={`${themeClasses.text} font-medium`}>
                      March 2025
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-2`}
                    >
                      Last Login
                    </dt>
                    <dd className={`${themeClasses.text} font-medium`}>
                      Today
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-2`}
                    >
                      Total Conversations
                    </dt>
                    <dd className={`${themeClasses.text} font-medium`}>
                      {chats.length} chat{chats.length !== 1 ? "s" : ""}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone - Centered */}
            <div className="flex justify-center">
              <div
                className={`w-full max-w-3xl ${themeClasses.background} p-8 rounded-xl border-2 border-red-200 dark:border-red-800/50 shadow-sm`}
              >
                <div className="text-center mb-6">
                  <h3
                    className={`text-xl font-semibold ${themeClasses.error} mb-2`}
                  >
                    ⚠️ Danger Zone
                  </h3>
                  <p className={`text-base ${themeClasses.textMuted}`}>
                    These actions are permanent and cannot be undone.
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  {/* Delete All Chats Button - Centered */}
                  <button
                    onClick={() => setShowDeleteChatsModal(true)}
                    disabled={isDeletingChats || chats.length === 0}
                    className={`w-full px-6 py-3 text-base font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isDeletingChats
                      ? "🔄 Deleting..."
                      : `🗑️ Delete All Chat History (${chats.length} chats)`}
                  </button>

                  {/* Delete Account Button - Centered */}
                  <button
                    onClick={() => setShowDeleteAccountModal(true)}
                    disabled={isDeletingAccount}
                    className={`w-full px-6 py-3 text-base font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isDeletingAccount
                      ? "🔄 Deleting Account..."
                      : "❌ Delete Account"}
                  </button>
                </div>

                {/* Safety Notice */}
                <div className="mt-6 text-center">
                  <p
                    className={`text-sm ${themeClasses.textMuted} max-w-md mx-auto`}
                  >
                    <strong>Safety Notice:</strong> Once deleted, your data
                    cannot be recovered. Please ensure you've backed up any
                    important information before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      </DashboardLayout>

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
