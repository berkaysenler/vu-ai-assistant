// src/lib/hooks/use-chats.ts (FIXED - Reliable initial message sending)
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

  // FIXED: Simple optimistic UI - show user message immediately
  const createNewChat = async (initialMessage?: string) => {
    try {
      console.log("Creating new chat with initial message:", initialMessage);

      // Step 1: Create the chat (with or without welcome message based on initial message)
      const requestBody = initialMessage
        ? { initialMessage: initialMessage.trim() }
        : {};

      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      const newChat = data.data.chat;
      console.log("New chat created:", newChat.id);

      // Step 2: Add to chats list immediately
      setChats((prev) => [newChat, ...prev]);

      // Step 3: If there's an initial message, show it immediately
      if (initialMessage && initialMessage.trim()) {
        console.log("Showing user message immediately:", initialMessage.trim());

        // Create optimistic user message
        const optimisticUserMessage: Message = {
          id: "temp-user-" + Date.now(),
          content: initialMessage.trim(),
          role: "USER",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Set active chat with user message immediately
        setActiveChat({
          ...newChat,
          messages: [optimisticUserMessage],
        });

        // Send message in background and update when ready
        setTimeout(async () => {
          try {
            const messageResponse = await fetch(
              `/api/chats/${newChat.id}/messages`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ message: initialMessage.trim() }),
              }
            );

            if (messageResponse.ok) {
              console.log("Message sent successfully, updating chat...");
              await fetchChat(newChat.id);
              await fetchChats();
            }
          } catch (error) {
            console.error("Error sending message:", error);
            await fetchChat(newChat.id);
          }
        }, 100);
      } else {
        // No initial message - fetch normally (will have welcome message)
        await fetchChat(newChat.id);
      }

      return newChat.id;
    } catch (err) {
      setError("An error occurred while creating chat");
      console.error("Create chat error:", err);
      return undefined;
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
      // FIXED: Use regular optimistic message (not temp-) for manual sending
      const userMessage: Message = {
        id: "optimistic-" + Date.now(), // Use different prefix to avoid confusion with quick actions
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
