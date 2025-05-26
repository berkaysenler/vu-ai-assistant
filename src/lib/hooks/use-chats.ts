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
  createNewChat: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

export function useChats(): UseChatsResult {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<ChatWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error when performing new actions
  const clearError = () => setError(null);

  // Fetch user's chats
  const fetchChats = async () => {
    try {
      clearError();
      console.log("Fetching chats...");

      const response = await fetch("/api/chats", {
        credentials: "include",
      });

      console.log("Chats response:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Chats data:", data);

        if (data.success) {
          setChats(data.data.chats);
          console.log("Chats set:", data.data.chats);
        } else {
          setError(data.message);
          console.error("Chats fetch failed:", data.message);
        }
      } else {
        const errorText = await response.text();
        console.error("Chats fetch error:", response.status, errorText);
        setError("Failed to fetch chats");
      }
    } catch (err) {
      setError("An error occurred while fetching chats");
      console.error("Fetch chats error:", err);
    }
  };

  // Fetch specific chat with messages
  const fetchChat = async (
    chatId: string
  ): Promise<ChatWithMessages | null> => {
    try {
      clearError();
      console.log("Fetching chat:", chatId);

      const response = await fetch(`/api/chats/${chatId}`, {
        credentials: "include",
      });

      console.log("Chat response:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Chat data:", data);

        if (data.success) {
          const chatWithMessages = data.data.chat;
          console.log("Chat with messages:", chatWithMessages);
          return chatWithMessages;
        } else {
          setError(data.message);
          console.error("Chat fetch failed:", data.message);
          return null;
        }
      } else {
        const errorText = await response.text();
        console.error("Chat fetch error:", response.status, errorText);
        setError("Failed to fetch chat");
        return null;
      }
    } catch (err) {
      setError("An error occurred while fetching chat");
      console.error("Fetch chat error:", err);
      return null;
    }
  };

  // Create new chat
  const createNewChat = async () => {
    try {
      setIsLoading(true);
      clearError();
      console.log("Creating new chat...");

      const response = await fetch("/api/chats", {
        method: "POST",
        credentials: "include",
      });

      console.log("Create chat response:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Create chat data:", data);

        if (data.success) {
          const newChat = data.data.chat;
          console.log("New chat created:", newChat);

          // Add to chats list
          setChats((prev) => [newChat, ...prev]);

          // Automatically select the new chat and fetch its messages
          await selectChat(newChat.id);
        } else {
          setError(data.message);
          console.error("Create chat failed:", data.message);
        }
      } else {
        const errorText = await response.text();
        console.error("Create chat error:", response.status, errorText);
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
      console.log("Selecting chat:", chatId);
      clearError();

      const chatWithMessages = await fetchChat(chatId);
      if (chatWithMessages) {
        setActiveChat(chatWithMessages);
        console.log("Active chat set:", chatWithMessages);
      }
    } catch (err) {
      console.error("Select chat error:", err);
      setError("Failed to select chat");
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    try {
      clearError();
      console.log("Deleting chat:", chatId);

      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Delete chat response:", response.status, response.ok);

      if (response.ok) {
        // Remove from chats list
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));

        // If deleted chat was active, clear active chat
        if (activeChat?.id === chatId) {
          setActiveChat(null);
        }

        console.log("Chat deleted successfully");
      } else {
        const errorText = await response.text();
        console.error("Delete chat error:", response.status, errorText);
        setError("Failed to delete chat");
      }
    } catch (err) {
      setError("An error occurred while deleting chat");
      console.error("Delete chat error:", err);
    }
  };

  // Send message to active chat
  const sendMessage = async (message: string) => {
    if (!activeChat) {
      setError("No active chat selected");
      return;
    }

    try {
      clearError();
      console.log("Sending message to chat:", activeChat.id, message);

      const response = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: message }),
      });

      console.log("Send message response:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Send message data:", data);

        if (data.success) {
          // Add the new messages to the active chat
          const { userMessage, aiMessage } = data.data;
          setActiveChat((prev) => {
            if (!prev) return null;
            const updated = {
              ...prev,
              messages: [...prev.messages, userMessage, aiMessage],
            };
            console.log("Updated active chat with new messages:", updated);
            return updated;
          });

          // Refresh chats list to update the timestamp and possibly name
          await fetchChats();
        } else {
          setError(data.message);
          console.error("Send message failed:", data.message);
        }
      } else {
        const errorText = await response.text();
        console.error("Send message error:", response.status, errorText);
        setError("Failed to send message");
      }
    } catch (err) {
      setError("An error occurred while sending message");
      console.error("Send message error:", err);
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
      console.log("Initial chats load...");
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
    sendMessage,
    refreshChats,
  };
}
