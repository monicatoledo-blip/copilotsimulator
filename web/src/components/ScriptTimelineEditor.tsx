import { useEffect, useMemo, useRef, useState } from 'react'
import { FLUENT_EMOJI } from './simulators/fluentEmojiData'

const TYPES = [
  { value: 'userPrompt', label: 'Customer message' },
  { value: 'assistantResponse', label: 'Agent response' },
  { value: 'toolAction', label: 'Tool action' },
  { value: 'visualization', label: 'Visualization (chart card)' },
]

// Subtle per-type colors so the timeline is easy to scan at a glance.
const STEP_TONES = {
  userPrompt: { accent: '#2a94d6', bg: '#f3f9fd', label: '#1c6fa6' },
  assistantResponse: { accent: '#7a5af0', bg: '#f7f5ff', label: '#5a3fd0' },
  toolAction: { accent: '#e0892a', bg: '#fdf7ee', label: '#b56a12' },
  visualization: { accent: '#1f9d6b', bg: '#f1faf5', label: '#147a51' },
}
const toneFor = (type) => STEP_TONES[type] || STEP_TONES.assistantResponse

const EMOJI_PRIORITY = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👀', '🙌', '👏', '🔥', '💯', '✅', '🚀', '🙏', '💪']

function emojiSrc(ch) {
  if (!ch) return undefined
  return FLUENT_EMOJI[ch] || FLUENT_EMOJI[ch.replace(/\uFE0F/g, '')]
}

function FluentEmoji({ ch, size = 18 }) {
  const src = emojiSrc(ch)
  if (!src) return <span style={{ fontSize: size }}>{ch}</span>
  return <img src={src} width={size} height={size} alt={ch} draggable={false} style={{ display: 'block' }} />
}

function EmojiInsertButton({ onPick }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const palette = useMemo(() => {
    const seen = new Set()
    const order = []
    const push = (ch) => {
      const norm = ch.replace(/\uFE0F/g, '')
      if (seen.has(norm)) return
      if (!emojiSrc(ch)) return
      seen.add(norm)
      order.push(ch)
    }
    EMOJI_PRIORITY.forEach(push)
    Object.keys(FLUENT_EMOJI).forEach(push)
    return order
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="msg-move-btn"
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <FluentEmoji ch="🙂" size={16} />
        Insert emoji
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 100,
            width: 296,
            maxHeight: 240,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #e3e3e3',
            borderRadius: 10,
            boxShadow: '0 10px 32px rgba(0,0,0,.18)',
            padding: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 2,
          }}
        >
          {palette.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => {
                onPick(ch)
                setOpen(false)
              }}
              title={ch}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                padding: 4,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f3f3')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <FluentEmoji ch={ch} size={24} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoHint({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More info"
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '1px solid #cfcfcf',
          background: '#fff',
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 11,
          lineHeight: 1,
          color: '#6a6a6a',
          cursor: 'help',
        }}
      >
        i
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 120,
            width: 320,
            maxWidth: 'min(320px, 80vw)',
            background: '#fff',
            border: '1px solid #e3e3e3',
            borderRadius: 8,
            boxShadow: '0 10px 26px rgba(0,0,0,.16)',
            padding: '8px 10px',
            fontSize: 12,
            lineHeight: 1.45,
            color: '#4b4b4b',
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

