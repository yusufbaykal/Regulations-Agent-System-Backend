import React from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

interface ExampleQuestions {
  [university: string]: string[];
}

interface ExamplesSidebarProps {
  exampleQuestions: ExampleQuestions;
  expandedUniversity: string | null;
  setExpandedUniversity: (university: string | null) => void;
  handleExampleClick: (example: string) => void;
  isExamplesOpen: boolean;
  toggleExamplesSidebar: () => void;
}

const ExamplesSidebar: React.FC<ExamplesSidebarProps> = ({
  exampleQuestions,
  expandedUniversity,
  setExpandedUniversity,
  handleExampleClick,
  isExamplesOpen,
  toggleExamplesSidebar
}) => {
  return (
    <aside
      id="examples-sidebar" 
      className={`
        fixed left-0 top-[62px] h-[calc(100vh-62px)]
        w-[320px] bg-white border-r border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isExamplesOpen ? 'translate-x-0' : '-translate-x-full'}
        z-30 overflow-y-auto
      `}
    >
      <div className="p-4">
        <div className="mb-6 sticky top-0 bg-white z-10 pb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Örnek Sorular</h2>
          <button 
            onClick={toggleExamplesSidebar}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <FaTimes size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(exampleQuestions).map(([university, questions]) => (
            <div key={university} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <button
                onClick={() => setExpandedUniversity(
                  expandedUniversity === university ? null : university
                )}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-700">{university}</span>
                <FaChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    expandedUniversity === university ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div className={`
                overflow-hidden transition-all duration-300
                ${expandedUniversity === university ? 'max-h-96' : 'max-h-0'}
              `}>
                <div className="p-4 space-y-2 bg-gray-50">
                  {questions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(`${university} - ${q}`)}
                      className="w-full text-left p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ExamplesSidebar;
