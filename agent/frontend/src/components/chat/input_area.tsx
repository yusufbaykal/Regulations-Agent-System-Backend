import React from 'react';
import { IoSend } from 'react-icons/io5';

interface InputAreaProps {
  question: string;
  setQuestion: (question: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ question, setQuestion, handleSubmit, loading }) => {
  return (
    <div className="bg-white border-t p-4 sticky bottom-0 z-20">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Sorunuzu yazın..."
            className="w-full p-4 pr-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <IoSend size={24} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;