const VIZ_TEMPLATES = [
  {
    key: 'bar',
    label: 'Bar chart',
    title: '📊 Activation by Segment',
    text: `New customers          ███████████████  62%
Returning              ████████████     48%
Dormant 90d            ██████           24%
Trial                  ███              12%

|----|----|----|----|----|----|----|
0%  10%  20%  30%  40%  50%  60%  70%`,
  },
  {
    key: 'funnel',
    label: 'Funnel',
    title: '📊 Welcome Pilot — Engagement Funnel',
    text: `24,000 New Customers Entered

|████████████████████████████████████| 24,000  100%
        |
        ▼  62% opened welcome email
|██████████████████████|               14,880  opened
        |
        ▼  41% completed first key action
|██████████████|                        9,840  activated
        |
        ▼  net lift vs. no-journey baseline
|████|  ✅ +34% activation`,
  },
  {
    key: 'scorecard',
    label: 'Scorecard',
    title: '🏁 Activation Scorecard vs. Benchmark',
    text: `WELCOME SERIES SCORECARD

Open Rate         ██████████░░   62%  🟢
Activation Rate   ███████░░░░░   41%  🟡
Time to Activate  ██████████░░   72h  🟢
Unsubscribe       █░░░░░░░░░░░  0.4%  🟢
Revenue vs Goal   ████░░░░░░░░    18%  🔴`,
  },
  {
    key: 'table',
    label: 'Field table',
    title: '🗂️ Data Extension Fields',
    text: `FIELD                TYPE    NOTES
──────────────────────────────────────────
ContactKey           Text    🔑 Primary key
EmailAddress         Email   Sendable address
FirstName            Text    Personalization
LastName             Text    Personalization
SignupDate           Date    Cohort entry
OnboardingStep       Text    Stalled stage
LastLoginDate        Date    Recency signal
AccountType          Text    Segmentation
LifecycleStage       Text    Journey gating
LastModifiedDate     Date    System field
──────────────────────────────────────────
10 fields · sendable on ContactKey → _SubscriberKey`,
  },
]

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)

