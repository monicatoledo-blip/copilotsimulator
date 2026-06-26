import { conversations } from '../data/conversations'

function SalesforceIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="18" fill="#00A1E0"/>
      <path d="M15 11c.9-.9 2.1-1.4 3.4-1.4 1.7 0 3.2.9 4 2.2.8-.3 1.5-.5 2.3-.5 3.1 0 5.5 2.4 5.5 5.5s-2.4 5.5-5.5 5.5c-.4 0-.7 0-1.1-.1-.7 1.3-2.1 2.2-3.6 2.2-1.1 0-2-.4-2.8-1.1-.7.7-1.6 1.1-2.6 1.1-1.6 0-3-.9-3.4-2.4-.2 0-.5.1-.8.1-2.2 0-4-1.8-4-4 0-1.7 1-3.1 2.5-3.6-.1-.4-.2-.9-.2-1.4 0-2.4 2-4.4 4.4-4.4.7 0 1.3.2 1.9.5" fill="white"/>
    </svg>
  )
}

const filterPills = ['Unread', 'Unmuted', 'Chats', 'Channels']

export default function ChatList({ selectedConversation, setSelectedConversation }) {
  return (
    <div className="w-[clamp(280px,22vw,420px)] min-w-[280px] border-r border-[#e0e0e0] bg-white flex flex-col">
      {/* Header row: Chat + action icons */}
      <div className="flex items-center justify-between px-5 pt-5 pb-1">
        <h2 className="text-[clamp(18px,1.4vw,24px)] font-semibold text-[#242424]">Chat</h2>
        <div className="flex items-center gap-1.5">
          {/* Three dot menu */}
          <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="3" cy="8" r="1.2"/>
              <circle cx="8" cy="8" r="1.2"/>
              <circle cx="13" cy="8" r="1.2"/>
            </svg>
          </button>
          {/* Search */}
          <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="currentColor"/>
            </svg>
          </button>
          {/* Compose */}
          <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 2.5l-1-1L4 10l-1 3 3-1 8.5-8.5zM11 3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Chevron down */}
          <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter pills — clear gap below header, clear gap above nav items */}
      <div className="flex items-center gap-2 px-5 pt-2 pb-3">
        {filterPills.map((pill) => (
          <button
            key={pill}
            className="px-3 py-[5px] text-[12px] text-[#424242] border border-[#c8c8c8] rounded-full hover:bg-[#f5f5f5] transition-colors whitespace-nowrap"
          >
            {pill}
          </button>
        ))}
        <button className="ml-1 text-[#616161] hover:text-[#242424]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Scrollable conversation list */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick nav items — separated from pills above with its own padding */}
        <div className="px-3 pb-2">
          <NavItem icon="sparkle" label="Copilot" />
          <NavItem icon="discover" label="Discover" />
          <NavItem icon="mention" label="Mentions" />
          <NavItem icon="threads" label="Followed threads" />
        </div>

        {/* Favorites section — generous top spacing to separate from nav */}
        <div className="px-5 pt-3 pb-2">
          <span className="text-[12px] font-semibold text-[#616161]">Favorites</span>
        </div>
        {conversations.slice(0, 2).map((conv) => (
          <ConversationRow key={conv.id} conv={conv} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
        ))}

        {/* Chats section */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[12px] font-semibold text-[#616161]">Chats</span>
        </div>
        {conversations.slice(2).map((conv) => (
          <ConversationRow key={conv.id} conv={conv} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
        ))}

        {/* Teams and channels section */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[12px] font-semibold text-[#616161]">Teams and channels</span>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label }) {
  const icons = {
    sparkle: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-[#616161]">
        <path d="M10 1L12.4 7.2L19 8L14.2 12.4L15.6 19L10 15.8L4.4 19L5.8 12.4L1 8L7.6 7.2L10 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    discover: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#616161]">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    mention: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#616161]">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M10 8a2 2 0 10-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 6v4.5a1 1 0 001 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    threads: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#616161]">
        <path d="M3 3h10v7H7l-3 3v-3H3V3z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <circle cx="6" cy="6.5" r="0.6" fill="currentColor"/>
        <circle cx="8" cy="6.5" r="0.6" fill="currentColor"/>
        <circle cx="10" cy="6.5" r="0.6" fill="currentColor"/>
      </svg>
    ),
  }
  return (
    <button className="w-full flex items-center gap-3 px-3 py-[7px] rounded-md hover:bg-[#f5f5f5] text-left transition-colors">
      <span className="w-5 h-5 flex items-center justify-center shrink-0">{icons[icon]}</span>
      <span className="text-[13px] text-[#424242]">{label}</span>
    </button>
  )
}

function ConversationRow({ conv, selectedConversation, setSelectedConversation }) {
  return (
    <button
      onClick={() => setSelectedConversation(conv.id)}
      className={`
        w-full flex items-center gap-3.5 px-4 py-[11px] text-left transition-colors
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
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: conv.avatarColor }}
        >
          {conv.avatar}
        </div>
      )}

      {/* Content — name row and preview each on their own clear line */}
      <div className="flex-1 min-w-0">
        {/* Top line: name + channel badge ... time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-semibold text-[13px] text-[#242424] truncate">
              {conv.name}
            </span>
            {conv.isChannel && (
              <span className="text-[11px] text-[#616161] shrink-0">
                Channel
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#616161] shrink-0 ml-2">{conv.time}</span>
        </div>
        {/* Preview line — sits clearly below the name */}
        <p className="text-[12px] text-[#616161] truncate leading-normal mt-[3px]">{conv.preview}</p>
      </div>
    </button>
  )
}
