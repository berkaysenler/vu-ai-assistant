// src/app/dashboard/page.tsx (UPDATED - Full size VU logo)
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChats } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";
import { useTheme } from "@/lib/context/theme-context";

export default function DashboardPage() {
  const {
    chats,
    activeChat,
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useChats();

  const { user } = useUser();
  const { getThemeClasses } = useTheme();
  const searchParams = useSearchParams();
  const [quickMessage, setQuickMessage] = useState("");
  const [isQuickSending, setIsQuickSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // FIXED: Add state for quick action processing
  const [isQuickActionProcessing, setIsQuickActionProcessing] = useState(false);

  const themeClasses = getThemeClasses();

  // Handle chat selection from URL parameter
  useEffect(() => {
    const chatId = searchParams.get("chat");

    if (chatId && chats.length > 0) {
      const chatExists = chats.find((chat) => chat.id === chatId);
      if (chatExists && (!activeChat || activeChat.id !== chatId)) {
        console.log("Selecting chat from URL:", chatId);
        selectChat(chatId);
        setTimeout(() => {
          window.history.replaceState({}, "", "/dashboard");
        }, 100);
      } else if (!chatExists) {
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, [searchParams, chats, activeChat, selectChat]);

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim() || isQuickSending) return;

    const messageToSend = quickMessage.trim();
    setQuickMessage("");
    setIsQuickSending(true);

    try {
      await createNewChat(messageToSend);
    } catch (error) {
      console.error("Quick start error:", error);
      setQuickMessage(messageToSend);
    } finally {
      setIsQuickSending(false);
    }
  };

  // FIXED: Enhanced quick action handling with immediate UI feedback
  const handleQuickAction = async (actionMessage: string) => {
    if (isQuickActionProcessing) return; // Prevent multiple clicks

    setIsQuickActionProcessing(true);

    try {
      console.log("Quick action triggered with message:", actionMessage);
      // Create new chat with the action message - this will show user message immediately
      const newChatId = await createNewChat(actionMessage);

      if (newChatId) {
        console.log("Quick action initiated successfully");
        // The UI will show the user message immediately and AI typing indicator
        // AI response will appear when the background API call completes
      }
    } catch (error) {
      console.error("Quick action error:", error);
    } finally {
      setIsQuickActionProcessing(false);
    }
  };

  const handleRenameChat = async (newName: string) => {
    if (activeChat && renameChat) {
      await renameChat(activeChat.id, newName);
    }
  };

  const handleSearchInChat = (query: string) => {
    setSearchQuery(query);
  };

  // Filter messages for search
  const filteredMessages = activeChat?.messages?.filter((msg) =>
    searchQuery.trim()
      ? msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <DashboardLayout
      chats={chats}
      activeChat={activeChat}
      isLoading={isLoading}
      createNewChat={createNewChat}
      selectChat={selectChat}
      deleteChat={deleteChat}
      renameChat={renameChat}
      onSendMessage={sendMessage}
      onEditMessage={editMessage}
      onDeleteMessage={deleteMessage}
      onRenameChat={handleRenameChat}
      onSearchInChat={handleSearchInChat}
    >
      {activeChat ? (
        <ChatInterface
          chat={activeChat}
          onSendMessage={sendMessage}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onRenameChat={handleRenameChat}
          onSearchInChat={handleSearchInChat}
          searchQuery={searchQuery}
          filteredMessages={filteredMessages}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto px-4">
          {/* Welcome Section - UPDATED: Full size VU logo */}
          <div className="mb-8">
            {/* UPDATED: Bigger, rounded container for full size VU logo */}
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 mx-auto p-4">
              <Image
                src="/vu-icon.ico"
                alt="Victoria University Logo"
                width={144}
                height={144}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              Welcome to Victoria University Assistant
            </h2>
            <p
              className={`${themeClasses.textSecondary} max-w-2xl mx-auto text-xl leading-relaxed`}
            >
              Your AI-powered guide for all questions related to Victoria
              University. Ask about courses, enrollment, campus facilities,
              academic policies, and more.
            </p>
          </div>

          {/* Quick Start Chat - UPDATED: Bigger fonts */}
          <div className="w-full max-w-2xl mb-8">
            <div className={`${themeClasses.card} rounded-xl shadow-lg p-8`}>
              <h3
                className={`text-xl font-semibold ${themeClasses.text} mb-6 text-center`}
              >
                Start a conversation
              </h3>
              <form onSubmit={handleQuickStart} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder="Ask me anything about Victoria University..."
                    className={`w-full px-5 py-4 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} resize-none text-lg placeholder:${themeClasses.textMuted} leading-relaxed`}
                    rows={3}
                    disabled={isQuickSending || isQuickActionProcessing}
                    maxLength={500}
                  />
                  <div
                    className={`absolute bottom-3 right-3 text-sm ${themeClasses.textMuted}`}
                  >
                    {/* {quickMessage.length}/500 */}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={
                    !quickMessage.trim() ||
                    isQuickSending ||
                    isQuickActionProcessing
                  }
                  className={`w-full ${themeClasses.primary} text-white px-8 py-4 rounded-lg ${themeClasses.primaryHover} transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold`}
                >
                  {isQuickSending ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Starting chat...</span>
                    </>
                  ) : (
                    <>
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span>Start Chat</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions - UPDATED: Bigger fonts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
            {[
              {
                title: "Course Information",
                description:
                  "Learn about programs, admission requirements, and course details",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                message:
                  "Tell me about the available courses and programs at Victoria University",
              },
              {
                title: "Enrollment Process",
                description:
                  "Get help with applications, deadlines, and admission procedures",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                message:
                  "How do I apply and enroll at Victoria University? What are the requirements?",
              },
              {
                title: "Campus & Facilities",
                description:
                  "Explore campus facilities, libraries, and student services",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                message:
                  "What facilities and services are available on the Victoria University campus?",
              },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.message)}
                disabled={isQuickActionProcessing || isQuickSending}
                className={`${themeClasses.card} p-8 rounded-lg ${themeClasses.cardHover} transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`w-16 h-16 ${themeClasses.primary} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isQuickActionProcessing ? "animate-pulse" : ""}`}
                >
                  {/* FIXED: Show loading spinner when processing this specific action */}
                  {isQuickActionProcessing ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={action.icon}
                      />
                    </svg>
                  )}
                </div>
                <h4
                  className={`font-semibold ${themeClasses.text} mb-3 text-lg`}
                >
                  {action.title}
                </h4>
                <p
                  className={`text-base ${themeClasses.textSecondary} leading-relaxed`}
                >
                  {action.description}
                </p>
                {/* FIXED: Show processing state with more specific message */}
                {isQuickActionProcessing && (
                  <p
                    className={`text-sm ${themeClasses.primaryText} mt-3 font-medium`}
                  >
                    Opening chat...
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Stats Section - UPDATED: Bigger fonts */}
          {chats.length > 0 && (
            <div className={`text-center ${themeClasses.textMuted}`}>
              <p className="text-base">
                You have {chats.length} chat{chats.length !== 1 ? "s" : ""} in
                your history
              </p>
              <p className="text-sm mt-2">
                Use the global search to find messages across all your chats
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
