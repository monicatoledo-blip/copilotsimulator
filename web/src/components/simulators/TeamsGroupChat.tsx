import { useEffect, useRef, useState } from 'react'
import './teams-group.css'
import CopilotMark from './CopilotMark'
import { renderInline, renderRich } from './richText'
import { FLUENT_EMOJI } from './fluentEmojiData'
import { COMPOSER_ICONS } from './composerIconData'

const AVATAR_COLORS = ['#c4314b', '#0f6cbd', '#107c41', '#8764b8', '#c19c00', '#005b70', '#a4262c']

// Microsoft Teams quick-reaction set (rendered as Fluent emoji, not native/Apple).
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡']

function emojiSrc(ch) {
  if (!ch) return undefined
  return FLUENT_EMOJI[ch] || FLUENT_EMOJI[ch.replace(/\uFE0F/g, '')]
}

function Emoji({ ch, size = 18 }) {
  const src = emojiSrc(ch)
  if (!src) return <span className="tg-uni">{ch}</span>
  return <img className="tg-fluent-emoji" src={src} width={size} height={size} alt={ch} draggable={false} />
}

function colorFor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function initials(name) {
  const parts = (name || '?').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function useHoverCard() {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)
  const show = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cardW = 280
    let x = rect.left
    if (x + cardW > window.innerWidth - 12) x = window.innerWidth - cardW - 12
    if (x < 12) x = 12
    let y = rect.bottom + 6
    if (y + 170 > window.innerHeight) y = rect.top - 176
    setPos({ x, y })
  }
  const hide = () => setPos(null)
  return { ref, pos, show, hide }
}

function PersonAvatar({ name, persona }) {
  const { ref, pos, show, hide } = useHoverCard()
  return (
    <span className="tg-avatarwrap" ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      <span className="tg-avatar" style={{ background: colorFor(name) }}>
        {initials(name)}
      </span>
      <span className="tg-presence" title="Available">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {pos && <ProfileCard name={name} persona={persona} pos={pos} />}
    </span>
  )
}

function CopilotAvatar({ persona } = {}) {
  const { ref, pos, show, hide } = useHoverCard()
  return (
    <span className="tg-avatarwrap" ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      <span className="tg-avatar is-copilot">
        <CopilotMark size={28} />
      </span>
      {pos && <ProfileCard name="Copilot" persona={persona} pos={pos} />}
    </span>
  )
}

function ProfileCard({ name, persona, pos }) {
  const isCopilot = name === 'Copilot'
  return (
    <div className="tg-personcard" style={{ left: pos.x, top: pos.y }}>
      <div className="tg-pc-head">
        <span
          className={`tg-pc-avatar ${isCopilot ? 'is-copilot' : ''}`}
          style={isCopilot ? undefined : { background: colorFor(name) }}
        >
          {isCopilot ? (
            <CopilotMark size={40} />
          ) : persona?.avatarUrl ? (
            <img src={persona.avatarUrl} alt={name} />
          ) : (
            initials(name)
          )}
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="tg-pc-name">
            {name}
            <span className="tg-pc-presence" title="Available" />
          </div>
          {persona?.title && <div className="tg-pc-title">{persona.title}</div>}
        </div>
      </div>
      <div className="tg-pc-actions">
        <button type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat
        </button>
        <button type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M23 7l-7 5 7 5z" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
          Meet
        </button>
        <button type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
          </svg>
          Call
        </button>
      </div>
    </div>
  )
}

function PersonName({ name, persona, className }) {
  const { ref, pos, show, hide } = useHoverCard()
  return (
    <>
      <span
        ref={ref}
        className={`tg-personname ${className || ''}`}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {name}
      </span>
      {pos && <ProfileCard name={name} persona={persona} pos={pos} />}
    </>
  )
}

function ReactionToolbar({ onPick }) {
  return (
    <div className="tg-react-tool">
      {QUICK_REACTIONS.map((e) => (
        <button
          type="button"
          key={e}
          title="React"
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => onPick(e)}
        >
          <Emoji ch={e} size={20} />
        </button>
      ))}
      <span className="tg-tool-sep" />
      <button type="button" className="tg-tool-more" title="More options">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  )
}

