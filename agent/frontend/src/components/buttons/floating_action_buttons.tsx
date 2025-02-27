import React from 'react';
import { FaPlus, FaLightbulb, FaChevronDown } from 'react-icons/fa';

interface FloatingActionButtonsProps {
  isScrollDetected: boolean;
  showScrollToTopButton: boolean;
  createNewChat: () => void;
  toggleExamplesSidebar: () => void;
  scrollToTop: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  isScrollDetected,
  showScrollToTopButton,
  createNewChat,
  toggleExamplesSidebar,
  scrollToTop
}) => {
  if (!isScrollDetected) return null;
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
      {/* New Chat Floating Button */}
      <button
        onClick={createNewChat}
        className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        title="Yeni Sohbet"
      >
        <FaPlus size={20} />
      </button>
      
      {/* Example Questions Floating Button */}
      <button
        onClick={toggleExamplesSidebar}
        className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        title="Örnek Sorular"
      >
        <FaLightbulb size={20} />
      </button>
      
      {/* Scroll to Top Button */}
      {showScrollToTopButton && (
        <button
          onClick={scrollToTop}
          className="bg-gray-700 hover:bg-gray-800 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="Yukarı Çık"
        >
          <FaChevronDown className="rotate-180" size={20} />
        </button>
      )}
    </div>
  );
};

export default FloatingActionButtons;
