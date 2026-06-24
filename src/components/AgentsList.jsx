import { agents } from '../data/agents'

export default function AgentsList({ selectedAgent, setSelectedAgent }) {
  return (
    <div className="flex-1 overflow-y-auto px-3">
      <h4 className="text-xs font-semibold text-[#616161] uppercase tracking-wide px-2 mb-2">Agents</h4>
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id)}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-md text-left transition-colors mb-0.5
            ${selectedAgent === agent.id
              ? 'bg-[#E8EBFA]'
              : 'hover:bg-[#f5f5f5]'
            }
          `}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ backgroundColor: agent.color }}
          >
            {agent.abbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#242424]">{agent.name}</p>
            <p className="text-xs text-[#616161] truncate">{agent.description}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#999" className="shrink-0">
            <path d="M4 2l4 4-4 4" stroke="#999" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      ))}
    </div>
  )
}
