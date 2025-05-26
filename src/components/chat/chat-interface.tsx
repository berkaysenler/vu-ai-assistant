"use client";

import { useState, useRef, useEffect } from "react";
import { ChatWithMessages } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";

interface ChatInterfaceProps {
  chat: ChatWithMessages;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatInterface({ chat, onSendMessage }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Get user's theme
  const userTheme = user?.theme || "blue";

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "green":
        return {
          primary: "bg-green-600",
          primaryHover: "hover:bg-green-700",
          primaryLight: "bg-green-100",
          primaryText: "text-green-100",
        };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryHover: "hover:bg-purple-700",
          primaryLight: "bg-purple-100",
          primaryText: "text-purple-100",
        };
      case "red":
        return {
          primary: "bg-red-600",
          primaryHover: "hover:bg-red-700",
          primaryLight: "bg-red-100",
          primaryText: "text-red-100",
        };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryHover: "hover:bg-orange-700",
          primaryLight: "bg-orange-100",
          primaryText: "text-orange-100",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryHover: "hover:bg-indigo-700",
          primaryLight: "bg-indigo-100",
          primaryText: "text-indigo-100",
        };
      default: // blue
        return {
          primary: "bg-blue-600",
          primaryHover: "hover:bg-blue-700",
          primaryLight: "bg-blue-100",
          primaryText: "text-blue-100",
        };
    }
  };

  const themeClasses = getThemeClasses(userTheme);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending) return;

    const messageToSend = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message on error
      setMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl rounded-lg px-4 py-2 ${
                msg.role === "USER"
                  ? `${themeClasses.primary} text-white`
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
              <div
                className={`text-xs mt-1 ${
                  msg.role === "USER"
                    ? themeClasses.primaryText
                    : "text-gray-500"
                }`}
              >
                {formatMessageTime(msg.createdAt)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator when sending */}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 max-w-2xl rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">
                  VU Assistant is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about courses, enrollment, campus facilities, or anything VU-related..."
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-transparent resize-none focus:ring-${userTheme}-500`}
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className={`px-6 py-3 ${themeClasses.primary} text-white rounded-lg ${themeClasses.primaryHover} focus:ring-2 focus:ring-offset-2 focus:ring-${userTheme}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/500</span>
        </div>
      </div>
    </div>
  );
}
