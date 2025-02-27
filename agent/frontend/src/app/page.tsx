'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Jost } from 'next/font/google';

// Import components
import NavBar from '../components/navigation/nav_bar';
import ChatSidebar from '../components/sidebars/chat_sidebar';
import ExamplesSidebar from '../components/sidebars/examples_sidebar';
import MessageList from '../components/chat/message_list';
import InputArea from '../components/chat/input_area';
import NewChatModal from '../components/modals/new_chat_modal';
import FloatingActionButtons from '../components/buttons/floating_action_buttons';
import WelcomeScreen from '../components/welcome/welcome_screen';
import AgentSelector from '../components/agent_selector';

// Import types
import { Chat, Message, ExampleQuestions, AgentType } from '../components/types';

const exampleQuestions: ExampleQuestions = {
  'Acıbadem Üniversitesi': [
    "Yüksek lisans başvuru şartları nelerdir?",
    "Tıp Fakültesi yatay geçiş koşulları nelerdir?",
  ],
  'İstanbul Teknik Üniversitesi': [
    "Çift anadal programı başvuru koşulları nelerdir?",
    "Yaz okulu başvuru tarihleri ne zamandır?",
  ],
  'Boğaziçi Üniversitesi': [
    "Erasmus programına başvuru için gerekli belgeler nelerdir?",
    "Yurt başvurusu için gerekli şartlar nelerdir?",
  ],
  'Orta Doğu Teknik Üniversitesi': [
    "Burslu öğrenci kontenjanları nelerdir?",
    "Uzaktan eğitim programları hangileridir?",
  ]
};

const font = Jost({ subsets: ['latin'] });

