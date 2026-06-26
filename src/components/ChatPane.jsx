import { conversations } from '../data/conversations'
import RichCard from './RichCard'

function SalesforceIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="18" fill="#00A1E0"/>
      <path d="M15 11c.9-.9 2.1-1.4 3.4-1.4 1.7 0 3.2.9 4 2.2.8-.3 1.5-.5 2.3-.5 3.1 0 5.5 2.4 5.5 5.5s-2.4 5.5-5.5 5.5c-.4 0-.7 0-1.1-.1-.7 1.3-2.1 2.2-3.6 2.2-1.1 0-2-.4-2.8-1.1-.7.7-1.6 1.1-2.6 1.1-1.6 0-3-.9-3.4-2.4-.2 0-.5.1-.8.1-2.2 0-4-1.8-4-4 0-1.7 1-3.1 2.5-3.6-.1-.4-.2-.9-.2-1.4 0-2.4 2-4.4 4.4-4.4.7 0 1.3.2 1.9.5" fill="white"/>
    </svg>
  )
}

export default function ChatPane({ selectedConversation }) {
  const conv = conversations.find(c => c.id === selectedConversation)
  if (!conv) return <div className="flex-1 bg-[#f5f5f5]" />

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat header bar */}
      <div className="flex items-center justify-between px-[clamp(16px,2vw,32px)] bg-white border-b border-[#e0e0e0] h-[clamp(48px,3.5vw,60px)]">
        <div className="flex items-center gap-3">
          {conv.avatarImg ? (
            <SalesforceIcon size={28} />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
              style={{ backgroundColor: conv.avatarColor }}
            >
              {conv.avatar}
            </div>
          )}
          <span className="font-semibold text-[clamp(14px,1vw,17px)] text-[#242424]">{conv.name}</span>

          {/* Tabs */}
          <div className="flex items-center ml-4 gap-0 h-full">
            <button className="h-full px-4 text-[13px] text-[#6264A7] font-medium border-b-2 border-[#6264A7] -mb-[1px]">Chat</button>
            <button className="h-full px-4 text-[13px] text-[#616161] hover:text-[#242424] border-b-2 border-transparent -mb-[1px]">Shared</button>
            <button className="h-full px-3 text-[#616161] hover:text-[#242424] border-b-2 border-transparent -mb-[1px] flex items-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M7 3v8M3 7h8"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-0.5">
          <ActionButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
              <rect x="1" y="1" width="6" height="6" rx="1"/>
              <rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/>
              <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
          </ActionButton>
          <ActionButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
              <path d="M2 4a1.5 1.5 0 011.5-1.5h6A1.5 1.5 0 0111 4v6a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 012 10V4zm10.5.8l2-1.3v7l-2-1.3V4.8z"/>
            </svg>
          </ActionButton>
          <ActionButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="currentColor" opacity="0.7"/>
            </svg>
          </ActionButton>
          <ActionButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
              <line x1="10" y1="2" x2="10" y2="14" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
            </svg>
          </ActionButton>
          <ActionButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
              <circle cx="3" cy="8" r="1"/>
              <circle cx="8" cy="8" r="1"/>
              <circle cx="13" cy="8" r="1"/>
            </svg>
          </ActionButton>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-[clamp(16px,3vw,48px)] py-[clamp(16px,2vw,32px)] bg-[#fafafa]">
        {conv.messages.map((msg, idx) => (
          <div key={idx} className="mb-5">
            <div className="flex items-start gap-3">
              {msg.isBot ? (
                <SalesforceIcon size={36} />
              ) : (
                <div
                  className={`w-[clamp(32px,2.5vw,44px)] h-[clamp(32px,2.5vw,44px)] rounded-full flex items-center justify-center text-white text-[clamp(10px,0.8vw,13px)] font-semibold shrink-0 ${msg.sender === 'You' ? 'bg-[#7B83EB]' : ''}`}
                  style={msg.sender !== 'You' ? { backgroundColor: conv.avatarColor } : {}}
                >
                  {msg.sender === 'You' ? 'MB' : conv.avatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2.5 mb-1">
                  <span className="font-semibold text-[clamp(13px,1vw,16px)] text-[#242424]">{msg.sender}</span>
                  <span className="text-[clamp(11px,0.8vw,14px)] text-[#616161]">{msg.time}</span>
                </div>
                <p className="text-[clamp(13px,1vw,16px)] text-[#242424] leading-[1.6]">{msg.text}</p>
                {msg.richCard && <RichCard type={msg.richCard} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input bar */}
      <div className="px-[clamp(16px,3vw,48px)] pb-4 pt-2 bg-[#fafafa]">
        <div className="bg-white border border-[#c8c8c8] rounded-lg overflow-hidden focus-within:border-[#6264A7] shadow-sm">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full text-[clamp(13px,1vw,16px)] text-[#242424] placeholder-[#999] outline-none message-input"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-0.5">
              <InputButton>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5l5.5-5.5a3 3 0 114.2 4.2l-5.5 5.5a1.5 1.5 0 01-2.1-2.1l5.5-5.5"/>
                </svg>
              </InputButton>
              <InputButton>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="8" r="0.8" fill="currentColor"/>
                  <circle cx="11" cy="8" r="0.8" fill="currentColor"/>
                  <path d="M6 11a3 3 0 006 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
              </InputButton>
              <InputButton>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M6.5 3h5a5.5 5.5 0 010 11h-5a5.5 5.5 0 010-11z"/>
                  <path d="M6.5 6.5v4M11.5 6.5v4"/>
                </svg>
              </InputButton>
              <InputButton>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </InputButton>
            </div>
            <div className="flex items-center gap-0.5">
              <InputButton>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M3 3l13 6.5-13 6.5V10.5L10 9.5 3 8.5V3z"/>
                </svg>
              </InputButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ children }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f0f0f0] rounded transition-colors">
      {children}
    </button>
  )
}

function InputButton({ children }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded transition-colors">
      {children}
    </button>
  )
}
