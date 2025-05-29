// src/components/chat/chat-interface.tsx (UPDATED - Better UX)
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatWithMessages, Message } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface ChatInterfaceProps {
  chat: ChatWithMessages;
  onSendMessage: (message: string) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onRenameChat?: (newName: string) => Promise<void>;
  onSearchInChat?: (query: string) => void;
}

export function ChatInterface({
  chat,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onRenameChat,
  onSearchInChat,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Message | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
          focus: "focus:ring-green-500",
        };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryHover: "hover:bg-purple-700",
          primaryLight: "bg-purple-100",
          primaryText: "text-purple-100",
          focus: "focus:ring-purple-500",
        };
      case "red":
        return {
          primary: "bg-red-600",
          primaryHover: "hover:bg-red-700",
          primaryLight: "bg-red-100",
          primaryText: "text-red-100",
          focus: "focus:ring-red-500",
        };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryHover: "hover:bg-orange-700",
          primaryLight: "bg-orange-100",
          primaryText: "text-orange-100",
          focus: "focus:ring-orange-500",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryHover: "hover:bg-indigo-700",
          primaryLight: "bg-indigo-100",
          primaryText: "text-indigo-100",
          focus: "focus:ring-indigo-500",
        };
      default: // blue
        return {
          primary: "bg-blue-600",
          primaryHover: "hover:bg-blue-700",
          primaryLight: "bg-blue-100",
          primaryText: "text-blue-100",
          focus: "focus:ring-blue-500",
        };
    }
  };

  const themeClasses = getThemeClasses(userTheme);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // Focus search input when search is opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

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

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!onEditMessage) return;

    setIsProcessing(true);
    try {
      await onEditMessage(messageId, newContent);
      setEditingMessage(null);
      setEditingContent("");
      // TODO: Regenerate AI response when AI is implemented
    } catch (error) {
      console.error("Error editing message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!onDeleteMessage) return;

    setIsProcessing(true);
    try {
      await onDeleteMessage(messageId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditing = (msg: Message) => {
    setEditingMessage(msg);
    setEditingContent(msg.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditingContent("");
  };

  const saveEdit = async () => {
    if (editingMessage && editingContent.trim() !== editingMessage.content) {
      await handleEditMessage(editingMessage.id, editingContent.trim());
    } else {
      cancelEditing();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const highlightSearchText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredMessages = searchQuery.trim()
    ? chat.messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chat.messages;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {chat.name}
            </h2>
            <p className="text-sm text-gray-500">
              {chat.messages.length} message
              {chat.messages.length !== 1 ? "s" : ""}
              {searchQuery && ` • ${filteredMessages.length} matching`}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Search Toggle */}
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
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title="Search in chat"
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
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchInChat) {
                    onSearchInChat(e.target.value);
                  }
                }}
                placeholder="Search messages in this chat..."
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors ${themeClasses.focus}`}
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
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
              <p className="text-xs text-gray-500 mt-2">
                Found {filteredMessages.length} message
                {filteredMessages.length !== 1 ? "s" : ""} matching "
                {searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? (
              <div>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p>No messages found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-blue-600 hover:text-blue-500 text-sm mt-2"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`max-w-2xl rounded-lg px-4 py-2 relative ${
                  msg.role === "USER"
                    ? `${themeClasses.primary} text-white`
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                {/* Message Actions (only for user messages) */}
                {msg.role === "USER" && (onEditMessage || onDeleteMessage) && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      {onEditMessage && (
                        <button
                          onClick={() => startEditing(msg)}
                          className="p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                          title="Edit message"
                        >
                          <svg
                            className="w-3 h-3"
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
                      {onDeleteMessage && (
                        <button
                          onClick={() => setShowDeleteModal(msg)}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Delete message"
                        >
                          <svg
                            className="w-3 h-3"
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
                      )}
                    </div>
                  </div>
                )}

                {/* Message Content */}
                {editingMessage?.id === msg.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveEdit}
                        disabled={isProcessing || !editingContent.trim()}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isProcessing}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {highlightSearchText(msg.content, searchQuery)}
                  </div>
                )}

                {/* Message Time */}
                {editingMessage?.id !== msg.id && (
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === "USER"
                        ? themeClasses.primaryText
                        : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

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
      <div className="border-t border-gray-200 p-4 bg-white">
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
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-transparent resize-none transition-colors ${themeClasses.focus}`}
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className={`px-6 py-3 ${themeClasses.primary} text-white rounded-lg ${themeClasses.primaryHover} focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.focus}`}
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

      {/* Delete Message Modal */}
      <ConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() =>
          showDeleteModal && handleDeleteMessage(showDeleteModal.id)
        }
        title="Delete Message"
        message={`Are you sure you want to delete this message? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isProcessing}
      />
    </div>
  );
}