export default function Home() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [expandedUniversity, setExpandedUniversity] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', name: 'Yeni Sohbet', messages: [], agentType: 'multi' }
  ]);
  const [currentChat, setCurrentChat] = useState<Chat>(chats[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [isScrollDetected, setIsScrollDetected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Monitor scroll position for showing/hiding the scroll to top button and floating action buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollToTopButton(scrollPosition > 300);
      setIsScrollDetected(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat.messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.getElementById('chat-sidebar');
      const navBar = document.getElementById('nav-bar');
      
      if (isSidebarOpen && 
          sidebar && 
          !sidebar.contains(target) && 
          navBar && 
          !navBar.contains(target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const examplesSidebar = document.getElementById('examples-sidebar');
      const examplesButton = document.getElementById('examples-button');
      
      if (isExamplesOpen && 
          examplesSidebar && 
          !examplesSidebar.contains(target) && 
          examplesButton && 
          !examplesButton.contains(target)) {
        setIsExamplesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExamplesOpen]);

  // Fix: Ensure only one sidebar is open at a time
  const toggleLeftSidebar = () => {
    if (isExamplesOpen) setIsExamplesOpen(false);
    if (isNewChatOpen) setIsNewChatOpen(false);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleExamplesSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
    if (isNewChatOpen) setIsNewChatOpen(false);
    setIsExamplesOpen(!isExamplesOpen);
  };

  const openNewChatModal = () => {
    setIsSidebarOpen(false);
    setIsExamplesOpen(false);
    setIsNewChatOpen(true);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const newUserMessage: Message = { type: 'user', content: question };
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newUserMessage]
    };
    updateChat(updatedChat);
    setQuestion('');
    setLoading(true);
    setIsExamplesOpen(false);
    setIsSidebarOpen(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ask`,
        { question, agent_type: currentChat.agentType },
        { signal: abortControllerRef.current.signal }
      );
      const newBotMessage: Message = { type: 'bot', content: response.data.answer };
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, newBotMessage]
      };
      updateChat(finalChat);
    } catch (error) {
      if (!axios.isCancel(error)) {
        const errorMessage: Message = {
          type: 'bot',
          content: 'Bir hata oluştu. Lütfen tekrar deneyin.'
        };
        const finalChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, errorMessage]
        };
        updateChat(finalChat);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const updateChat = (updatedChat: Chat) => {
    setCurrentChat(updatedChat);
    setChats(chats.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: 'Yeni Sohbet',
      messages: [],
      agentType: 'multi'
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setQuestion('');
    
    // Close all modals/sidebars when creating a new chat
    setIsNewChatOpen(false);
    setIsExamplesOpen(false);
    
    // Only open sidebar if we're on mobile or it was previously closed
    // This prevents sidebar from closing if it was already open
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    
    cancelRequest();
  };

  const deleteChat = (chatId: string) => {
    const newChats = chats.filter(chat => chat.id !== chatId);
    if (newChats.length === 0) {
      const newChat: Chat = { id: Date.now().toString(), name: 'Yeni Sohbet', messages: [], agentType: 'multi' };
      setChats([newChat]);
      setCurrentChat(newChat);
    } else {
      setChats(newChats);
      if (currentChat.id === chatId) {
        setCurrentChat(newChats[0]);
      }
    }
    setQuestion('');
    cancelRequest();
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setIsExamplesOpen(false);
  };

  // Agent selection handler
  const handleAgentChange = (agent: AgentType) => {
    const updatedChat = { ...currentChat, agentType: agent };
    updateChat(updatedChat);
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Navigation - UPDATED: Horizontal layout at the top left */}
      <div className="flex h-full relative">
        {/* Fixed Navigation Bar - UPDATED: horizontal layout, larger icons */}
        <NavBar
          isSidebarOpen={isSidebarOpen}
          toggleLeftSidebar={toggleLeftSidebar}
          createNewChat={createNewChat}
          toggleExamplesSidebar={toggleExamplesSidebar}
        />

        {/* Sliding Chat History Panel - Adjusted position to be below the navbar */}
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          toggleLeftSidebar={toggleLeftSidebar}
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          deleteChat={deleteChat}
          createNewChat={createNewChat}
        />
        
        {/* Example Questions Panel - MOVED from right side to left side */}
        <ExamplesSidebar
          isExamplesOpen={isExamplesOpen}
          toggleExamplesSidebar={toggleExamplesSidebar}
          exampleQuestions={exampleQuestions}
          expandedUniversity={expandedUniversity}
          setExpandedUniversity={setExpandedUniversity}
          handleExampleClick={handleExampleClick}
        />
      </div>

      {/* Main Content Area - Adjusted to account for top navbar */}
      <div className="flex-1 flex flex-col mt-[62px]">
        {/* Removed the old header since nav is now at the top */}
        
        {currentChat.messages.length === 0 ? (
          <WelcomeScreen
            question={question}
            setQuestion={setQuestion}
            handleSubmit={handleSubmit}
            currentAgentType={currentChat.agentType}
            handleAgentChange={handleAgentChange}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Chat Messages Area */}
            <MessageList messages={currentChat.messages} />

            {/* Agent Selector moved here - after chat messages */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 sticky bottom-[64px] z-10">
              <div className="max-w-3xl mx-auto">
                <AgentSelector 
                  selectedAgent={currentChat.agentType} 
                  onSelectAgent={handleAgentChange} 
                />
              </div>
            </div>

            {/* Input Area */}
            <InputArea
              question={question}
              setQuestion={setQuestion}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Mobile Overlay for both sidebars */}
      {(isSidebarOpen || isExamplesOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsExamplesOpen(false);
          }}
        />
      )}

      {/* Yeni Sohbet Modal - Fixed prop issue */}
      <NewChatModal
        isNewChatOpen={isNewChatOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        createNewChat={createNewChat}
      />

      {/* Floating Action Buttons - No changes */}
      {isScrollDetected && (
        <FloatingActionButtons
          isScrollDetected={isScrollDetected}
          showScrollToTopButton={showScrollToTopButton}
          createNewChat={createNewChat}
          toggleExamplesSidebar={toggleExamplesSidebar}
          scrollToTop={scrollToTop}
        />
      )}
    </div>
  );
}