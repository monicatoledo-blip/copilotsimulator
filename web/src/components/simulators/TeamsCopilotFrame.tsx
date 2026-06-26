import { Fragment, useState } from 'react'
import './teams-copilot.css'
import CopilotMark from './CopilotMark'
import TeamsGroupChat from './TeamsGroupChat'
import { renderRich } from './richText'

function Avatar({ assistant, brand }) {
  if (assistant.avatarUrl) {
    return (
      <div className="tc-avatar">
        <img src={assistant.avatarUrl} alt={assistant.name} />
      </div>
    )
  }
  if (brand.logoUrl) {
    return (
      <div className="tc-avatar">
        <img src={brand.logoUrl} alt={brand.name} />
      </div>
    )
  }
  return (
    <div className="tc-avatar is-copilot">
      <CopilotMark size={26} />
    </div>
  )
}

function AssistantText({ assistant, brand, children }) {
  return (
    <div className="tc-row-assistant">
      <Avatar assistant={assistant} brand={brand} />
      <div className="tc-assistant-col">
        <div className="tc-assistant-name">{assistant.name || 'Copilot'}</div>
        {children}
      </div>
    </div>
  )
}

function ResponseActions() {
  return (
    <div className="tc-actions">
      <button type="button" className="tc-action-btn" title="Copy" aria-label="Copy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      </button>
      <button type="button" className="tc-action-btn" title="Good response" aria-label="Good response">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1.5 6a2 2 0 0 1-2 1.5H7" />
        </svg>
      </button>
      <button type="button" className="tc-action-btn" title="Bad response" aria-label="Bad response">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M17 13V4h3v9zM17 13l-4 7a2 2 0 0 1-3-2l1-5H6a2 2 0 0 1-2-2l1.5-6A2 2 0 0 1 7.5 4H17" />
        </svg>
      </button>
    </div>
  )
}

function Step({ step, assistant, brand }) {
  if (step.type === 'userPrompt') {
    return (
      <div className="tc-row-user">
        <div className="tc-user-bubble">{step.text}</div>
      </div>
    )
  }

  if (step.type === 'toolAction') {
    return (
      <AssistantText assistant={assistant} brand={brand}>
        <div className="tc-card">
          <div className="tc-card-accent" />
          <div className="tc-card-body">
            <div className="tc-card-head">
              <span className="tc-card-check">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="tc-card-title">{step.title || 'Action complete'}</span>
            </div>
            <div className="tc-card-text">{step.text}</div>
          </div>
        </div>
        <ResponseActions />
      </AssistantText>
    )
  }

  return (
    <AssistantText assistant={assistant} brand={brand}>
      <div className="tc-assistant-text">{renderRich(step.text, step.id)}</div>
      <ResponseActions />
    </AssistantText>
  )
}

