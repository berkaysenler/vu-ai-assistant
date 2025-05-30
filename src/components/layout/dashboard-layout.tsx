// src/components/layout/dashboard-layout.tsx (FIXED - Profile icon circle color and letter)
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { Chat, ChatWithMessages } from "@/lib/hooks/use-chats";
import { useRouter, usePathname } from "next/navigation";
import { GlobalSearch } from "@/components/search/global-search";
import Link from "next/link";
import Image from "next/image";
import { ProfileOverlay } from "../profile/profile-overlay";
import { TextInputModal } from "@/components/ui/text-input-modal";
import { useTheme } from "@/lib/context/theme-context";
import { ThemeSelector } from "@/components/ui/theme-selector";

interface DashboardLayoutProps {
  children: React.ReactNode;
  chats: Chat[];
  activeChat: ChatWithMessages | null;
  isLoading: boolean;
  createNewChat: (initialMessage?: string) => Promise<string | undefined>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat?: (chatId: string, newName: string) => Promise<void>;
  onSendMessage?: (message: string) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onRenameChat?: (newName: string) => Promise<void>;
  onSearchInChat?: (query: string) => void;
}

export function DashboardLayout({
  children,
  chats,
  activeChat,
  isLoading,
  createNewChat,
  selectChat,
  deleteChat,
  renameChat,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onRenameChat,
  onSearchInChat,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [renamingChat, setRenamingChat] = useState<Chat | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isLoading: userLoading } = useUser();
  const { getThemeClasses, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Profile overlay state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/dashboard");

  const themeClasses = getThemeClasses();

  const openProfile = () => {
    const currentUrl = pathname + window.location.search;
    setReturnUrl(currentUrl);
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    if (returnUrl !== pathname + window.location.search) {
      router.push(returnUrl);
    }
  };

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

    if (newChatId) {
      if (pathname === "/profile") {
        router.push(`/dashboard?chat=${newChatId}`);
      } else {
        window.history.replaceState({}, "", `/dashboard?chat=${newChatId}`);
      }
    } else if (pathname === "/profile") {
      router.push("/dashboard");
    }
  };

  const handleSelectChat = async (chatId: string) => {
    await selectChat(chatId);
    setSidebarOpen(false);

    if (pathname === "/profile") {
      router.push(`/dashboard?chat=${chatId}`);
    } else {
      window.history.replaceState({}, "", `/dashboard?chat=${chatId}`);
    }
  };

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chatId);
    }
  };

  const handleRenameChat = async (newName: string) => {
    if (!renameChat || !renamingChat) return;

    setIsRenaming(true);
    try {
      await renameChat(renamingChat.id, newName);
      setRenamingChat(null);
    } catch (error) {
      console.error("Error renaming chat:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleSearchResult = (chatId: string, messageId: string) => {
    setShowGlobalSearch(false);
    handleSelectChat(chatId);

    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
        messageElement.classList.add("message-highlight");
        setTimeout(() => {
          messageElement.classList.remove("message-highlight");
        }, 2000);
      }
    }, 1000);
  };

  // Filter messages for in-chat search
  const filteredMessages =
    activeChat?.messages?.filter((msg) =>
      searchQuery.trim()
        ? msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    ) || [];

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

  // FIXED: Get the first letter of display name (or full name as fallback)
  const getProfileInitial = () => {
    if (!user) return "?";
    const name = user.displayName || user.fullName || user.email;
    return name.charAt(0).toUpperCase();
  };

  if (userLoading) {
    return (
      <div
        className={`min-h-screen ${themeClasses.backgroundSecondary} flex items-center justify-center`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeClasses.primary.replace("bg-", "border-")} mx-auto mb-4`}
          ></div>
          <p className={themeClasses.textSecondary}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen ${themeClasses.backgroundSecondary} flex items-center justify-center`}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to continue</p>
          <Link
            href="/auth/login"
            className={`inline-block ${themeClasses.primary} text-white px-4 py-2 rounded ${themeClasses.primaryHover} transition-colors`}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen ${themeClasses.backgroundSecondary} p-6 flex justify-center items-center`}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className={`fixed inset-0 ${isDark ? "bg-black/50" : "bg-gray-600/75"}`}
          ></div>
        </div>
      )}

      <div
        className={`flex overflow-hidden ${themeClasses.background} shadow-lg w-full max-w-7xl h-full rounded-lg ${themeClasses.border} border`}
      >
        {/* Sidebar - IMPROVED visibility in dark mode */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-80 shadow-lg transform transition-transform duration-300 ease-in-out
               ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
               lg:translate-x-0 lg:static lg:inset-0`}
          style={{
            // Solid background in dark mode for better visibility
            backgroundColor: isDark ? "rgb(17, 24, 39)" : "white",
            borderRight: isDark
              ? "1px solid rgb(55, 65, 81)"
              : "1px solid rgb(229, 231, 235)",
          }}
        >
          <div className="flex flex-col h-full">
            {/* VU Logo and Title - Enhanced visibility */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b`}
              style={{
                borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${themeClasses.primary} rounded-lg flex items-center justify-center shadow-md`}
                >
                  <Image
                    src="/vu-logo.png"
                    alt="VU Assistant Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1
                    className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                  >
                    VU Assistant
                  </h1>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    AI-Powered
                  </p>
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden p-1 rounded-md ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"} transition-colors`}
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
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {/* New Chat Button - Enhanced for dark mode */}
                <button
                  onClick={handleNewChat}
                  disabled={isLoading}
                  className={`w-full ${themeClasses.primary} text-white px-4 py-3 rounded-lg ${themeClasses.primaryHover} transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm`}
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

                {/* Global Search Button - Enhanced styling */}
                <button
                  onClick={() => setShowGlobalSearch(!showGlobalSearch)}
                  className={`w-full border px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium ${
                    showGlobalSearch
                      ? `${themeClasses.primaryLight} ${themeClasses.primaryBorder} ${themeClasses.primaryText} border-2`
                      : `${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"}`
                  }`}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search All Chats</span>
                </button>
              </div>

              {/* Global Search */}
              {showGlobalSearch && (
                <div className="mb-6">
                  <GlobalSearch
                    onSelectResult={handleSearchResult}
                    className="w-full"
                  />
                </div>
              )}

              {/* Chat Sessions List - Enhanced visibility */}
              <div className="space-y-2">
                <h3
                  className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-3`}
                >
                  Chat Sessions ({chats.length})
                </h3>

                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div
                          className={`h-12 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-lg`}
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-gray-600" : "text-gray-300"}`}
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
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      No chats yet
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
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
                            ? `${themeClasses.primaryLight} ${themeClasses.primaryBorder} border-2`
                            : `${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`
                        }`}
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              activeChat?.id === chat.id
                                ? themeClasses.primaryText
                                : `${isDark ? "text-gray-200" : "text-gray-900"}`
                            }`}
                          >
                            {chat.name}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}
                          >
                            {formatChatTime(chat.updatedAt)}
                          </p>
                        </div>

                        {/* Chat Actions - Enhanced visibility */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Rename Button */}
                          {renameChat && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenamingChat(chat);
                              }}
                              className={`p-1 rounded ${isDark ? "text-gray-400 hover:text-blue-400 hover:bg-gray-600" : "text-gray-400 hover:text-blue-600 hover:bg-gray-100"} transition-colors`}
                              title="Rename chat"
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
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className={`p-1 rounded ${isDark ? "text-gray-400 hover:text-red-400 hover:bg-gray-600" : "text-gray-400 hover:text-red-600 hover:bg-gray-100"} transition-colors`}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Section at Bottom - FIXED: Theme color circle and display name letter */}
            <div
              className={`border-t p-4`}
              style={{
                borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)",
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                {/* FIXED: Profile icon with theme color background and display name initial */}
                <div
                  className={`w-10 h-10 ${themeClasses.primary} rounded-full flex items-center justify-center shadow-md`}
                >
                  <span className="text-white font-semibold text-sm">
                    {getProfileInitial()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"} truncate`}
                  >
                    {user.displayName || user.fullName}
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} truncate`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Profile Actions - Enhanced for dark mode */}
              <div className="space-y-1">
                <button
                  onClick={openProfile}
                  className={`w-full text-left px-3 py-2 text-sm ${isDark ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100" : "text-gray-700 hover:bg-gray-100"} rounded-md flex items-center space-x-2 transition-colors`}
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
                  className={`w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md flex items-center space-x-2 transition-colors`}
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
          {/* Consolidated Header - FIXED: Single search button on mobile */}
          <header
            className={`${themeClasses.background} shadow-sm ${themeClasses.borderLight} border-b sticky top-0 z-10`}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                {/* Left Section - Mobile menu + Title */}
                <div className="flex items-center space-x-4">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className={`lg:hidden p-2 rounded-md ${themeClasses.textMuted} ${themeClasses.hover}`}
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
                  <div>
                    <h2
                      className={`text-xl font-semibold ${themeClasses.text}`}
                    >
                      {pathname === "/profile"
                        ? "Profile Settings"
                        : activeChat
                          ? activeChat.name
                          : "Dashboard"}
                    </h2>
                    {activeChat && (
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        {filteredMessages.length} message
                        {filteredMessages.length !== 1 ? "s" : ""}
                        {searchQuery &&
                          ` • ${filteredMessages.length} matching`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section - Chat Actions + Theme - FIXED: Single search on mobile */}
                <div className="flex items-center space-x-2">
                  {/* Chat-specific search - Desktop only OR when active chat exists */}
                  {activeChat && (
                    <button
                      onClick={() => {
                        setShowSearch(!showSearch);
                        if (showSearch) {
                          setSearchQuery("");
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        showSearch
                          ? `${themeClasses.primary} text-white`
                          : `${themeClasses.hover} ${themeClasses.textSecondary}`
                      }`}
                      title="Search in current chat"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Global Search Toggle - Mobile only when no active chat */}
                  {!activeChat && (
                    <button
                      onClick={() => setShowGlobalSearch(!showGlobalSearch)}
                      className={`lg:hidden p-2 rounded-lg transition-colors ${
                        showGlobalSearch
                          ? `${themeClasses.primary} text-white`
                          : `${themeClasses.hover} ${themeClasses.textSecondary}`
                      }`}
                      title="Search all chats"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Theme Selector */}
                  <ThemeSelector />
                </div>
              </div>

              {/* In-Chat Search Bar */}
              {activeChat && showSearch && (
                <div
                  className={`pb-3 ${themeClasses.borderLight} border-t pt-3`}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (onSearchInChat) {
                          onSearchInChat(e.target.value);
                        }
                      }}
                      placeholder="Search messages in this chat..."
                      className={`w-full pl-10 pr-10 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} transition-colors placeholder:${themeClasses.textMuted}`}
                    />
                    <svg
                      className={`absolute left-3 top-2.5 w-5 h-5 ${themeClasses.textMuted}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className={`absolute right-3 top-2.5 ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className={`text-xs ${themeClasses.textMuted} mt-2`}>
                      Found {filteredMessages.length} message
                      {filteredMessages.length !== 1 ? "s" : ""} matching "
                      {searchQuery}"
                    </p>
                  )}
                </div>
              )}

              {/* Mobile Global Search - Only when no active chat */}
              {!activeChat && showGlobalSearch && (
                <div className="lg:hidden pb-4">
                  <GlobalSearch
                    onSelectResult={(chatId, messageId) => {
                      handleSearchResult(chatId, messageId);
                      setSidebarOpen(false);
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Profile Overlay */}
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={closeProfile}
        returnUrl={returnUrl}
      />

      {/* Rename Chat Modal */}
      <TextInputModal
        isOpen={!!renamingChat}
        onClose={() => setRenamingChat(null)}
        onSubmit={handleRenameChat}
        title="Rename Chat"
        description="Enter a new name for this chat session"
        placeholder="Enter chat name..."
        initialValue={renamingChat?.name || ""}
        submitText="Rename"
        maxLength={100}
        isLoading={isRenaming}
        validation={(value) => {
          if (value.length < 2)
            return "Chat name must be at least 2 characters";
          if (value === renamingChat?.name)
            return "Please enter a different name";
          return null;
        }}
      />
    </div>
  );
}
