"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { Chat, ChatWithMessages } from "@/lib/hooks/use-chats";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ProfileOverlay } from "../profile/profile-overlay";

interface DashboardLayoutProps {
  children: React.ReactNode;
  chats: Chat[];
  activeChat: ChatWithMessages | null;
  isLoading: boolean;
  createNewChat: (initialMessage?: string) => Promise<string | undefined>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export function DashboardLayout({
  children,
  chats,
  activeChat,
  isLoading,
  createNewChat,
  selectChat,
  deleteChat,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Profile overlay state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/dashboard");

  const openProfile = () => {
    // Store the current URL as return URL
    const currentUrl = pathname + window.location.search;
    setReturnUrl(currentUrl);
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    // Navigate back to the stored return URL if needed
    if (returnUrl !== pathname + window.location.search) {
      router.push(returnUrl);
    }
  };

  // Get user's theme - with fallback
  const userTheme = user?.theme || "blue";

  // Simple theme classes - using template literals for dynamic classes
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "green":
        return {
          primary: "bg-green-600",
          primaryHover: "hover:bg-green-700",
          primaryLight: "bg-green-50",
          primaryBorder: "border-green-200",
          primaryText: "text-green-900",
        };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryHover: "hover:bg-purple-700",
          primaryLight: "bg-purple-50",
          primaryBorder: "border-purple-200",
          primaryText: "text-purple-900",
        };
      case "red":
        return {
          primary: "bg-red-600",
          primaryHover: "hover:bg-red-700",
          primaryLight: "bg-red-50",
          primaryBorder: "border-red-200",
          primaryText: "text-red-900",
        };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryHover: "hover:bg-orange-700",
          primaryLight: "bg-orange-50",
          primaryBorder: "border-orange-200",
          primaryText: "text-orange-900",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryHover: "hover:bg-indigo-700",
          primaryLight: "bg-indigo-50",
          primaryBorder: "border-indigo-200",
          primaryText: "text-indigo-900",
        };
      default: // blue
        return {
          primary: "bg-blue-600",
          primaryHover: "hover:bg-blue-700",
          primaryLight: "bg-blue-50",
          primaryBorder: "border-blue-200",
          primaryText: "text-blue-900",
        };
    }
  };

  const themeClasses = getThemeClasses(userTheme);

  console.log("Current user theme:", userTheme); // Debug log

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNewChat = async () => {
    setSidebarOpen(false);
    const newChatId = await createNewChat();

    // Update URL after chat is created
    if (newChatId) {
      if (pathname === "/profile") {
        router.push(`/dashboard?chat=${newChatId}`);
      } else {
        // Update URL to reflect the new chat
        window.history.replaceState({}, "", `/dashboard?chat=${newChatId}`);
      }
    } else if (pathname === "/profile") {
      router.push("/dashboard");
    }
  };

  const handleSelectChat = async (chatId: string) => {
    // First, select the chat
    await selectChat(chatId);
    setSidebarOpen(false);

    // Then update URL after chat is selected
    if (pathname === "/profile") {
      router.push(`/dashboard?chat=${chatId}`);
    } else {
      // Update URL to reflect the selected chat
      window.history.replaceState({}, "", `/dashboard?chat=${chatId}`);
    }
  };

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chatId);
    }
  };

  const formatChatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to continue</p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-6 flex justify-center items-center">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}
      <div className="flex overflow-hidden bg-white shadow-lg w-full max-w-7xl h-full rounded-lg">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
               ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
               lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full">
            {/* VU Logo and Title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${themeClasses.primary} rounded-lg flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-sm">VU</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    VU Assistant
                  </h1>
                  <p className="text-sm text-gray-500">
                    AI-Powered • {userTheme}
                  </p>
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
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

            {/* Navigation Content */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                disabled={isLoading}
                className={`w-full ${themeClasses.primary} text-white px-4 py-3 rounded-lg ${themeClasses.primaryHover} transition-colors flex items-center justify-center space-x-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>{isLoading ? "Creating..." : "New Chat"}</span>
              </button>

              {/* Chat Sessions List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Chat Sessions
                </h3>

                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-sm">No chats yet</p>
                    <p className="text-xs text-gray-300">
                      Click "New Chat" to start!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          activeChat?.id === chat.id
                            ? `${themeClasses.primaryLight} border ${themeClasses.primaryBorder}`
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              activeChat?.id === chat.id
                                ? themeClasses.primaryText
                                : "text-gray-900"
                            }`}
                          >
                            {chat.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatChatTime(chat.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 transition-all"
                          title="Delete chat"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Section at Bottom */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`w-10 h-10 ${themeClasses.primaryLight} rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`${themeClasses.primaryText} font-semibold text-sm`}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="space-y-1">
                <button
                  onClick={openProfile}
                  className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center space-x-2`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Header Title */}
                <div className="flex-1 lg:flex-none">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {pathname === "/profile"
                      ? "Profile Settings"
                      : activeChat
                        ? activeChat.name
                        : "Dashboard"}
                  </h2>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-4">
                  {/* Theme indicator */}
                  <div
                    className={`w-4 h-4 ${themeClasses.primary} rounded-full`}
                    title={`Theme: ${userTheme}`}
                  ></div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Profile Overlay */}
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={closeProfile}
        returnUrl={returnUrl}
      />
    </div>
  );
}