function CopilotSurface({ brand, assistant, renderedSteps, isRunning }) {
  const lastStep = renderedSteps[renderedSteps.length - 1]
  const showTyping = isRunning && (!lastStep || lastStep.type === 'userPrompt')

  return (
    <section className="tc-app">
      <header className="tc-header">
        <div className="tc-header-left">
          <Avatar assistant={assistant} brand={brand} />
          <div style={{ minWidth: 0 }}>
            <div className="tc-header-title">{assistant.name || 'Copilot'}</div>
            <div className="tc-header-sub">{brand.name}</div>
          </div>
          <span className="tc-chevron" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
        <div className="tc-header-actions">
          <button type="button" className="tc-icon-btn" title="New chat" aria-label="New chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
          <button type="button" className="tc-icon-btn" title="Chat history" aria-label="Chat history">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
          </button>
          <button type="button" className="tc-icon-btn" title="More options" aria-label="More options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </button>
        </div>
      </header>

      <div className="tc-thread">
        {assistant.greeting && (
          <AssistantText assistant={assistant} brand={brand}>
            <div className="tc-assistant-text">{assistant.greeting}</div>
          </AssistantText>
        )}

        {renderedSteps.map((step) => (
          <Step key={step.id} step={step} assistant={assistant} brand={brand} />
        ))}

        {showTyping && (
          <div className="tc-row-assistant">
            <Avatar assistant={assistant} brand={brand} />
            <div className="tc-assistant-col">
              <div className="tc-typing" aria-label="Copilot is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tc-composer">
        <div className="tc-input">
          <div className="tc-input-left">
            <button type="button" className="tc-icon-btn" title="Add attachment" aria-label="Add attachment">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M21.4 11.05 12.2 20.3a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.48-8.49" />
              </svg>
            </button>
          </div>
          <div className="tc-placeholder">Message {assistant.name || 'Copilot'}</div>
          <button type="button" className="tc-send" title="Send" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z" />
            </svg>
          </button>
        </div>
        <div className="tc-disclaimer">AI-generated content may be incorrect</div>
      </div>
    </section>
  )
}

const TL_COLORS = ['#c4314b', '#0f6cbd', '#107c41', '#8764b8', '#c19c00', '#005b70', '#a4262c']
function tlColor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return TL_COLORS[h % TL_COLORS.length]
}
function tlInitials(name) {
  const p = (name || '?').trim().split(/\s+/)
  return (p.length === 1 ? p[0].charAt(0) : p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase()
}

function GroupGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <circle cx="8" cy="9" r="2.4" />
      <circle cx="16" cy="9" r="2.4" />
      <path d="M3.5 18a4.5 4.5 0 0 1 9 0zM11.5 18a4.5 4.5 0 0 1 9 0z" />
    </svg>
  )
}

function SidebarRow({ item, title, view, onSelectChat }) {
  const isChannel = item.type === 'channel'
  const isActiveChat = item.name === title
  const active = isActiveChat && view === 'teams'
  return (
    <div
      className={`tl-item ${active ? 'is-active' : ''} ${item.unread ? 'is-unread' : ''}`}
      role={isActiveChat ? 'button' : undefined}
      onClick={isActiveChat ? onSelectChat : undefined}
      style={isActiveChat ? undefined : { cursor: 'default' }}
    >
      <span className={`tl-dot ${item.unread ? 'on' : ''}`} />
      <span
        className={`tl-avatar ${isChannel && isActiveChat ? 'is-channel' : ''}`}
        style={isActiveChat ? undefined : { background: tlColor(item.name) }}
      >
        {isChannel ? <GroupGlyph /> : tlInitials(item.name)}
        {!isChannel && <span className="tl-presence-sm" />}
      </span>
      <span className="tl-name">{item.name}</span>
      {item.mention && <span className="tl-mention">@</span>}
    </div>
  )
}

function ChatListPane({ chatTitle, members, brand, view, onSelectChat, onSelectCopilot, sidebar }) {
  const title = chatTitle || `${brand.name || ''} Team`.trim()

  let items = sidebar && sidebar.length ? sidebar : null
  if (!items) {
    items = [{ id: 'active', name: title, type: 'channel', section: 'Favorites' }]
    ;(members || []).forEach((m, i) =>
      items.push({ id: 'm' + i, name: typeof m === 'string' ? m : m.name, type: 'person', section: 'Chats' }),
    )
  }
  const order = []
  const groups = {}
  items.forEach((it) => {
    const sec = it.section || 'Chats'
    if (!groups[sec]) {
      groups[sec] = []
      order.push(sec)
    }
    groups[sec].push(it)
  })
  const hasActive = items.some((it) => it.name === title)

  return (
    <aside className="tl-pane" aria-label="Chat list">
      <div className="tl-head">
        <h2>Chat</h2>
        <div className="tl-head-actions">
          <button type="button" title="More options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
          </button>
          <button type="button" title="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </button>
          <button type="button" title="New chat">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
          </button>
        </div>
      </div>
      <div className="tl-filters">
        <button type="button" className="tl-pill is-active">Unread</button>
        <button type="button" className="tl-pill">Channels</button>
        <button type="button" className="tl-pill">Chats</button>
      </div>
      <div className="tl-list">
        <div
          className={`tl-nav-item ${view === 'copilot' ? 'is-active' : ''}`}
          role="button"
          onClick={onSelectCopilot}
        >
          <span className="tl-ico"><CopilotMark size={18} /></span>Copilot
        </div>
        <div className="tl-nav-item">
          <span className="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5 13 13l-3.5 1.5L11 11z" /></svg></span>Discover
        </div>
        <div className="tl-nav-item">
          <span className="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4" /><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" /></svg></span>Mentions
        </div>
        <div className="tl-nav-item">
          <span className="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></span>Followed threads
        </div>
        {!hasActive && (
          <>
            <div className="tl-sec">Favorites</div>
            <SidebarRow item={{ name: title, type: 'channel' }} title={title} view={view} onSelectChat={onSelectChat} />
          </>
        )}
        {order.map((sec) => (
          <Fragment key={sec}>
            <div className="tl-sec">{sec}</div>
            {groups[sec].map((it) => (
              <SidebarRow key={it.id || it.name} item={it} title={title} view={view} onSelectChat={onSelectChat} />
            ))}
          </Fragment>
        ))}
      </div>
    </aside>
  )
}

