"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useChats } from "@/lib/hooks/use-chats";

export default function DashboardPage() {
  const { activeChat } = useChats();

  const handleSendMessage = async (message: string) => {
    // TODO: Implement message sending
    console.log("Sending message:", message);
  };

  return (
    <DashboardLayout>
      {activeChat ? (
        // Show Chat Interface when a chat is selected
        <div className="h-[calc(100vh-8rem)]">
          <ChatInterface chat={activeChat} onSendMessage={handleSendMessage} />
        </div>
      ) : (
        // Show Dashboard Content when no chat is selected
        <>
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome to Victoria University Assistant
              </h2>
              <p className="text-gray-600 mb-4">
                Your AI-powered assistant is ready to help with
                university-related questions, course information, and more!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Getting Started
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Click "New Chat" in the sidebar to start asking
                        questions about courses, enrollment, campus facilities,
                        academic policies, and more!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats/Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-blue-600"
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
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Ask Questions
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get instant answers about VU
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <p className="text-xs text-gray-500">Available anytime</p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Course Info
                    </h3>
                    <p className="text-sm text-gray-500">
                      Find course details & requirements
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <p className="text-xs text-gray-500">Courses available</p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Quick Responses
                    </h3>
                    <p className="text-sm text-gray-500">
                      AI-powered instant help
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-purple-600">
                    &lt;3s
                  </div>
                  <p className="text-xs text-gray-500">Average response time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <p className="mt-4 text-sm font-medium">No chat history yet</p>
                <p className="text-sm text-gray-400">
                  Start your first conversation to see it here!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
