export default function TypingIndicator({ agentName, agentColor, agentAbbr }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
          style={{ backgroundColor: agentColor }}
        >
          {agentAbbr}
        </div>
        <span className="text-xs text-[#616161]">
          <span className="font-semibold text-[#242424]">{agentName}</span> is typing...
        </span>
      </div>
      <div className="ml-8">
        <div className="bg-white rounded-lg rounded-tl-sm px-4 py-3 border border-[#e5e5e5] shadow-sm inline-flex items-center gap-1.5">
          <span className="typing-dot w-2 h-2 bg-[#999] rounded-full" />
          <span className="typing-dot w-2 h-2 bg-[#999] rounded-full" />
          <span className="typing-dot w-2 h-2 bg-[#999] rounded-full" />
        </div>
      </div>
    </div>
  )
}
