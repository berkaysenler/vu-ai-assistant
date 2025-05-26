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
        <ChatInterface chat={activeChat} onSendMessage={sendMessage} />
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No chat selected. Please select a chat from the sidebar.
        </div>
      )}
    </DashboardLayout>
  );
}
