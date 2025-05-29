// src/app/profile/page.tsx (UPDATED - Dark mode compatible)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
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
  const [isDeletingChats, setIsDeletingChats] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const themeClasses = getThemeClasses();

  const handleDeleteAllChats = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all your chat history? This action cannot be undone."
      )
    ) {
      return;
    }

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
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt(
      'To delete your account permanently, please type "DELETE MY ACCOUNT" (without quotes):'
    );

    if (confirmText !== "DELETE MY ACCOUNT") {
      alert(
        "Account deletion cancelled. You must type exactly: DELETE MY ACCOUNT"
      );
      return;
    }

    if (
      !confirm(
        "This will permanently delete your account and all data. Are you absolutely sure?"
      )
    ) {
      return;
    }

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
    }
  };

  return (
    <DashboardLayout
      chats={chats}
      activeChat={null} // Don't show any chat as active on profile page
      isLoading={isLoading}
      createNewChat={createNewChat}
      selectChat={selectChat}
      deleteChat={deleteChat}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className={`${themeClasses.borderLight} border-b pb-4`}>
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
            Profile Settings
          </h1>
          <p className={`mt-1 text-sm ${themeClasses.textMuted}`}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Settings Form */}
        <ProfileSettingsForm />

        {/* Account Information Card */}
        <div className={`${themeClasses.card} p-6 rounded-lg border`}>
          <h3 className={`text-lg font-medium ${themeClasses.text} mb-4`}>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className={`font-medium ${themeClasses.textMuted}`}>
                Account Status
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${themeClasses.successLight}`}
                >
                  Verified
                </span>
              </dd>
            </div>
            <div>
              <dt className={`font-medium ${themeClasses.textMuted}`}>
                Member Since
              </dt>
              <dd className={`mt-1 ${themeClasses.text}`}>March 2025</dd>
            </div>
            <div>
              <dt className={`font-medium ${themeClasses.textMuted}`}>
                Last Login
              </dt>
              <dd className={`mt-1 ${themeClasses.text}`}>Today</dd>
            </div>
            <div>
              <dt className={`font-medium ${themeClasses.textMuted}`}>
                Total Chats
              </dt>
              <dd className={`mt-1 ${themeClasses.text}`}>{chats.length}</dd>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className={`${themeClasses.background} p-6 rounded-lg border-2 border-red-200 dark:border-red-800/50`}
        >
          <h3 className={`text-lg font-medium ${themeClasses.error} mb-2`}>
            Danger Zone
          </h3>
          <p className={`text-sm ${themeClasses.textMuted} mb-4`}>
            These actions are permanent and cannot be undone.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleDeleteAllChats}
              disabled={isDeletingChats || chats.length === 0}
              className={`px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDeletingChats
                ? "Deleting..."
                : `Delete All Chat History (${chats.length} chats)`}
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className={`px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