function RailItem({ label, active, onClick, children }) {
  return (
    <button type="button" className={`tw-rail-item ${active ? 'is-active' : ''}`} onClick={onClick}>
      {children}
      <span>{label}</span>
    </button>
  )
}

function railIcon(path, opts = {}) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={opts.sw || 1.6} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  )
}

export default function TeamsCopilotFrame({ brand, assistant, renderedSteps, isRunning, chatTitle, viewer, groupChat, members, sidebar }) {
  const profileInitial = (brand.name || 'U').trim().charAt(0).toUpperCase()
  const [view, setView] = useState('teams')

  return (
    <div className="tw-window">
      <div className="tw-titlebar">
        <div className="tw-traffic" aria-hidden="true">
          <span className="r" />
          <span className="y" />
          <span className="g" />
        </div>
        <div className="tw-nav" aria-hidden="true">
          {railIcon(<path d="M15 6l-6 6 6 6" />, { sw: 1.8 })}
          {railIcon(<path d="M9 6l6 6-6 6" />, { sw: 1.8 })}
        </div>
        <div className="tw-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span>Search</span>
        </div>
        <div className="tw-titlebar-right">
          <div className="tw-profile">{profileInitial}</div>
        </div>
      </div>

      <div className="tw-body">
        <nav className="tw-rail" aria-label="Teams navigation">
          <RailItem label="Activity">
            {railIcon(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>)}
          </RailItem>
          <RailItem label="Chat">
            {railIcon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />)}
          </RailItem>
          <RailItem label="Teams" active={view === 'teams'} onClick={() => setView('teams')}>
            {railIcon(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M17 14.5a6 6 0 0 1 4 5.5" /></>)}
          </RailItem>
          <RailItem label="Calendar">
            {railIcon(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>)}
          </RailItem>
          <RailItem label="Calls">
            {railIcon(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />)}
          </RailItem>
          <RailItem label="Apps">
            {railIcon(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>)}
          </RailItem>
          <div className="tw-rail-spacer" />
          <div className="tw-rail-avatar">{profileInitial}</div>
        </nav>

        <ChatListPane
          chatTitle={chatTitle}
          members={members}
          brand={brand}
          view={view}
          sidebar={sidebar}
          onSelectChat={() => setView('teams')}
          onSelectCopilot={() => setView('copilot')}
        />

        <div className="tw-content">
          {view === 'teams' ? (
            <TeamsGroupChat
              brand={brand}
              renderedSteps={renderedSteps}
              isRunning={isRunning}
              chatTitle={chatTitle}
              viewer={viewer}
              messages={groupChat}
              members={members}
            />
          ) : (
            <CopilotSurface brand={brand} assistant={assistant} renderedSteps={renderedSteps} isRunning={isRunning} />
          )}
        </div>
      </div>
    </div>
  )
}
