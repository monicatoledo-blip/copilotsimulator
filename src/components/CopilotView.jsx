import { useState } from 'react'
import AgentsList from './AgentsList'
import AgentChat from './AgentChat'

export default function CopilotView() {
  const [selectedAgent, setSelectedAgent] = useState('salesforce')

  return (
    <div className="flex h-full">
      {/* Left: header + agents list */}
      <div className="w-[300px] min-w-[300px] border-r border-[#e5e5e5] bg-white flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xl font-semibold text-[#242424]">Copilot</h2>
          <p className="text-xs text-[#616161] mt-0.5">AI-powered workspace assistant</p>
        </div>
        <AgentsList selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
      </div>

      {/* Right: agent chat */}
      <AgentChat selectedAgent={selectedAgent} />
    </div>
  )
}
