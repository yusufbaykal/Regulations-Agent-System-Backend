import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface NewChatModalProps {
  isNewChatOpen: boolean;
  setIsNewChatOpen: (isOpen: boolean) => void;
  createNewChat: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ 
  isNewChatOpen, 
  setIsNewChatOpen, 
  createNewChat 
}) => {
  if (!isNewChatOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" 
           onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Yeni Sohbet</h2>
          <button
            onClick={() => setIsNewChatOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Yeni bir sohbet başlatmak istediğinize emin misiniz?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsNewChatOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => {
              createNewChat();
              setIsNewChatOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
