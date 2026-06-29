import { Fragment } from 'react'
import { FLUENT_EMOJI } from './fluentEmojiData'

/**
 * Lightweight, dependency-free renderer for authored demo copy.
 * Supported syntax (kept simple so it stays configurable in the editor):
 *   @[Full Name] or @Name  -> @mention chip
 *   **bold**               -> bold text
 *   - item                 -> bullet list
 *   ---                    -> divider rule
 *   blank line             -> paragraph break
 *   inline emoji           -> Microsoft Fluent emoji image (when available)
 */

const INLINE_RE = /@\[([^\]]+)\]|@([A-Za-z0-9_]+)|\*\*([^*]+)\*\*/g

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Longest keys first so variation-selector sequences (e.g. ❤️) win over bare ones.
const EMOJI_KEYS = Object.keys(FLUENT_EMOJI).sort((a, b) => b.length - a.length)
const EMOJI_RE = EMOJI_KEYS.length
  ? new RegExp(`(${EMOJI_KEYS.map(escapeRegExp).join('|')})`, 'g')
  : null

function pushText(nodes: React.ReactNode[], str: string, keyPrefix: string) {
  if (!str) return
  if (!EMOJI_RE) {
    nodes.push(str)
    return
  }
  EMOJI_RE.lastIndex = 0
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = EMOJI_RE.exec(str)) !== null) {
    if (m.index > last) nodes.push(str.slice(last, m.index))
    const src = FLUENT_EMOJI[m[0]] || FLUENT_EMOJI[m[0].replace(/\uFE0F/g, '')]
    nodes.push(
      <img
        key={`${keyPrefix}-e${i++}`}
        className="tg-fluent-emoji tg-inline-emoji"
        src={src}
        alt={m[0]}
      />,
    )
    last = EMOJI_RE.lastIndex
  }
  if (last < str.length) nodes.push(str.slice(last))
}

export function renderInline(text: string, keyPrefix = 'i') {
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let i = 0
  INLINE_RE.lastIndex = 0
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > last) pushText(nodes, text.slice(last, match.index), `${keyPrefix}-${i}`)
    if (match[1] || match[2]) {
      nodes.push(
        <span className="tg-mention" key={`${keyPrefix}-m${i++}`}>
          {match[1] || match[2]}
        </span>,
      )
    } else if (match[3]) {
      nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{match[3]}</strong>)
    }
    last = INLINE_RE.lastIndex
  }
  if (last < text.length) pushText(nodes, text.slice(last), `${keyPrefix}-end`)
  return nodes
}

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'hr' }
  | { kind: 'ul'; items: string[] }
  | { kind: 'tool'; text: string }

const ToolGlyph = () => (
  <svg className="tg-toolcall-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
  </svg>
)

export function renderRich(text: string, keyPrefix = 'r') {
  const lines = (text || '').split('\n')
  const blocks: Block[] = []
  let bullets: string[] = []

  const flush = () => {
    if (bullets.length) {
      blocks.push({ kind: 'ul', items: bullets })
      bullets = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed === '---' || trimmed === '—') {
      flush()
      blocks.push({ kind: 'hr' })
    } else if (trimmed.startsWith('> ')) {
      flush()
      blocks.push({ kind: 'tool', text: trimmed.slice(2) })
    } else if (trimmed.startsWith('- ')) {
      bullets.push(trimmed.slice(2))
    } else if (trimmed === '') {
      flush()
    } else {
      flush()
      blocks.push({ kind: 'p', text: line })
    }
  })
  flush()

  return blocks.map((block, idx) => {
    if (block.kind === 'hr') return <hr className="tg-hr" key={`${keyPrefix}-hr${idx}`} />
    if (block.kind === 'tool') {
      return (
        <div className="tg-toolcall" key={`${keyPrefix}-tool${idx}`}>
          <ToolGlyph />
          <span>{renderInline(block.text, `${keyPrefix}-tool${idx}`)}</span>
        </div>
      )
    }
    if (block.kind === 'ul') {
      return (
        <ul className="tg-ul" key={`${keyPrefix}-ul${idx}`}>
          {block.items.map((item, j) => (
            <li key={`${keyPrefix}-li${idx}-${j}`}>{renderInline(item, `${keyPrefix}-li${idx}-${j}`)}</li>
          ))}
        </ul>
      )
    }
    return (
      <p className="tg-p" key={`${keyPrefix}-p${idx}`}>
        {renderInline(block.text, `${keyPrefix}-p${idx}`)}
      </p>
    )
  })
}

export function MentionText({ text }: { text: string }) {
  return <Fragment>{renderInline(text)}</Fragment>
}
