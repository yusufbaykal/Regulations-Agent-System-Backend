import React from 'react';
import { FaGithub, FaLinkedin, FaPen, FaListAlt } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import { LuPanelLeft } from 'react-icons/lu';

interface NavBarProps {
  toggleLeftSidebar: () => void;
  createNewChat: () => void;
  toggleExamplesSidebar: () => void;
  isSidebarOpen: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ 
  toggleLeftSidebar, 
  createNewChat, 
  toggleExamplesSidebar,
  isSidebarOpen 
}) => {
  return (
    <nav id="nav-bar" className="h-[62px] bg-white border-r border-b flex flex-row items-center px-4 z-50 shadow-sm fixed left-0 top-0 w-full">
      <div className="flex items-center gap-6">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleLeftSidebar}
          className={`w-[54px] h-[54px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ${isSidebarOpen ? 'bg-gray-100' : ''}`}
          title="Sohbet Listesini Aç/Kapat"
        >
          <LuPanelLeft 
            size={28} 
            className={`text-gray-700 transition-transform duration-200 ${
              isSidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="w-[54px] h-[54px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Yeni Sohbet Başlat"
        >
          <FaPen size={25} className="text-gray-700" />
          <span className="absolute top-14 bg-white shadow-lg text-gray-700 px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border">
            Yeni Sohbet
          </span>
        </button>
        
        {/* Example Questions Button */}
        <button
          id="examples-button"
          onClick={toggleExamplesSidebar}
          className="w-[54px] h-[54px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group relative"
          title="Örnek Sorular"
        >
          <FaListAlt size={25} className="text-gray-700" />
          <span className="absolute top-14 bg-white shadow-lg text-gray-700 px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border">
            Örnek Sorular
          </span>
        </button>
      </div>
      
      {/* Social Media Links */}
      <div className="flex items-center gap-3 ml-auto">
        <a href="https://github.com/yusufbaykaloglu" target="_blank" rel="noopener noreferrer" 
           className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <FaGithub size={20} />
        </a>
        <a href="https://www.linkedin.com/in/yusuf-baykaloglu/" target="_blank" rel="noopener noreferrer"
           className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <FaLinkedin size={20} />
        </a>
        <a href="https://huggingface.co/yusufbaykaloglu" target="_blank" rel="noopener noreferrer"
           className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <SiHuggingface size={20} className="text-gray-800" />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