function CopilotTurn({ step, quote, personaOf, reactions, onReact, onUnreact }) {
  return (
    <div className="tg-row is-copilot">
      <CopilotAvatar persona={personaOf('Copilot')} />
      <div className="tg-col">
        <div className="tg-cop-head">
          <PersonName className="tg-cop-name" name="Copilot" persona={personaOf('Copilot')} />
          <span className="tg-ai-badge">AI generated</span>
        </div>

        {quote && (
          <div className="tg-quote">
            <div className="tg-quote-meta">
              <PersonName className="tg-quote-name" name={quote.author} persona={personaOf(quote.author)} />
            </div>
            <div className="tg-quote-text">{renderInline(quote.text, 'q' + step.id)}</div>
          </div>
        )}

        {step.type === 'toolAction' ? (
          <div className="tg-cop-body">
            <p className="tg-p">
              <strong>{step.title || 'Action complete'}</strong>
            </p>
            <p className="tg-p">{renderInline(step.text, 'tool' + step.id)}</p>
          </div>
        ) : (
          <div className="tg-cop-body">{renderRich(step.text, step.id)}</div>
        )}

        <div className="tg-feedback">
          <button type="button" title="Like">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1.5 6a2 2 0 0 1-2 1.5H7" />
            </svg>
          </button>
          <button type="button" title="Dislike">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M17 13V4h3v9zM17 13l-4 7a2 2 0 0 1-3-2l1-5H6a2 2 0 0 1-2-2l1.5-6A2 2 0 0 1 7.5 4H17" />
            </svg>
          </button>
        </div>

        <Reactions reactions={reactions} onReact={onReact} onUnreact={onUnreact} />
        <ReactionToolbar onPick={onReact} />
      </div>
    </div>
  )
}

function Reactions({ reactions, onReact, onUnreact }) {
  if (!reactions || reactions.length === 0) return null
  return (
    <div className="tg-reacts">
      {reactions.map((r, i) => (
        <button
          type="button"
          className={`tg-react${r.mine ? ' is-mine' : ''}`}
          key={r.emoji + i}
          title={r.mine ? 'Remove your reaction' : 'React'}
          onClick={() => (r.mine ? onUnreact : onReact)(r.emoji)}
        >
          <Emoji ch={r.emoji} size={16} />
          <span className="c">{r.count}</span>
        </button>
      ))}
    </div>
  )
}

function PersonTurn({ step, viewer, personaOf, reactions, onReact, onUnreact }) {
  const isYou = !step.author || step.author === viewer
  if (isYou) {
    return (
      <div className="tg-row is-you">
        <div className="tg-col">
          <div className="tg-bubble">{renderInline(step.text, 'you' + step.id)}</div>
          <Reactions reactions={reactions} onReact={onReact} onUnreact={onUnreact} />
          <div className="tg-sent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l2.5 2.5L16 9" />
            </svg>
          </div>
          <ReactionToolbar onPick={onReact} />
        </div>
      </div>
    )
  }
  return (
    <div className="tg-row">
      <PersonAvatar name={step.author} persona={personaOf(step.author)} />
      <div className="tg-col">
        <div className="tg-meta">
          <PersonName className="tg-name" name={step.author} persona={personaOf(step.author)} />
        </div>
        <div className="tg-bubble">{renderInline(step.text, 'p' + step.id)}</div>
        <Reactions reactions={reactions} onReact={onReact} onUnreact={onUnreact} />
        <ReactionToolbar onPick={onReact} />
      </div>
    </div>
  )
}

