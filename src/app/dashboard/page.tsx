"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChats } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";

export default function DashboardPage() {
  const {
    chats,
    activeChat,
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
  } = useChats();

  const { user } = useUser();
  const searchParams = useSearchParams();
  const [quickMessage, setQuickMessage] = useState("");
  const [isQuickSending, setIsQuickSending] = useState(false);
  // Handle chat selection from URL parameter (only when coming from other pages)
  useEffect(() => {
    const chatId = searchParams.get("chat");

    if (chatId && chats.length > 0) {
      // If there's a chat ID in URL, select it and then clean the URL
      const chatExists = chats.find((chat) => chat.id === chatId);
      if (chatExists && (!activeChat || activeChat.id !== chatId)) {
        console.log("Selecting chat from URL:", chatId);
        selectChat(chatId);
        // Clean the URL after selecting the chat to prevent glitches
        setTimeout(() => {
          window.history.replaceState({}, "", "/dashboard");
        }, 100);
      } else if (!chatExists) {
        // If the chat ID in URL doesn't exist, just clean the URL
        window.history.replaceState({}, "", "/dashboard");
      }
    }
    // Don't auto-select any chat if no URL parameter - let user see the dashboard home
  }, [searchParams, chats, activeChat, selectChat]);

  // Get user's theme for styling
  const userTheme = (user as any)?.theme || "blue";
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "green":
        return { primary: "bg-green-600", primaryHover: "hover:bg-green-700" };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryHover: "hover:bg-purple-700",
        };
      case "red":
        return { primary: "bg-red-600", primaryHover: "hover:bg-red-700" };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryHover: "hover:bg-orange-700",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryHover: "hover:bg-indigo-700",
        };
      default:
        return { primary: "bg-blue-600", primaryHover: "hover:bg-blue-700" };
    }
  };
  const themeClasses = getThemeClasses(userTheme);

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim() || isQuickSending) return;

    const messageToSend = quickMessage.trim();
    setQuickMessage("");
    setIsQuickSending(true);

    try {
      // Create new chat with the initial message
      await createNewChat(messageToSend);
    } catch (error) {
      console.error("Quick start error:", error);
      setQuickMessage(messageToSend); // Restore message on error
    } finally {
      setIsQuickSending(false);
    }
  };

  return (
    <DashboardLayout
      chats={chats}
      activeChat={activeChat}
      isLoading={isLoading}
      createNewChat={createNewChat}
      selectChat={selectChat}
      deleteChat={deleteChat}
    >
      {activeChat ? (
        <div className="h-full">
          <ChatInterface chat={activeChat} onSendMessage={sendMessage} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div
              className={`w-24 h-24 ${themeClasses.primary} rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg`}
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span
                  className={`${themeClasses.primary.replace("bg-", "text-")} font-bold text-lg`}
                >
                  VU
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to Victoria University Assistant
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Your AI-powered guide for all questions related to Victoria
              University. Ask about courses, enrollment, campus facilities,
              academic policies, and more.
            </p>
          </div>

          {/* Quick Start Chat */}
          <div className="w-full max-w-2xl mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Start a conversation
              </h3>
              <form onSubmit={handleQuickStart} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder="Ask me anything about Victoria University..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                    rows={3}
                    disabled={isQuickSending}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {quickMessage.length}/500
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!quickMessage.trim() || isQuickSending}
                  className={`w-full ${themeClasses.primary} text-white px-6 py-3 rounded-lg ${themeClasses.primaryHover} transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium`}
                >
                  {isQuickSending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Starting chat...</span>
                    </>
                  ) : (
                    <>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
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
                onClick={() => {
                  setQuickMessage(action.message);
                  // Auto focus the textarea
                  setTimeout(() => {
                    const textarea = document.querySelector("textarea");
                    textarea?.focus();
                  }, 100);
                }}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 ${themeClasses.primary} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
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
                      d={action.icon}
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Stats Section */}
          {chats.length > 0 && (
            <div className="text-center text-gray-500">
              <p className="text-sm">
                You have {chats.length} chat{chats.length !== 1 ? "s" : ""} in
                your history
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
