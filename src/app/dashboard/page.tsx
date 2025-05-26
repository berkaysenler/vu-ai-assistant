"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChats } from "@/lib/hooks/use-chats";

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
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VU</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Victoria University Assistant
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            Your AI-powered guide for all questions related to Victoria
            University. Select a chat from the sidebar or start a new
            conversation.
          </p>
          <button
            onClick={createNewChat}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <span>{isLoading ? "Creating..." : "Start New Conversation"}</span>
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
