import { agents } from '../data/agents'

export default function AgentsList({ selectedAgent, setSelectedAgent }) {
  return (
    <div className="flex-1 overflow-y-auto px-3">
      <h4 className="text-[12px] font-semibold text-[#616161] uppercase tracking-wide px-2 mb-2 mt-1">Agents</h4>
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id)}
          className={`
            w-full flex items-center gap-3 px-3 py-[10px] rounded-md text-left transition-colors mb-[2px]
            ${selectedAgent === agent.id
              ? 'bg-[#E8EBFA]'
              : 'hover:bg-[#f5f5f5]'
            }
          `}
        >
          <div
            className="w-[clamp(32px,2.5vw,44px)] h-[clamp(32px,2.5vw,44px)] rounded-full flex items-center justify-center text-white text-[clamp(10px,0.8vw,13px)] font-semibold shrink-0"
            style={{ backgroundColor: agent.color }}
          >
            {agent.abbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[clamp(12px,0.9vw,15px)] text-[#242424]">{agent.name}</p>
            <p className="text-[clamp(11px,0.8vw,14px)] text-[#616161] truncate mt-[1px]">{agent.description}</p>
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-[#999]">
            <path d="M3 1.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ))}
    </div>
  )
}
