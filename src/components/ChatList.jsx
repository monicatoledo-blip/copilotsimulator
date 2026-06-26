import { conversations } from '../data/conversations'

function SalesforceIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="18" fill="#00A1E0"/>
      <path d="M15 11c.9-.9 2.1-1.4 3.4-1.4 1.7 0 3.2.9 4 2.2.8-.3 1.5-.5 2.3-.5 3.1 0 5.5 2.4 5.5 5.5s-2.4 5.5-5.5 5.5c-.4 0-.7 0-1.1-.1-.7 1.3-2.1 2.2-3.6 2.2-1.1 0-2-.4-2.8-1.1-.7.7-1.6 1.1-2.6 1.1-1.6 0-3-.9-3.4-2.4-.2 0-.5.1-.8.1-2.2 0-4-1.8-4-4 0-1.7 1-3.1 2.5-3.6-.1-.4-.2-.9-.2-1.4 0-2.4 2-4.4 4.4-4.4.7 0 1.3.2 1.9.5" fill="white"/>
    </svg>
  )
}

const filterPills = ['Unread', 'Unmuted', 'Chats', 'Channels']

export default function ChatList({ selectedConversation, setSelectedConversation }) {
  // Split conversations into sections
  const channels = conversations.filter(c => c.isChannel)
  const directChats = conversations.filter(c => !c.isChannel)
  const todayChats = directChats.filter(c => c.time !== 'Yesterday')
  const yesterdayChats = directChats.filter(c => c.time === 'Yesterday')

  return (
    <div className="w-[280px] min-w-[280px] border-r border-[#e5e5e5] bg-white flex flex-col">
      {/* Header row: Chat + action icons */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h2 className="text-[18px] font-semibold text-[#242424]">Chat</h2>
        <div className="flex items-center gap-0.5">
          {/* Three dot menu */}
          <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="3" cy="8" r="1.2"/>
              <circle cx="8" cy="8" r="1.2"/>
              <circle cx="13" cy="8" r="1.2"/>
            </svg>
          </button>
          {/* Search */}
          <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="currentColor"/>
            </svg>
          </button>
          {/* Compose */}
          <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 2.5l-1-1L4 10l-1 3 3-1 8.5-8.5zM11 3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Chevron down */}
          <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 px-4 py-1.5">
        {filterPills.map((pill) => (
          <button
            key={pill}
            className="px-2.5 py-[3px] text-[12px] text-[#424242] border border-[#d1d1d1] rounded-full hover:bg-[#f5f5f5] transition-colors whitespace-nowrap"
          >
            {pill}
          </button>
        ))}
        <button className="p-[3px] text-[#616161] hover:text-[#242424]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Scrollable conversation list */}
      <div className="flex-1 overflow-y-auto">
        {/* Copilot / Discover / Mentions section */}
        <div className="px-3 py-1">
          <button className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded hover:bg-[#f5f5f5] text-left">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#616161]">
              <path d="M10 1L12.4 7.2L19 8L14.2 12.4L15.6 19L10 15.8L4.4 19L5.8 12.4L1 8L7.6 7.2L10 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="text-[13px] text-[#424242]">Copilot</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded hover:bg-[#f5f5f5] text-left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#616161]">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[13px] text-[#424242]">Discover</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded hover:bg-[#f5f5f5] text-left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#616161]">
              <path d="M8 1.5a2 2 0 0 1 2 2v1.586l.707.707a1 1 0 0 1 .293.707v.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.5a1 1 0 0 1 .293-.707L6 5.086V3.5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <path d="M3 10h10v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            </svg>
            <span className="text-[13px] text-[#424242]">Mentions</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded hover:bg-[#f5f5f5] text-left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#616161]">
              <path d="M3 3h10v8H7l-3 3v-3H3V3z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
              <circle cx="6" cy="7" r="0.5" fill="currentColor"/>
              <circle cx="8" cy="7" r="0.5" fill="currentColor"/>
              <circle cx="10" cy="7" r="0.5" fill="currentColor"/>
            </svg>
            <span className="text-[13px] text-[#424242]">Followed threads</span>
          </button>
        </div>

        {/* Favorites section header */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[12px] font-semibold text-[#616161]">Favorites</span>
        </div>

        {/* Favorite conversations (first 2) */}
        {conversations.slice(0, 2).map((conv) => (
          <ConversationRow key={conv.id} conv={conv} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
        ))}

        {/* Chats section header */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[12px] font-semibold text-[#616161]">Chats</span>
        </div>

        {/* Remaining conversations */}
        {conversations.slice(2).map((conv) => (
          <ConversationRow key={conv.id} conv={conv} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
        ))}

        {/* Teams and channels section header */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[12px] font-semibold text-[#616161]">Teams and channels</span>
        </div>
      </div>
    </div>
  )
}

function ConversationRow({ conv, selectedConversation, setSelectedConversation }) {
  return (
    <button
      onClick={() => setSelectedConversation(conv.id)}
      className={`
        w-full flex items-center gap-2.5 px-3 py-[7px] text-left transition-colors
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
          className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
          style={{ backgroundColor: conv.avatarColor }}
        >
          {conv.avatar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden mr-2">
            <span className="font-semibold text-[13px] text-[#242424] truncate whitespace-nowrap">
              {conv.name}
            </span>
            {conv.isChannel && (
              <span className="text-[10px] text-[#616161] shrink-0 whitespace-nowrap">
                Channel
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#616161] shrink-0 whitespace-nowrap">{conv.time}</span>
        </div>
        <p className="text-[12px] text-[#616161] truncate leading-snug mt-[1px]">{conv.preview}</p>
      </div>
    </button>
  )
}
