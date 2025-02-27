import React from 'react';
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import { RiChat1Line } from 'react-icons/ri';

interface Chat {
  id: string;
  name: string;
  messages: { type: 'user' | 'bot'; content: string }[];
  agentType: 'multi' | 'web' | 'db';
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat;
  setCurrentChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  createNewChat: () => void;
  isSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChat,
  setCurrentChat,
  deleteChat,
  createNewChat,
  isSidebarOpen,
  toggleLeftSidebar
}) => {
  return (
    <aside 
      id="chat-sidebar"
      className={`
        w-[260px] h-[calc(100vh-62px)] bg-white
        transform transition-all duration-300 ease-in-out
        fixed left-0 top-[62px]
        ${isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}
        border-r z-40 overflow-hidden
      `}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Sohbet Geçmişi</h2>
            <button
              onClick={toggleLeftSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaTimes size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`
                group rounded-lg transition-colors duration-200
                ${currentChat.id === chat.id 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="w-full flex items-center px-3 py-3 text-gray-700">
                <RiChat1Line size={18} className="mr-3 flex-shrink-0" />
                <span 
                  onClick={() => setCurrentChat(chat)}
                  className="text-sm truncate flex-1 text-left cursor-pointer"
                >
                  {chat.name}
                </span>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                  title="Sohbeti Sil"
                >
                  <FaTrash size={12} className="text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Chat Button at Bottom of Sidebar */}
        <div className="p-3 border-t bg-white">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus size={14} />
            <span>Yeni Sohbet</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
