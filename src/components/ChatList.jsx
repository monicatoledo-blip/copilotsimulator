import { conversations } from '../data/conversations'

function SalesforceIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#00A1E0"/>
      <path d="M13.3 9.7c.8-.8 1.9-1.3 3.1-1.3 1.5 0 2.9.8 3.6 2 .7-.3 1.4-.5 2.1-.5 2.8 0 5 2.2 5 5s-2.2 5-5 5c-.3 0-.7 0-1-.1-.6 1.2-1.9 2-3.3 2-1 0-1.8-.4-2.5-1-.6.6-1.5 1-2.4 1-1.5 0-2.7-.9-3.1-2.2-.2 0-.5.1-.7.1-2 0-3.6-1.6-3.6-3.6 0-1.5 1-2.8 2.3-3.3-.1-.4-.2-.8-.2-1.2 0-2.2 1.8-4 4-4 .6 0 1.2.2 1.7.4" fill="white"/>
    </svg>
  )
}

export default function ChatList({ selectedConversation, setSelectedConversation }) {
  return (
    <div className="w-[300px] min-w-[300px] border-r border-[#e5e5e5] bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-semibold text-[#242424]">Chat</h2>
        <p className="text-xs text-[#616161] mt-0.5">Recent conversations</p>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedConversation(conv.id)}
            className={`
              w-full flex items-center gap-3 px-5 py-3 text-left transition-colors
              ${selectedConversation === conv.id
                ? 'bg-[#E8EBFA]'
                : 'hover:bg-[#f5f5f5]'
              }
            `}
          >
            {/* Avatar */}
            {conv.avatarImg ? (
              <SalesforceIcon />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                style={{ backgroundColor: conv.avatarColor }}
              >
                {conv.avatar}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-[#242424] truncate">
                  {conv.name}
                </span>
                {conv.isChannel && (
                  <span className="text-[10px] text-[#616161] bg-[#f0f0f0] px-1.5 py-0.5 rounded shrink-0">
                    Channel
                  </span>
                )}
              </div>
              <p className="text-xs text-[#616161] truncate mt-0.5">{conv.preview}</p>
            </div>

            {/* Time */}
            <span className="text-[11px] text-[#616161] shrink-0">{conv.time}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
