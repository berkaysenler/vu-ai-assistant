// src/app/profile/page.tsx (UPDATED - Bigger fonts throughout)
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
        {/* FIXED: Centered container with proper max width and spacing - UPDATED: Bigger fonts */}
        <div className="flex justify-center min-h-full py-10 px-4">
          <div className="w-full max-w-4xl mx-auto space-y-10">
            {/* Page Header - Centered */}
            <div
              className={`${themeClasses.borderLight} border-b pb-8 text-center`}
            >
              <h1 className={`text-4xl font-bold ${themeClasses.text} mb-3`}>
                Profile Settings
              </h1>
              <p
                className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto leading-relaxed`}
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
                className={`w-full max-w-3xl ${themeClasses.card} p-10 rounded-xl border shadow-sm`}
              >
                <h3
                  className={`text-2xl font-semibold ${themeClasses.text} mb-8 text-center`}
                >
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg">
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-3 text-base`}
                    >
                      Account Status
                    </dt>
                    <dd className="flex justify-center md:justify-start">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${themeClasses.successLight}`}
                      >
                        ✓ Verified Account
                      </span>
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-3 text-base`}
                    >
                      Member Since
                    </dt>
                    <dd
                      className={`${themeClasses.text} font-semibold text-lg`}
                    >
                      March 2025
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-3 text-base`}
                    >
                      Last Login
                    </dt>
                    <dd
                      className={`${themeClasses.text} font-semibold text-lg`}
                    >
                      Today
                    </dd>
                  </div>
                  <div className="text-center md:text-left">
                    <dt
                      className={`font-semibold ${themeClasses.textMuted} mb-3 text-base`}
                    >
                      Total Conversations
                    </dt>
                    <dd
                      className={`${themeClasses.text} font-semibold text-lg`}
                    >
                      {chats.length} chat{chats.length !== 1 ? "s" : ""}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone - Centered */}
            <div className="flex justify-center">
              <div
                className={`w-full max-w-3xl ${themeClasses.background} p-10 rounded-xl border-2 border-red-200 dark:border-red-800/50 shadow-sm`}
              >
                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-semibold ${themeClasses.error} mb-3`}
                  >
                    ⚠️ Danger Zone
                  </h3>
                  <p className={`text-lg ${themeClasses.textMuted}`}>
                    These actions are permanent and cannot be undone.
                  </p>
                </div>

                <div className="space-y-5 max-w-md mx-auto">
                  {/* Delete All Chats Button - Centered */}
                  <button
                    onClick={() => setShowDeleteChatsModal(true)}
                    disabled={isDeletingChats || chats.length === 0}
                    className={`w-full px-8 py-4 text-lg font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isDeletingChats
                      ? "🔄 Deleting..."
                      : `🗑️ Delete All Chat History (${chats.length} chats)`}
                  </button>

                  {/* Delete Account Button - Centered */}
                  <button
                    onClick={() => setShowDeleteAccountModal(true)}
                    disabled={isDeletingAccount}
                    className={`w-full px-8 py-4 text-lg font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isDeletingAccount
                      ? "🔄 Deleting Account..."
                      : "❌ Delete Account"}
                  </button>
                </div>

                {/* Safety Notice */}
                <div className="mt-8 text-center">
                  <p
                    className={`text-base ${themeClasses.textMuted} max-w-md mx-auto leading-relaxed`}
                  >
                    <strong>Safety Notice:</strong> Once deleted, your data
                    cannot be recovered. Please ensure you've backed up any
                    important information before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-10"></div>
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
