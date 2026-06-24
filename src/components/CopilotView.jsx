import { useState } from 'react'
import AgentsList from './AgentsList'
import AgentChat from './AgentChat'

export default function CopilotView() {
  const [selectedAgent, setSelectedAgent] = useState('salesforce')

  return (
    <div className="flex h-full">
      {/* Left: header + agents list */}
      <div className="w-[280px] min-w-[280px] border-r border-[#e5e5e5] bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-[18px] font-semibold text-[#242424]">Copilot</h2>
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.2"/>
                <circle cx="8" cy="8" r="1.2"/>
                <circle cx="13" cy="8" r="1.2"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[#616161] px-4 pb-2">AI-powered workspace assistant</p>
        <AgentsList selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
      </div>

      {/* Right: agent chat */}
      <AgentChat selectedAgent={selectedAgent} />
    </div>
  )
}