export default function TeamsGroupChat({ brand, renderedSteps, isRunning, chatTitle, viewer = 'You', messages = [], members }) {
  const history = messages || []

  // Messages the viewer types into the composer during playback (ephemeral).
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState([])
  const threadRef = useRef(null)

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setSent((prev) => [
      ...prev,
      { id: `usr-${Date.now()}-${prev.length}`, type: 'userPrompt', author: viewer, text },
    ])
    setDraft('')
  }

  const combined = [...history, ...renderedSteps, ...sent]

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [sent.length, renderedSteps.length])

  // Ephemeral reactions added live by the viewer, merged on top of authored ones.
  const [extra, setExtra] = useState({})
  const reactionsFor = (step) => {
    const map = {}
    ;(step.reactions || []).forEach((r) => {
      map[r.emoji] = (map[r.emoji] || 0) + (r.count || 1)
    })
    const add = extra[step.id]
    if (add) Object.keys(add).forEach((e) => (map[e] = (map[e] || 0) + add[e]))
    return Object.keys(map)
      .filter((e) => map[e] > 0)
      .map((e) => ({ emoji: e, count: map[e], mine: !!(add && add[e] > 0) }))
  }
  const bump = (stepId, emoji, delta) =>
    setExtra((prev) => {
      const cur = { ...(prev[stepId] || {}) }
      cur[emoji] = (cur[emoji] || 0) + delta
      return { ...prev, [stepId]: cur }
    })

  const memberList = (members || []).map((m) => (typeof m === 'string' ? { name: m } : m))
  const personaMap = {}
  memberList.forEach((m) => {
    if (m && m.name) personaMap[m.name] = { title: m.title, avatarUrl: m.avatarUrl }
  })
  if (!personaMap.Copilot) personaMap.Copilot = { title: 'AI assistant' }
  const personaOf = (name) => personaMap[name]

  const lastStep = combined[combined.length - 1]
  const showTyping = isRunning && (!lastStep || lastStep.type === 'userPrompt')

  const isCopilotStep = (s) => s && (s.type === 'assistantResponse' || s.type === 'toolAction')

  return (
    <section className="tg-surface">
      <div className="tg-chat-header">
        <span className="tg-chan-avatar" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
            <circle cx="8" cy="9" r="2.4" />
            <circle cx="16" cy="9" r="2.4" />
            <path d="M3.5 18a4.5 4.5 0 0 1 9 0z" />
            <path d="M11.5 18a4.5 4.5 0 0 1 9 0z" />
          </svg>
        </span>
        <div className="tg-chat-title">{chatTitle || `${brand.name} Team`}</div>
        <div className="tg-tabs">
          <button type="button" className="tg-tab is-active">Chat</button>
          <button type="button" className="tg-tab">Shared</button>
          <button type="button" className="tg-tab-add" title="Add a tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <div className="tg-chat-actions">
          <button type="button" title="Video call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M23 7l-7 5 7 5z" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </button>
          <button type="button" title="Audio call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </button>
          <button type="button" title="Add people">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3 20a6 6 0 0 1 12 0" />
              <path d="M18 8v6M21 11h-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="tg-thread" ref={threadRef}>
        <div className="tg-divider"><span>Today</span></div>
        {combined.map((step, idx) => {
          if (isCopilotStep(step)) {
            const prev = combined[idx - 1]
            const quote =
              prev && prev.type === 'userPrompt'
                ? { author: prev.author || viewer, text: prev.text }
                : null
            return (
              <CopilotTurn
                key={step.id}
                step={step}
                quote={quote}
                personaOf={personaOf}
                reactions={reactionsFor(step)}
                onReact={(e) => bump(step.id, e, 1)}
                onUnreact={(e) => bump(step.id, e, -1)}
              />
            )
          }
          return (
            <PersonTurn
              key={step.id}
              step={step}
              viewer={viewer}
              personaOf={personaOf}
              reactions={reactionsFor(step)}
              onReact={(e) => bump(step.id, e, 1)}
              onUnreact={(e) => bump(step.id, e, -1)}
            />
          )
        })}

        {showTyping && (
          <div className="tg-typing-row">
            <CopilotAvatar persona={personaOf('Copilot')} />
            <span className="tg-typing-text">Copilot is typing</span>
            <span className="tg-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
      </div>

      <div className="tg-composer">
        <div className="tg-composer-box">
          <input
            className="tg-composer-input"
            placeholder="Type a new message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
        </div>
        <div className="tg-composer-tools">
          <button type="button" title="Format">
            <img src={COMPOSER_ICONS.format} alt="" />
          </button>
          <button type="button" title="Attach file">
            <img src={COMPOSER_ICONS.attach} alt="" />
          </button>
          <button type="button" title="Emoji">
            <img src={COMPOSER_ICONS.emoji} alt="" />
          </button>
          <button type="button" title="GIF">
            <img src={COMPOSER_ICONS.gif} alt="" />
          </button>
          <button type="button" title="Sticker">
            <img src={COMPOSER_ICONS.sticker} alt="" />
          </button>
          <button type="button" title="Schedule">
            <img src={COMPOSER_ICONS.schedule} alt="" />
          </button>
          <div className="tg-spacer" />
          <button
            type="button"
            className="tg-send"
            title="Send"
            disabled={!draft.trim()}
            onClick={send}
          >
            <img src={COMPOSER_ICONS.send} alt="Send" />
          </button>
        </div>
      </div>
    </section>
  )
}
