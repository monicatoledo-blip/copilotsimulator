import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import './teams-copilot.css'
import CopilotMark from './CopilotMark'
import TeamsGroupChat from './TeamsGroupChat'
import { renderRich, renderInline } from './richText'
import { CUMULUS_LOGO } from './cumulusLogoData'

function Avatar({ assistant }) {
  // Copilot's assistant avatar is always the Copilot mark (Microsoft branding).
  // The org's brand logo lives in the Teams title bar and app rail, not here.
  if (assistant.avatarUrl) {
    return (
      <div className="tc-avatar">
        <img src={assistant.avatarUrl} alt={assistant.name} />
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

  if (step.type === 'visualization') {
    return (
      <AssistantText assistant={assistant} brand={brand}>
        <div className="tc-viz">
          <div className="tc-viz-title">{renderInline(step.title || 'Insights', step.id)}</div>
          <div className="tc-viz-card">
            <pre className="tc-viz-pre">{step.text}</pre>
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

const copDelay = (ms) => new Promise((r) => setTimeout(r, ms))

function buildSegments(script) {
  const segs = []
  let cur = null
  ;(script || []).forEach((step) => {
    if (step.type === 'userPrompt') {
      if (cur) segs.push(cur)
      cur = { prompt: step, responses: [] }
    } else {
      if (!cur) cur = { prompt: null, responses: [] }
      cur.responses.push(step)
    }
  })
  if (cur) segs.push(cur)
  return segs
}

const STARTER_TILES = [
  {
    key: 'idea',
    label: 'Idea',
    copy: 'Spark ideas for your next campaign or customer moment.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 2a7 7 0 0 0-4 12.6c.6.4 1 1.1 1 1.9V18h6v-1.5c0-.8.4-1.5 1-1.9A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    key: 'design',
    label: 'Design',
    copy: 'Shape a rough concept into a polished, on-brand asset.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="M21 14l-4-4-7 7" />
      </svg>
    ),
  },
  {
    key: 'create',
    label: 'Create',
    copy: 'Build a segment, journey, or email right from chat.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21L15 11" />
        <path d="M16 3l.9 2.1L19 6l-2.1.9L16 9l-.9-2.1L13 6l2.1-.9z" />
      </svg>
    ),
  },
  {
    key: 'ask',
    label: 'Ask',
    copy: 'Ask anything about your audiences, data, or setup.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.3c-.6.3-.9.7-.9 1.5" />
        <circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

function CopilotWelcome({ assistant, greeting }) {
  return (
    <div className="tc-welcome">
      <div className="tc-welcome-brand">
        <CopilotMark size={40} />
        <span className="tc-welcome-titles">
          <span className="tc-welcome-title">{assistant.name || 'Copilot'}</span>
          <span className="tc-welcome-sub">Copilot agent</span>
        </span>
      </div>
      <div className="tc-welcome-invite">{greeting || 'What will you create today?'}</div>
      <div className="tc-suggest-grid" aria-hidden="true">
        {STARTER_TILES.map((tile) => (
          <div key={tile.key} className="tc-suggest-card">
            <span className="tc-suggest-head">
              <span className="tc-suggest-ico">{tile.icon}</span>
              <span className="tc-suggest-label">{tile.label}</span>
            </span>
            <span className="tc-suggest-text">{tile.copy}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// How long Copilot "works" before each response — longer for steps that imply
// reaching into Marketing Cloud via MCP and building artifacts.
const PACING_MULT = { low: 0.5, medium: 1, high: 1.7 }
function thinkMs(step) {
  let base
  if (step.type === 'visualization') base = 6500
  else if (step.type === 'toolAction') base = 6000
  else base = Math.min(Math.max(step.delayMs || 3200, 3600), 5200)
  return Math.round(base * (PACING_MULT[step.pacing] || 1))
}

const THINK_PHRASES = {
  assistantResponse: ['Thinking…', 'Reasoning over your request…', 'Lining things up…', 'Working on it…'],
  toolAction: ['Connecting to Marketing Cloud…', 'Reaching into the MCP server…', 'Setting that up for you…', 'Wiring it up…', 'Almost there…'],
  // Chart-specific copy — only used when an actual chart is being built.
  chart: ['Pulling the numbers…', 'Crunching the data…', 'Building your chart…', 'Putting it together…'],
  // Neutral copy for non-chart visualizations (tables, journey maps, etc.).
  visualization: ['Putting it together…', 'Mapping it out…', 'Building it now…', 'Almost there…'],
}
const CHART_VIZ_TYPES = new Set(['bar', 'funnel', 'scorecard'])
// Real Copilot "thinks" once per turn, then streams the whole answer. Pick the
// phrase set that matches the heaviest work happening in the turn.
function phrasesForTurn(responses) {
  if (responses.some((s) => s.type === 'toolAction')) return THINK_PHRASES.toolAction
  if (responses.some((s) => s.type === 'visualization')) {
    const hasChart = responses.some((s) => s.type === 'visualization' && CHART_VIZ_TYPES.has(s.vizType))
    return hasChart ? THINK_PHRASES.chart : THINK_PHRASES.visualization
  }
  return THINK_PHRASES.assistantResponse
}

function ThinkingRow({ phrases, assistant, brand }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 1300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="tc-row-assistant">
      <Avatar assistant={assistant} brand={brand} />
      <div className="tc-assistant-col">
        <div className="tc-thinking" aria-label="Copilot is working">
          <span className="tc-thinking-text">{phrases[i % phrases.length]}</span>
          <span className="tc-dots"><span /><span /><span /></span>
        </div>
      </div>
    </div>
  )
}

function fillName(text, viewer) {
  if (text == null) return text
  return String(text).replace(/\{\{?\s*name\s*\}?\}/gi, viewer || 'there')
}

function CopilotSurface({ brand, assistant, script, resetSignal, viewer }) {
  const segments = useMemo(() => buildSegments(script), [script])
  const [started, setStarted] = useState(false)
  const [turns, setTurns] = useState([])
  const [thinking, setThinking] = useState(null)
  const [input, setInput] = useState('')
  const segIndexRef = useRef(0)
  const busyRef = useRef(false)
  const threadRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setStarted(false)
    setTurns([])
    setThinking(null)
    setInput('')
    segIndexRef.current = 0
    busyRef.current = false
  }, [resetSignal, script])

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [turns, thinking, started])

  // Auto-grow the composer so pasted prompts wrap instead of getting clipped.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  // Blinking cursor ready and waiting in the composer.
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  // The very first prompt is typed by hand so it feels natural. After that,
  // clicking the composer "pastes" the next scripted prompt, in order.
  const fillNextPrompt = () => {
    if (busyRef.current) return
    if (segIndexRef.current === 0) return
    if (input.trim()) return
    const seg = segments[segIndexRef.current]
    if (seg && seg.prompt) setInput(seg.prompt.text)
  }

  const send = async (rawText) => {
    if (busyRef.current) return
    const idx = segIndexRef.current
    const seg = segments[idx]
    const text = (rawText != null ? rawText : input).trim() || (seg && seg.prompt ? seg.prompt.text : '')
    if (!text) return
    busyRef.current = true
    setStarted(true)
    setInput('')
    setTurns((t) => [...t, { kind: 'user', text }])
    segIndexRef.current = idx + 1

    const responses = seg ? seg.responses : []
    if (responses.length) {
      // One think phase per turn; its length is the sum of each response's
      // pacing (so per-step effort still matters), capped so it never drags.
      const totalThink = Math.min(
        responses.reduce((sum, s) => sum + thinkMs(s), 0),
        12000,
      )
      setThinking({ phrases: phrasesForTurn(responses) })
      await copDelay(totalThink)
      setThinking(null)
      for (let i = 0; i < responses.length; i++) {
        setTurns((t) => [...t, { kind: 'step', step: responses[i] }])
        if (i < responses.length - 1) await copDelay(600)
      }
    }
    if (!seg) {
      setThinking({ phrases: ['Thinking…'] })
      await copDelay(900)
      setThinking(null)
      setTurns((t) => [
        ...t,
        { kind: 'step', step: { id: 'end-' + Date.now(), type: 'assistantResponse', text: "That's the end of this demo flow — refresh to start over." } },
      ])
    }
    busyRef.current = false
    if (inputRef.current) inputRef.current.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

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

      <div className={`tc-thread ${started ? '' : 'is-welcome'}`} ref={threadRef}>
        {!started ? (
          <CopilotWelcome assistant={assistant} greeting={fillName(assistant.greeting, viewer)} />
        ) : (
          <>
            {turns.map((t, i) =>
              t.kind === 'user' ? (
                <Step key={i} step={{ type: 'userPrompt', text: fillName(t.text, viewer), id: 'u' + i }} assistant={assistant} brand={brand} />
              ) : (
                <Step key={i} step={{ ...t.step, text: fillName(t.step.text, viewer), title: fillName(t.step.title, viewer) }} assistant={assistant} brand={brand} />
              ),
            )}
            {thinking && <ThinkingRow phrases={thinking.phrases} assistant={assistant} brand={brand} />}
          </>
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
          <textarea
            ref={inputRef}
            className="tc-input-field"
            rows={1}
            value={input}
            placeholder={`Message ${assistant.name || 'Copilot'}`}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onClick={fillNextPrompt}
            aria-label={`Message ${assistant.name || 'Copilot'}`}
          />
          <button type="button" className="tc-send" title="Send" aria-label="Send" onClick={() => send()}>
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

export default function TeamsCopilotFrame({ brand, assistant, script, resetSignal, chatTitle, viewer, groupChat, members, sidebar }) {
  const brandLogo = (brand.logoUrl || '').trim() || CUMULUS_LOGO
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
          <div className="tw-profile has-logo">
            <img src={brandLogo} alt={brand.name || 'Brand'} />
          </div>
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
          <div className="tw-rail-avatar has-logo">
            <img src={brandLogo} alt={brand.name || 'Brand'} />
          </div>
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
              renderedSteps={[]}
              isRunning={false}
              chatTitle={chatTitle}
              viewer={viewer}
              messages={groupChat}
              members={members}
            />
          ) : (
            <CopilotSurface brand={brand} assistant={assistant} script={script} resetSignal={resetSignal} viewer={viewer} />
          )}
        </div>
      </div>
    </div>
  )
}
