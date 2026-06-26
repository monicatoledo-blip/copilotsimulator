import { useEffect, useRef, useState } from 'react'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'

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
          <span>{r.emoji}</span>
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
          padding: '2px 10px',
          cursor: 'pointer',
          fontSize: 13,
          color: '#444',
        }}
      >
        <span style={{ fontSize: 14 }}>☺</span>
        <span style={{ fontSize: 12 }}>+</span>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 60 }}>
          <EmojiPicker
            onEmojiClick={(emojiData) => addEmoji(emojiData.emoji)}
            emojiStyle={EmojiStyle.NATIVE}
            width={300}
            height={360}
            lazyLoadEmojis
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  )
}
