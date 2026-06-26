import { useEffect, useMemo, useRef, useState } from 'react'
import { FLUENT_EMOJI } from './simulators/fluentEmojiData'

// Emojis we promote to the front of the picker (most common reactions first).
const PRIORITY = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👀', '🙌', '👏', '🔥', '💯', '✅', '🚀', '🙏', '💪']

function emojiSrc(ch) {
  if (!ch) return undefined
  return FLUENT_EMOJI[ch] || FLUENT_EMOJI[ch.replace(/\uFE0F/g, '')]
}

function FluentImg({ ch, size = 20 }) {
  const src = emojiSrc(ch)
  if (!src) return <span style={{ fontSize: size }}>{ch}</span>
  return <img src={src} width={size} height={size} alt={ch} draggable={false} style={{ display: 'block' }} />
}

export default function ReactionPicker({ value = [], onChange }) {
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

  // Deduped, priority-ordered list of every Fluent emoji we can render.
  const palette = useMemo(() => {
    const seen = new Set()
    const order = []
    const push = (ch) => {
      const norm = ch.replace(/\uFE0F/g, '')
      if (seen.has(norm)) return
      seen.add(norm)
      order.push(ch)
    }
    PRIORITY.forEach((ch) => {
      if (emojiSrc(ch)) push(ch)
    })
    Object.keys(FLUENT_EMOJI).forEach(push)
    return order
  }, [])

  const addEmoji = (emoji) => {
    const existing = value.find((r) => r.emoji === emoji)
    if (existing) {
      onChange(value.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)))
    } else {
      onChange([...value, { emoji, count: 1 }])
    }
  }

  const removeEmoji = (emoji) => onChange(value.filter((r) => r.emoji !== emoji))

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {value.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => removeEmoji(r.emoji)}
          title="Click to remove"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: '#fff',
            border: '1px solid #e3e3e3',
            borderRadius: 12,
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: 13,
            lineHeight: '18px',
          }}
        >
          <FluentImg ch={r.emoji} size={18} />
          {r.count > 1 && <span style={{ fontSize: 11, fontWeight: 600, color: '#616161' }}>{r.count}</span>}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Add reaction"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: '#f3f3f3',
          border: '1px dashed #c9c9c9',
          borderRadius: 12,
          padding: '3px 10px',
          cursor: 'pointer',
          fontSize: 13,
          color: '#444',
        }}
      >
        <FluentImg ch="🙂" size={16} />
        <span style={{ fontSize: 12 }}>+</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 60,
            width: 296,
            maxHeight: 256,
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
              onClick={() => addEmoji(ch)}
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
              <FluentImg ch={ch} size={24} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
