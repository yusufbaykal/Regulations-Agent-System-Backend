import React from 'react';
import { IoSend } from 'react-icons/io5';
import AgentSelector from '../agent_selector';
import { AgentType } from '../types';

interface WelcomeScreenProps {
  question: string;
  setQuestion: (question: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  currentAgentType: AgentType;
  handleAgentChange: (agent: AgentType) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  question, 
  setQuestion, 
  handleSubmit, 
  currentAgentType,
  handleAgentChange
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Üniversite Yönetmelikleri Danışmanı
          </h2>
          <p className="text-gray-600 text-lg">
          </p>
        </div>
        
        {/* Agent Selection - Improved styling */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <AgentSelector 
            selectedAgent={currentAgentType} 
            onSelectAgent={handleAgentChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Sorunuzu yazın..."
              className="w-full p-4 pr-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <IoSend size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
