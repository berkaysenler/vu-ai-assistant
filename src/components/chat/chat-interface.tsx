// src/components/chat/chat-interface.tsx (COMPLETE - Fixed all errors)
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatWithMessages, Message } from "@/lib/hooks/use-chats";
import { useUser } from "@/lib/hooks/use-user";
import { useTheme } from "@/lib/context/theme-context";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

interface ChatInterfaceProps {
  chat: ChatWithMessages;
  onSendMessage: (message: string) => Promise<void>;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onRenameChat?: (newName: string) => Promise<void>;
  onSearchInChat?: (query: string) => void;
  searchQuery?: string;
  filteredMessages?: Message[];
}

export function ChatInterface({
  chat,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onRenameChat,
  onSearchInChat,
  searchQuery = "",
  filteredMessages,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<Message | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { getThemeClasses } = useTheme();

  const themeClasses = getThemeClasses();

  // Use filtered messages if provided, otherwise use all messages
  const displayMessages = filteredMessages || chat.messages;

  // Auto-scroll to bottom when new messages arrive, but not on initial load
  useEffect(() => {
    // Only auto-scroll if we're already near the bottom or if a new message was just added
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      // Auto-scroll only if user is near bottom (not if they've scrolled up to read old messages)
      if (isNearBottom || isSending) {
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        }, 100);
      }
    }
  }, [chat.messages.length, isSending]);

  // Initial scroll to bottom when component mounts or chat changes
  useEffect(() => {
    if (messagesContainerRef.current && displayMessages.length > 0) {
      // Scroll to bottom immediately without animation when chat first loads
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chat.id]); // Trigger when chat changes

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
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900/40 text-gray-900 dark:text-yellow-200 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className={`flex flex-col h-full ${themeClasses.background}`}>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 chat-messages"
      >
        {displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-8">
              {searchQuery ? (
                <div>
                  <svg
                    className={`w-12 h-12 mx-auto mb-3 ${themeClasses.textMuted}`}
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
                  <p className={themeClasses.textMuted}>
                    No messages found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => onSearchInChat && onSearchInChat("")}
                    className={`${themeClasses.primaryText} hover:underline text-sm mt-2`}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <p className={themeClasses.textMuted}>
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="space-y-6">
              {displayMessages.map((msg) => (
                <div
                  key={msg.id}
                  id={`message-${msg.id}`}
                  className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"} group`}
                >
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 relative ${
                      msg.role === "USER"
                        ? `${themeClasses.primary} text-white shadow-md`
                        : `${themeClasses.card} ${themeClasses.text} shadow-sm`
                    }`}
                  >
                    {/* Message Actions (only for user messages) */}
                    {msg.role === "USER" &&
                      (onEditMessage || onDeleteMessage) && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            {onEditMessage && (
                              <button
                                onClick={() => startEditing(msg)}
                                className="p-1 bg-gray-800 dark:bg-gray-600 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors shadow-md"
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
                                className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
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
                      <div className="space-y-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className={`w-full p-3 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} resize-none`}
                          rows={3}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEdit}
                            disabled={isProcessing || !editingContent.trim()}
                            className={`px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.primaryFocus}`}
                          >
                            {isProcessing ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isProcessing}
                            className={`px-3 py-1 ${themeClasses.backgroundTertiary} ${themeClasses.text} text-sm rounded ${themeClasses.hover} transition-colors disabled:opacity-50`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {highlightSearchText(msg.content, searchQuery)}
                      </div>
                    )}

                    {/* Message Time */}
                    {editingMessage?.id !== msg.id && (
                      <div
                        className={`text-xs mt-2 ${
                          msg.role === "USER"
                            ? "text-white/70"
                            : themeClasses.textMuted
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator when sending */}
            {isSending && (
              <div className="flex justify-start">
                <div
                  className={`${themeClasses.card} max-w-2xl rounded-lg px-4 py-3 shadow-sm`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className={`w-2 h-2 ${themeClasses.primaryText.replace("text-", "bg-")} rounded-full animate-bounce`}
                      ></div>
                      <div
                        className={`w-2 h-2 ${themeClasses.primaryText.replace("text-", "bg-")} rounded-full animate-bounce`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 ${themeClasses.primaryText.replace("text-", "bg-")} rounded-full animate-bounce`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className={`text-sm ${themeClasses.textMuted}`}>
                      VU Assistant is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div
        className={`${themeClasses.borderLight} border-t p-4 ${themeClasses.background}`}
      >
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
              className={`w-full px-4 py-3 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} resize-none transition-colors placeholder:${themeClasses.textMuted} shadow-sm`}
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className={`px-6 py-3 ${themeClasses.primary} text-white rounded-lg ${themeClasses.primaryHover} ${themeClasses.primaryFocus} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
            )}
          </button>
        </form>

        <div
          className={`flex items-center justify-between mt-2 text-xs ${themeClasses.textMuted}`}
        >
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span
            className={
              message.length > 450 ? "text-orange-500 dark:text-orange-400" : ""
            }
          >
            {message.length}/500
          </span>
        </div>
      </div>

      {/* Custom Delete Message Modal */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() =>
          showDeleteModal && handleDeleteMessage(showDeleteModal.id)
        }
        title="Delete Message"
        description="Are you sure you want to delete this message?"
        itemName={
          showDeleteModal ? truncateMessage(showDeleteModal.content) : undefined
        }
        confirmText="Delete Message"
        isLoading={isProcessing}
        requiresTyping={false} // Don't require typing for message deletion
      />
    </div>
  );
}
