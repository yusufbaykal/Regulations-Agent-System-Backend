import React from 'react';

type AgentType = 'multi' | 'web' | 'db';

interface AgentSelectorProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onSelectAgent }) => {
  const agents = [
    { 
      id: 'multi', 
      name: 'Multi-Agent', 
      description: '', 
      badge: 'Önerilen' 
    },
    { 
      id: 'web', 
      name: 'Web Agent', 
      description: '' 
    },
    { 
      id: 'db', 
      name: 'Database Agent', 
      description: '' 
    }
  ];

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-sm font-medium text-gray-700 mb-2 px-1">Agent Seçimi</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id as AgentType)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-lg 
              transition-all duration-200 shadow-sm
              ${selectedAgent === agent.id 
                ? 'border-2 border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
              }
            `}
          >
            {agent.badge && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {agent.badge}
              </span>
            )}
            <h3 className={`font-medium ${selectedAgent === agent.id ? 'text-blue-700' : 'text-gray-800'}`}>
              {agent.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 text-center">{agent.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentSelector;