// src/lib/hooks/use-chats.ts (UPDATED - REPLACE YOUR EXISTING FILE)
import { useState, useEffect } from "react";

export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: string;
  updatedAt: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

interface UseChatsResult {
  chats: Chat[];
  activeChat: ChatWithMessages | null;
  isLoading: boolean;
  error: string | null;
  createNewChat: (initialMessage?: string) => Promise<string | undefined>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newName: string) => Promise<void>;
  refreshChats: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export function useChats(): UseChatsResult {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<ChatWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChats(data.data.chats);
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to fetch chats");
      }
    } catch (err) {
      setError("An error occurred while fetching chats");
      console.error("Fetch chats error:", err);
    }
  };

  // Fetch specific chat with messages
  const fetchChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveChat(data.data.chat);
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to fetch chat");
      }
    } catch (err) {
      setError("An error occurred while fetching chat");
      console.error("Fetch chat error:", err);
    }
  };

  // Create new chat with optional initial message
  const createNewChat = async (initialMessage?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chats", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newChat = data.data.chat;
          // Add to chats list
          setChats((prev) => [newChat, ...prev]);
          // Automatically select the new chat
          await selectChat(newChat.id);

          // If there's an initial message, send it
          if (initialMessage && initialMessage.trim()) {
            // Wait a moment for the chat to be properly selected
            setTimeout(async () => {
              try {
                await sendMessage(initialMessage.trim());
              } catch (err) {
                console.error("Error sending initial message:", err);
              }
            }, 500);
          }

          // Return the new chat ID so it can be used for navigation
          return newChat.id;
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to create chat");
      }
    } catch (err) {
      setError("An error occurred while creating chat");
      console.error("Create chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a chat
  const selectChat = async (chatId: string) => {
    try {
      // If chat is already selected, don't fetch again but still allow URL updates
      if (activeChat?.id === chatId) {
        console.log("Chat already selected, skipping API call");
        return Promise.resolve(); // Return resolved promise for consistency
      }

      await fetchChat(chatId);
    } catch (err) {
      console.error("Select chat error:", err);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Remove from chats list
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));

        // If deleted chat was active, clear active chat
        if (activeChat?.id === chatId) {
          setActiveChat(null);
        }
      } else {
        setError("Failed to delete chat");
      }
    } catch (err) {
      setError("An error occurred while deleting chat");
      console.error("Delete chat error:", err);
    }
  };

  // Rename a chat
  const renameChat = async (chatId: string, newName: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedChat = data.data.chat;

          // Update in chats list
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    name: updatedChat.name,
                    updatedAt: updatedChat.updatedAt,
                  }
                : chat
            )
          );

          // Update active chat if it's the one we renamed
          if (activeChat?.id === chatId) {
            setActiveChat((prev) =>
              prev
                ? {
                    ...prev,
                    name: updatedChat.name,
                    updatedAt: updatedChat.updatedAt,
                  }
                : null
            );
          }
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to rename chat");
      }
    } catch (err) {
      setError("An error occurred while renaming chat");
      console.error("Rename chat error:", err);
    }
  };

  // Send message to active chat
  const sendMessage = async (message: string) => {
    if (!activeChat) {
      setError("No active chat selected");
      return;
    }

    try {
      // Optimistically add user message to UI
      const userMessage: Message = {
        id: "temp-" + Date.now(),
        content: message,
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setActiveChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, userMessage],
            }
          : null
      );

      // Send message to API
      const response = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        // Refresh the chat to get the AI response
        await fetchChat(activeChat.id);
        // Also refresh the chats list to update the "updated at" time
        await fetchChats();
      } else {
        setError("Failed to send message");
        // Remove the optimistic message on error
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.filter(
                  (msg) => msg.id !== userMessage.id
                ),
              }
            : null
        );
      }
    } catch (err) {
      setError("An error occurred while sending message");
      console.error("Send message error:", err);
    }
  };

  // Edit a message
  const editMessage = async (messageId: string, newContent: string) => {
    if (!activeChat) {
      setError("No active chat selected");
      return;
    }

    try {
      const response = await fetch(
        `/api/chats/${activeChat.id}/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedMessage = data.data.message;

          // Update the message in active chat
          setActiveChat((prev) =>
            prev
              ? {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          content: updatedMessage.content,
                          updatedAt: updatedMessage.updatedAt,
                        }
                      : msg
                  ),
                }
              : null
          );

          // Refresh chats list to update timestamp
          await fetchChats();
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to edit message");
      }
    } catch (err) {
      setError("An error occurred while editing message");
      console.error("Edit message error:", err);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!activeChat) {
      setError("No active chat selected");
      return;
    }

    try {
      const response = await fetch(
        `/api/chats/${activeChat.id}/messages/${messageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Remove the message from active chat
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.filter((msg) => msg.id !== messageId),
              }
            : null
        );

        // Refresh chats list to update timestamp
        await fetchChats();
      } else {
        setError("Failed to delete message");
      }
    } catch (err) {
      setError("An error occurred while deleting message");
      console.error("Delete message error:", err);
    }
  };

  // Refresh chats list
  const refreshChats = async () => {
    setIsLoading(true);
    await fetchChats();
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    const loadChats = async () => {
      await fetchChats();
      setIsLoading(false);
    };

    loadChats();
  }, []);

  return {
    chats,
    activeChat,
    isLoading,
    error,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    refreshChats,
    sendMessage,
    editMessage,
    deleteMessage,
  };
}
