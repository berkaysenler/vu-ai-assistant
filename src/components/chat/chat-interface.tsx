// src/components/chat/chat-interface.tsx (FIXED - Typewriter loop issue)
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

// Typewriter Hook
function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayText("");

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      clearInterval(timer);
      setIsTyping(false);
    };
  }, [text, speed]);

  return { displayText, isTyping };
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

  // FIXED: Better typewriter state management - only for truly NEW messages
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [previousMessagesLength, setPreviousMessagesLength] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { getThemeClasses } = useTheme();

  const themeClasses = getThemeClasses();

  // Use filtered messages if provided, otherwise use all messages
  const displayMessages = filteredMessages || chat.messages;

  // FIXED: Only trigger typewriter for newly ADDED AI messages (not when switching chats)
  useEffect(() => {
    // If this is initial load or we're switching chats, don't trigger typewriter
    if (!initialLoadComplete) {
      setPreviousMessagesLength(displayMessages.length);
      setInitialLoadComplete(true);
      return;
    }

    // Only trigger if new messages were actually added (not just switching chats)
    if (displayMessages.length > previousMessagesLength) {
      const newMessages = displayMessages.slice(previousMessagesLength);
      const lastNewMessage = newMessages[newMessages.length - 1];

      // Only trigger typewriter for new ASSISTANT messages
      if (
        lastNewMessage &&
        lastNewMessage.role === "ASSISTANT" &&
        !lastNewMessage.id.startsWith("temp-") &&
        typingMessageId !== lastNewMessage.id
      ) {
        console.log(
          "Starting typewriter for newly added message:",
          lastNewMessage.id
        );
        setTypingMessageId(lastNewMessage.id);
      }
    }

    // Update previous length for next comparison
    setPreviousMessagesLength(displayMessages.length);
  }, [displayMessages, initialLoadComplete]);

  // FIXED: Reset state when chat changes (but don't trigger typewriter for existing messages)
  useEffect(() => {
    setTypingMessageId(null);
    setPreviousMessagesLength(0);
    setInitialLoadComplete(false);
  }, [chat.id]);

  // Auto-scroll to bottom when new messages arrive or during typing
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      if (isNearBottom || isSending || typingMessageId) {
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
  }, [chat.messages.length, isSending, typingMessageId]);

  // Initial scroll to bottom when component mounts or chat changes
  useEffect(() => {
    if (messagesContainerRef.current && displayMessages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chat.id]);

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

  // Check if we should show the AI thinking indicator
  const shouldShowThinking = () => {
    if (displayMessages.length === 0) return false;
    if (isSending) return false;
    const lastMessage = displayMessages[displayMessages.length - 1];
    return lastMessage.role === "USER" && lastMessage.id.startsWith("temp-");
  };

  // FIXED: TypewriterMessage component with better completion handling
  const TypewriterMessage = ({ message: msg }: { message: Message }) => {
    const shouldType = msg.id === typingMessageId;
    const { displayText, isTyping } = useTypewriter(
      shouldType ? msg.content : msg.content,
      shouldType ? 25 : 0
    );

    // FIXED: Clear typing state when animation completes
    useEffect(() => {
      if (
        shouldType &&
        !isTyping &&
        displayText === msg.content &&
        typingMessageId === msg.id
      ) {
        console.log("Typewriter completed for message:", msg.id);
        // Use setTimeout to prevent state update during render
        setTimeout(() => {
          setTypingMessageId(null);
        }, 100);
      }
    }, [shouldType, isTyping, displayText, msg.content, msg.id]);

    return (
      <div className="whitespace-pre-wrap break-words leading-relaxed text-lg">
        {shouldType ? (
          <>
            {highlightSearchText(displayText, searchQuery)}
            {isTyping && (
              <span
                className={`inline-block w-2 h-5 ${themeClasses.primaryText.replace("text-", "bg-")} ml-1 animate-pulse`}
              />
            )}
          </>
        ) : (
          highlightSearchText(msg.content, searchQuery)
        )}
      </div>
    );
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
                  <p className={`${themeClasses.textMuted} text-lg`}>
                    No messages found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => onSearchInChat && onSearchInChat("")}
                    className={`${themeClasses.primaryText} hover:underline text-base mt-2`}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <p className={`${themeClasses.textMuted} text-lg`}>
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="space-y-4">
              {displayMessages.map((msg) => (
                <div
                  key={msg.id}
                  id={`message-${msg.id}`}
                  className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"} group`}
                >
                  {/* Both USER and ASSISTANT messages now use bubbles */}
                  <div className="max-w-3xl w-full flex items-start space-x-3">
                    {/* Assistant Avatar */}
                    {msg.role === "ASSISTANT" && (
                      <div
                        className={`w-8 h-8 ${themeClasses.primary} rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1`}
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`flex-1 ${msg.role === "USER" ? "flex justify-end" : ""}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`relative rounded-2xl px-5 py-4 shadow-sm max-w-2xl ${
                          msg.role === "USER"
                            ? `${themeClasses.primary} text-white ml-auto`
                            : `${themeClasses.backgroundSecondary} ${themeClasses.text} border ${themeClasses.borderLight}`
                        }`}
                      >
                        {/* Message Actions (only for user messages and not temporary) */}
                        {msg.role === "USER" &&
                          !msg.id.startsWith("temp-") &&
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

                        {/* Message Content - Use TypewriterMessage for AI responses */}
                        {editingMessage?.id === msg.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              className={`w-full p-3 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} resize-none text-lg`}
                              rows={3}
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                disabled={
                                  isProcessing || !editingContent.trim()
                                }
                                className={`px-3 py-1 bg-green-600 text-white text-base rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.primaryFocus}`}
                              >
                                {isProcessing ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEditing}
                                disabled={isProcessing}
                                className={`px-3 py-1 ${themeClasses.backgroundTertiary} ${themeClasses.text} text-base rounded ${themeClasses.hover} transition-colors disabled:opacity-50`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : msg.role === "ASSISTANT" ? (
                          <TypewriterMessage message={msg} />
                        ) : (
                          <div className="whitespace-pre-wrap break-words leading-relaxed text-lg">
                            {highlightSearchText(msg.content, searchQuery)}
                          </div>
                        )}

                        {/* Message Time (not for temporary messages) */}
                        {editingMessage?.id !== msg.id &&
                          !msg.id.startsWith("temp-") && (
                            <div
                              className={`text-sm mt-3 ${
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

                    {/* User Avatar */}
                    {msg.role === "USER" && (
                      <div
                        className={`w-8 h-8 ${themeClasses.primary} rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1`}
                      >
                        <span className="text-white font-semibold text-base">
                          {user?.displayName?.charAt(0).toUpperCase() ||
                            user?.fullName?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Thinking Indicator */}
            {shouldShowThinking() && (
              <div className="flex justify-start">
                <div className="max-w-3xl w-full flex items-start space-x-3">
                  {/* Assistant Avatar */}
                  <div
                    className={`w-8 h-8 ${themeClasses.primary} rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>

                  <div
                    className={`${themeClasses.backgroundSecondary} border ${themeClasses.borderLight} rounded-2xl px-5 py-4 shadow-sm`}
                  >
                    <div className="flex items-center space-x-3">
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
                      <span className={`text-base ${themeClasses.textMuted}`}>
                        VU Assistant is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator when sending regular messages */}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-3xl w-full flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 ${themeClasses.primary} rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>

                  <div
                    className={`${themeClasses.backgroundSecondary} border ${themeClasses.borderLight} rounded-2xl px-5 py-4 shadow-sm`}
                  >
                    <div className="flex items-center space-x-3">
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
                      <span className={`text-base ${themeClasses.textMuted}`}>
                        VU Assistant is typing...
                      </span>
                    </div>
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
              className={`w-full px-4 py-3 ${themeClasses.border} border rounded-lg ${themeClasses.background} ${themeClasses.text} ${themeClasses.primaryFocus} resize-none transition-colors placeholder:${themeClasses.textMuted} shadow-sm text-lg leading-relaxed`}
              rows={1}
              style={{ minHeight: "52px", maxHeight: "140px" }}
              disabled={isSending}
              maxLength={500}
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
          className={`flex items-center justify-between mt-2 text-sm ${themeClasses.textMuted}`}
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
        requiresTyping={false}
      />
    </div>
  );
}