export default function ScriptTimelineEditor({ script, onChange }) {
  const copyPrompt = (text) => {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text || '')
  }
  const updateStep = (index, key, value) => {
    const next = script.map((step, idx) => (idx === index ? { ...step, [key]: value } : step))
    onChange(next)
  }

  const insertEmoji = (index, step, emoji) => {
    const id = `step-text-${step.id}`
    const el = document.getElementById(id)
    const cur = step.text || ''
    if (!el || typeof el.selectionStart !== 'number' || typeof el.selectionEnd !== 'number') {
      updateStep(index, 'text', `${cur}${emoji}`)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const nextText = `${cur.slice(0, start)}${emoji}${cur.slice(end)}`
    updateStep(index, 'text', nextText)
    requestAnimationFrame(() => {
      const nextEl = document.getElementById(id)
      if (!nextEl) return
      nextEl.focus()
      const pos = start + emoji.length
      nextEl.setSelectionRange(pos, pos)
    })
  }

  const applyVizTemplate = (index, key) => {
    const tpl = VIZ_TEMPLATES.find((t) => t.key === key)
    const next = script.map((s, idx) =>
      idx === index ? { ...s, vizType: key, ...(tpl ? { title: tpl.title, text: tpl.text } : {}) } : s,
    )
    onChange(next)
  }

  const addToolLine = (index, step) => {
    const cur = step.text || ''
    const sep = cur && !cur.endsWith('\n') ? '\n' : ''
    updateStep(index, 'text', `${cur}${sep}> Used SFMC · `)
    requestAnimationFrame(() => {
      const el = document.getElementById(`step-text-${step.id}`)
      if (el) {
        el.focus()
        el.setSelectionRange(el.value.length, el.value.length)
        el.scrollTop = el.scrollHeight
      }
    })
  }

  const moveStep = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= script.length) return
    const next = [...script]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onChange(next)
  }

  const addStep = () => {
    onChange([
      ...script,
      {
        id: `step-${Date.now()}`,
        type: 'assistantResponse',
        text: 'New response',
      },
    ])
  }

  const removeStep = (index) => {
    onChange(script.filter((_, idx) => idx !== index))
  }

  return (
    <div className="form-section">
      <h3>Customer &amp; Agent Messages</h3>
      <p className="download-note" style={{ textAlign: 'left', margin: '0 0 16px' }}>
        Ordered prompts, responses, and tool actions. Plays back exactly as authored for a reliable demo.
      </p>

      {script.map((step, index) => {
        const tone = toneFor(step.type)
        return (
        <div
          key={step.id}
          className="msg-builder-row-inner"
          style={{ flexDirection: 'column', borderLeft: `4px solid ${tone.accent}`, background: tone.bg }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: tone.accent,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            <select
              value={step.type}
              onChange={(e) => updateStep(index, 'type', e.target.value)}
              style={{
                padding: '8px 10px',
                border: `1px solid ${tone.accent}`,
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                color: tone.label,
                background: '#fff',
              }}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
              {step.type === 'userPrompt' && (
                <button
                  type="button"
                  className="msg-move-btn"
                  title="Copy this prompt to paste into your live connected agent"
                  onClick={() => copyPrompt(step.text)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <CopyIcon /> Copy
                </button>
              )}
              <button type="button" className="msg-move-btn" onClick={() => moveStep(index, -1)}>
                Up
              </button>
              <button type="button" className="msg-move-btn" onClick={() => moveStep(index, 1)}>
                Down
              </button>
              <button type="button" className="msg-delete-btn" onClick={() => removeStep(index)}>
                Delete
              </button>
            </div>
          </div>

          {(step.type === 'toolAction' || step.type === 'visualization') && (
            <input
              type="text"
              placeholder={step.type === 'visualization' ? 'Card heading (emoji + title, e.g. 📊 Engagement Funnel)' : 'Tool action title'}
              value={step.title || ''}
              onChange={(e) => updateStep(index, 'title', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #dddbda',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          )}

          {(step.type === 'assistantResponse' || step.type === 'toolAction') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#5b5b5b' }}>
              <button
                type="button"
                className="msg-move-btn"
                onClick={() => addToolLine(index, step)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2.1-2.1 2.8-2.8z" />
                </svg>
                + Add wrench action
              </button>
              <div style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                <InfoHint text="Inserts a > Used SFMC · ... line into the message text below. It renders as a wrench row to show the agent reaching into your MCP server." />
              </div>
            </div>
          )}

          {(step.type === 'userPrompt' || step.type === 'assistantResponse') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#5b5b5b' }}>
              <EmojiInsertButton onPick={(emoji) => insertEmoji(index, step, emoji)} />
              <div style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                <InfoHint text="Insert emoji from the Microsoft Fluent palette used in the Teams chat experience." />
              </div>
            </div>
          )}

          {step.type !== 'userPrompt' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#5b5b5b' }}>
              <label htmlFor={`pacing-${step.id}`}>Effort (adds to the turn’s thinking time):</label>
              <select
                id={`pacing-${step.id}`}
                value={step.pacing || 'medium'}
                onChange={(e) => updateStep(index, 'pacing', e.target.value)}
                style={{ padding: '6px 8px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                <option value="low">Low effort — snappy</option>
                <option value="medium">Medium effort — balanced</option>
                <option value="high">High effort — deliberate</option>
              </select>
            </div>
          )}

          {step.type === 'visualization' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#5b5b5b' }}>
              <label htmlFor={`viztype-${step.id}`}>Visualization type:</label>
              <select
                id={`viztype-${step.id}`}
                value={step.vizType || ''}
                onChange={(e) => applyVizTemplate(index, e.target.value)}
                style={{ padding: '6px 8px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                <option value="">Custom / blank</option>
                {VIZ_TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                <InfoHint text="Pick a type to drop in a starter template, then edit the monospace visualization text below." />
              </div>
            </div>
          )}

          <textarea
            id={`step-text-${step.id}`}
            rows={step.type === 'visualization' ? 8 : 3}
            value={step.text}
            placeholder={step.type === 'visualization' ? 'Build with block chars: █ ▓ ▒ ░ ▮ | ─ ▼ ✅ 🟢🟡🔴' : ''}
            onChange={(e) => updateStep(index, 'text', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #dddbda',
              borderRadius: 4,
              fontSize: step.type === 'visualization' ? 12.5 : 14,
              fontFamily: step.type === 'visualization' ? 'Consolas, "SF Mono", Menlo, ui-monospace, monospace' : 'inherit',
              whiteSpace: step.type === 'visualization' ? 'pre' : 'pre-wrap',
              resize: 'vertical',
              minHeight: step.type === 'visualization' ? 150 : 64,
            }}
          />
          {index === 0 && step.type === 'userPrompt' && (
            <div
              style={{
                width: '100%',
                marginTop: 6,
                border: '1px solid #d9eaf6',
                background: '#f5fbff',
                borderRadius: 6,
                padding: '7px 10px',
                fontSize: 12,
                color: '#1f5f8f',
              }}
            >
              This first prompt is typed manually in the demo (it does not auto-paste). Suggested opener:
              <strong> “Can you see data extensions in my Marketing Cloud?”</strong>
            </div>
          )}
        </div>
        )
      })}

      <button type="button" className="add-message-btn" onClick={addStep}>
        + Add Message
      </button>
    </div>
  )
}
