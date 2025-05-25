import { useState, useEffect } from "react";

interface Chat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: string;
  updatedAt: string;
}

interface ChatWithMessages extends Chat {
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
  refreshChats: () => Promise<void>;
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

  // Create new chat
  const createNewChat = async () => {
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
    refreshChats,
  };
}
