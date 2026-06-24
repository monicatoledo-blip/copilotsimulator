import { conversations } from '../data/conversations'
import RichCard from './RichCard'

function SalesforceSmallIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#00A1E0"/>
      <path d="M13.3 9.7c.8-.8 1.9-1.3 3.1-1.3 1.5 0 2.9.8 3.6 2 .7-.3 1.4-.5 2.1-.5 2.8 0 5 2.2 5 5s-2.2 5-5 5c-.3 0-.7 0-1-.1-.6 1.2-1.9 2-3.3 2-1 0-1.8-.4-2.5-1-.6.6-1.5 1-2.4 1-1.5 0-2.7-.9-3.1-2.2-.2 0-.5.1-.7.1-2 0-3.6-1.6-3.6-3.6 0-1.5 1-2.8 2.3-3.3-.1-.4-.2-.8-.2-1.2 0-2.2 1.8-4 4-4 .6 0 1.2.2 1.7.4" fill="white"/>
    </svg>
  )
}

export default function ChatPane({ selectedConversation }) {
  const conv = conversations.find(c => c.id === selectedConversation)
  if (!conv) return <div className="flex-1 bg-[#f5f5f5]" />

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f5]">
      {/* Chat header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center gap-3">
          {conv.avatarImg ? (
            <SalesforceSmallIcon />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: conv.avatarColor }}
            >
              {conv.avatar}
            </div>
          )}
          <span className="font-semibold text-sm text-[#242424]">{conv.name}</span>
          <div className="flex items-center gap-0.5 ml-2">
            <button className="px-3 py-1 text-xs text-[#6264A7] font-medium border-b-2 border-[#6264A7]">Chat</button>
            <button className="px-3 py-1 text-xs text-[#616161] hover:text-[#242424]">Shared</button>
            <button className="px-2 py-1 text-[#616161] hover:text-[#242424]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {['video', 'people', 'folder', 'search', 'present', 'panel', 'more'].map((action) => (
            <button key={action} className="p-2 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                {action === 'video' && <path d="M2 4.5A1.5 1.5 0 013.5 3h6A1.5 1.5 0 0111 4.5v5A1.5 1.5 0 019.5 11h-6A1.5 1.5 0 012 9.5v-5zm11 .5l2 -1.3v6.6l-2-1.3V5z"/>}
                {action === 'people' && <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z"/>}
                {action === 'folder' && <path d="M1 3.5A1.5 1.5 0 012.5 2h3.172a1.5 1.5 0 011.06.44l.828.82H13.5A1.5 1.5 0 0115 4.76V12.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 12.5v-9z"/>}
                {action === 'search' && <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z"/>}
                {action === 'present' && <rect x="1" y="3" width="14" height="10" rx="1.5"/>}
                {action === 'panel' && <><rect x="1" y="2" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><line x1="10" y1="2" x2="10" y2="14" stroke="currentColor" strokeWidth="1.2"/></>}
                {action === 'more' && <><circle cx="4" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="12" cy="8" r="1"/></>}
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {conv.messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              {msg.isBot ? (
                <SalesforceSmallIcon />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold ${msg.sender === 'You' ? 'bg-[#6264A7]' : ''}`}
                  style={msg.sender !== 'You' ? { backgroundColor: conv.avatarColor } : {}}
                >
                  {msg.sender === 'You' ? 'MB' : conv.avatar}
                </div>
              )}
              <span className="text-xs text-[#616161]">
                <span className="font-semibold text-[#242424]">{msg.sender}</span> · {msg.time}
              </span>
            </div>
            <div className="ml-8">
              <p className="text-sm text-[#242424] leading-relaxed">{msg.text}</p>
              {msg.richCard && <RichCard type={msg.richCard} />}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="px-4 pb-4">
        <div className="flex items-center bg-white border border-[#e5e5e5] rounded-md px-3 py-2">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 text-sm text-[#242424] placeholder-[#999] outline-none message-input"
            readOnly
          />
          <div className="flex items-center gap-1">
            {['attach', 'emoji', 'add', 'send'].map((btn) => (
              <button key={btn} className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {btn === 'attach' && <path d="M7.5 1A4.5 4.5 0 003 5.5v5a3.5 3.5 0 107 0V5a2 2 0 10-4 0v5.5a.5.5 0 001 0V5h1v5.5a1.5 1.5 0 01-3 0V5.5a3.5 3.5 0 017 0v5a4.5 4.5 0 11-9 0v-5A4.5 4.5 0 017.5 1z"/>}
                  {btn === 'emoji' && <><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="6.5" r="1"/><circle cx="10.5" cy="6.5" r="1"/><path d="M5 10a3 3 0 006 0" fill="none" stroke="currentColor" strokeWidth="1.2"/></>}
                  {btn === 'add' && <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" fill="none"/>}
                  {btn === 'send' && <path d="M1 1l14 7-14 7V9l10-1-10-1V1z"/>}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
