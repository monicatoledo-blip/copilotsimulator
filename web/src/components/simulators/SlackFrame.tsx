import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import './slack.css'
import { renderRich, renderInline } from './richText'
import { VizBlock } from './vizBlocks'
import { SLACKBOT_ICON } from './slackbotIconData'
import { SALESFORCE_LOGO } from './salesforceLogoData'
import { SL_ICON_PLUS, SL_ICON_AA, SL_ICON_SKILLS, SL_ICON_APPS, SL_ICON_MIC, SL_ICON_SEND, SL_ICON_SEND_READY, CH_AA, CH_EMOJI, CH_MENTION, CH_VIDEO, CH_MIC, CH_SLASH, CH_SEND, CH_CHEVRON, TB_ADD, TB_THREAD, TB_FORWARD, TB_BOOKMARK, TB_BOT, TB_MORE } from './slackIconData'
import {
  READ_ONLY_TOOLS,
  WRITE_TOOLS,
  READ_ONLY_DEFAULT_MODE,
  WRITE_DEFAULT_MODE,
} from './securityModelData'

// ── shared helpers ──────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#4A154B', '#1264A3', '#2BAC76', '#E8912D', '#7C3AED', '#0B6E99', '#CD2553']
function colorFor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
function initials(name) {
  const p = (name || '?').trim().split(/\s+/)
  return (p.length === 1 ? p[0].charAt(0) : p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase()
}
// Darken a #hex by pct (0..1) — used to derive the rail shade from the theme color.
function shade(hex, pct) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim())
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - pct)))
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - pct)))
  const b = Math.max(0, Math.round((n & 255) * (1 - pct)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
// True when a #hex color is light enough to need dark foreground text.
function isLightColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim())
  if (!m) return false
  const n = parseInt(m[1], 16)
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return lum > 150
}
function hexToRgba(hex, a) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim())
  if (!m) return `rgba(255,255,255,${a})`
  const n = parseInt(m[1], 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
// Foreground CSS vars. Text auto-contrasts from the theme color (dark→white,
// light→dark). The badge/notification color is a separate accent (defaults red).
function fgVars(themeColor, badgeAccent) {
  const light = isLightColor(themeColor)
  const badge = (badgeAccent && /^#?[0-9a-f]{6}$/i.test(String(badgeAccent).trim())) ? badgeAccent : '#e01e5a'
  const badgeFg = isLightColor(badge) ? '#111' : '#fff'
  const base = light
    ? { '--sl-fg': 'rgba(0,0,0,0.82)', '--sl-fg-muted': 'rgba(0,0,0,0.58)', '--sl-fg-faint': 'rgba(0,0,0,0.45)', '--sl-fg-strong': '#111', '--sl-fg-soft': 'rgba(0,0,0,0.10)' }
    : { '--sl-fg': 'rgba(255,255,255,0.82)', '--sl-fg-muted': 'rgba(255,255,255,0.60)', '--sl-fg-faint': 'rgba(255,255,255,0.48)', '--sl-fg-strong': '#fff', '--sl-fg-soft': 'rgba(255,255,255,0.12)' }
  return { ...base, '--sl-badge': badge, '--sl-badge-fg': badgeFg }
}
function fillName(text, viewer) {
  if (text == null) return text
  return String(text).replace(/\{\{?\s*name\s*\}?\}/gi, viewer || 'there')
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function Avatar({ name, url, size = 36 }) {
  const style = url ? { background: 'transparent' } : { background: colorFor(name), width: size, height: size }
  return (
    <span className="sl-avatar" style={style}>
      {url ? <img src={url} alt={name} /> : <span className="sl-avatar-txt">{initials(name)}</span>}
    </span>
  )
}

const QUICK_REACTS = ['👍', '✅', '🎉', '❤️', '👀', '😄', '🙌', '🔥']

function Reactions({ reactions, onToggle }) {
  if (!reactions || !reactions.length) return null
  return (
    <div className="sl-reacts">
      {reactions.map((r, i) => (
        <button
          type="button"
          className={`sl-react${r.mine ? ' is-mine' : ''}`}
          key={r.emoji + i}
          title={r.mine ? 'Remove your reaction' : 'Add reaction'}
          onClick={() => onToggle && onToggle(r.emoji, r.mine ? -1 : 1)}
        >
          <span className="sl-react-e">{r.emoji}</span>
          <span className="sl-react-c">{r.count}</span>
        </button>
      ))}
    </div>
  )
}

const TOOLBAR_QUICK = ['😆', '💕', '✅']

function MsgTools({ onReact }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="sl-msg-tools">
      {TOOLBAR_QUICK.map((e) => (
        <button type="button" className="sl-tool-btn sl-tip" data-tip="React" key={e} onClick={() => onReact(e, 1)}>{e}</button>
      ))}
      <div className="sl-tool-emoji">
        <button type="button" className="sl-tool-btn sl-tip" data-tip="Find another reaction" onClick={() => setOpen((o) => !o)}>
          <img className="sl-tool-ico" src={TB_ADD} alt="Add reaction" />
        </button>
        {open && (
          <div className="sl-emoji-pop" onMouseLeave={() => setOpen(false)}>
            {QUICK_REACTS.map((e) => (
              <button type="button" key={e} title={e} onClick={() => { onReact(e, 1); setOpen(false) }}>{e}</button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="sl-tool-btn sl-tip" data-tip="Reply in thread"><img className="sl-tool-ico" src={TB_THREAD} alt="Thread" /></button>
      <button type="button" className="sl-tool-btn sl-tip" data-tip="Forward message"><img className="sl-tool-ico" src={TB_FORWARD} alt="Forward" /></button>
      <button type="button" className="sl-tool-btn sl-tip" data-tip="Save for later"><img className="sl-tool-ico" src={TB_BOOKMARK} alt="Save" /></button>
      <button type="button" className="sl-tool-btn sl-tip" data-tip="More message shortcuts"><img className="sl-tool-ico" src={TB_BOT} alt="Shortcuts" /></button>
      <button type="button" className="sl-tool-btn sl-tip" data-tip="More actions"><img className="sl-tool-ico" src={TB_MORE} alt="More" /></button>
    </div>
  )
}

// ── left: workspace rail + channel sidebar ──────────────────────────────────
function railIcon(path) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  )
}

const RAIL_ICONS = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  dms: <><path d="M4 5h16v10H8l-4 4z" /><path d="M8 9h8M8 12h5" /></>,
  activity: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  sales: <><path d="M4 19h16" /><path d="M6 16l3-4 3 2 5-7" /><path d="M17 5h2v2" /></>,
  files: <><rect x="7" y="4" width="10" height="12" rx="1.5" /><path d="M5 7v11a1 1 0 0 0 1 1h9" /></>,
  more: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
}
const DEFAULT_RAIL = [
  { key: 'home', label: 'Home', active: true, tile: true, dot: true },
  { key: 'dms', label: 'DMs', badge: '1' },
  { key: 'activity', label: 'Activity', badge: '61' },
  { key: 'sales', label: 'Sales' },
  { key: 'files', label: 'Files' },
  { key: 'more', label: 'More', badge: '3' },
]

function RailItem({ item, onClick }) {
  const glyph = item.img
    ? <img src={item.img} alt="" className="sl-rail-img" />
    : railIcon(RAIL_ICONS[item.icon || item.key] || RAIL_ICONS.home)
  return (
    <button type="button" className={`sl-rail-item ${item.active ? 'is-active' : ''}`} onClick={onClick}>
      <span className={`sl-rail-ico ${item.tile ? 'is-tile' : ''} ${item.img ? 'is-img' : ''}`}>
        {glyph}
        {item.dot && <span className="sl-rail-dot" />}
        {item.badge && <span className="sl-rail-badge">{item.badge}</span>}
      </span>
      {item.label && <span className="sl-rail-label">{item.label}</span>}
    </button>
  )
}

function WorkspaceRail({ brand, rail, viewer, viewerAvatarUrl, onToggleBot, botOpen }) {
  const items = Array.isArray(rail) && rail.length ? rail : DEFAULT_RAIL
  const wsIcon = (brand?.workspaceIcon || '').trim() || (brand?.logoUrl || '').trim() || SALESFORCE_LOGO
  return (
    <nav className="sl-rail" aria-label="Workspace">
      <div className={`sl-rail-ws ${brand?.logoBackdrop ? 'has-backdrop' : ''}`} title={brand?.name || 'Workspace'}>
        {wsIcon ? <img src={wsIcon} alt={brand?.name || 'Workspace'} /> : (brand?.name || 'W').charAt(0).toUpperCase()}
      </div>
      <RailItem item={{ key: 'slackbot', label: 'Slackbot', img: SLACKBOT_ICON, active: botOpen }} onClick={onToggleBot} />
      {items.map((it, i) => <RailItem key={it.key || i} item={it} />)}
      <div className="sl-rail-spacer" />
      <button type="button" className="sl-rail-round" title="Create new" aria-label="Create new">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <button type="button" className="sl-rail-round" title="Toggle theme" aria-label="Toggle theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      </button>
      <span className="sl-rail-me">
        {viewerAvatarUrl ? <img src={viewerAvatarUrl} alt={viewer || 'You'} /> : <span className="sl-rail-me-txt" style={{ background: colorFor(viewer || 'You') }}>{initials(viewer || 'You')}</span>}
        <span className="sl-rail-presence" />
      </span>
    </nav>
  )
}

const QUICK_NAV = [
  { label: 'Threads', icon: <><path d="M18 10c0 3.3-3.1 6-7 6-.9 0-1.7-.1-2.5-.4L4 17l1.2-3A5.4 5.4 0 0 1 4 10c0-3.3 3.1-6 7-6s7 2.7 7 6z" /><path d="M8.5 9.5h5M8.5 12h3" /></> },
  { label: 'Huddles', icon: <><path d="M4 12a8 8 0 0 1 16 0" /><rect x="3" y="12" width="4" height="6" rx="1.5" /><rect x="17" y="12" width="4" height="6" rx="1.5" /></> },
  { label: 'Recap', icon: <><path d="M6 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" /><path d="M12 7h8M12 12h8M12 17h8M5 12h2M5 17h2" /></> },
  { label: 'Drafts & sent', icon: <path d="M4 5l16 7-16 7 3-7z" /> },
  { label: 'Directories', icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="10" cy="10" r="2" /><path d="M6.5 16a3.5 3.5 0 0 1 7 0M16 8h2M16 12h2" /></> },
]
const SECTION_ICONS = {
  Broadcast: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v3M9 20h6" /></>,
  Salesforce: <><path d="M8 12a3 3 0 0 1 5.7-1.3A3.5 3.5 0 1 1 16 17H8a2.5 2.5 0 0 1 0-5z" /></>,
  Channels: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 8l-1 8M15 8l-1 8M7 11h9M7 14h9" /></>,
  'Direct messages': <><path d="M20 14a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" /></>,
}

function ChannelSidebar({ brand, sidebar, activeChannel }) {
  const items = Array.isArray(sidebar) && sidebar.length ? sidebar : []
  const order = []
  const groups = {}
  items.forEach((it) => {
    const sec = it.section || 'Channels'
    if (!groups[sec]) { groups[sec] = []; order.push(sec) }
    groups[sec].push(it)
  })
  const secIcon = (sec) => (
    <svg className="sl-sec-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{SECTION_ICONS[sec] || SECTION_ICONS.Channels}</svg>
  )
  return (
    <aside className="sl-sidebar" aria-label="Channels">
      <div className="sl-sb-head">
        <button type="button" className="sl-ws-switch">{brand?.name || 'Workspace'}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg></button>
        <div className="sl-sb-head-actions">
          <button type="button" aria-label="Settings"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.53 1.53 0 0 1-2.29.95c-1.37-.84-2.94.73-2.1 2.1.54.88.08 2.03-.95 2.29-1.56.38-1.56 2.6 0 2.98a1.53 1.53 0 0 1 .95 2.29c-.84 1.37.73 2.94 2.1 2.1.88-.54 2.03-.08 2.29.95.38 1.56 2.6 1.56 2.98 0a1.53 1.53 0 0 1 2.29-.95c1.37.84 2.94-.73 2.1-2.1a1.53 1.53 0 0 1 .95-2.29c1.56-.38 1.56-2.6 0-2.98a1.53 1.53 0 0 1-.95-2.29c.84-1.37-.73-2.94-2.1-2.1a1.53 1.53 0 0 1-2.29-.95zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg></button>
          <button type="button" aria-label="New message"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg></button>
        </div>
      </div>
      <div className="sl-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        <span>Find a conversation…</span>
      </div>
      <div className="sl-quick">
        {QUICK_NAV.map((q) => (
          <div className="sl-quick-item" key={q.label}>
            <svg className="sl-quick-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{q.icon}</svg>
            {q.label}
          </div>
        ))}
      </div>
      <div className="sl-sb-divider" />
      <div className="sl-sec-row"><svg className="sl-sec-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" /></svg>Starred</div>
      <div className="sl-starred-empty">Drag and drop important stuff here</div>
      {order.map((sec) => (
        <Fragment key={sec}>
          <div className="sl-sec-row">{secIcon(sec)}{sec}</div>
          {groups[sec].map((it) => {
            const isChan = it.type !== 'person'
            const active = it.name === activeChannel
            return (
              <div key={it.id || it.name} className={`sl-chan ${active ? 'is-active' : ''} ${it.unread ? 'is-unread' : ''}`}>
                <span className="sl-chan-glyph">{isChan ? '#' : <span className={`sl-presence-dot ${it.presence === 'away' ? 'is-away' : 'is-active'}`} />}</span>
                <span className="sl-chan-name">{it.name}</span>
              </div>
            )
          })}
        </Fragment>
      ))}
      <div className="sl-sec-row is-bold sl-agents">
        <svg className="sl-sec-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="7" r="3" /><path d="M14 5l2.5 2.5L19 5M14 9l2.5-2.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><path d="M17 14l3 6h-6z" /></svg>
        Agents &amp; apps
        <span className="sl-agents-badge">1</span>
      </div>
    </aside>
  )
}

// ── center: channel with pre-seeded human history ───────────────────────────
function ChannelHeader({ title, memberCount, botOpen, onToggleBot }) {
  return (
    <div className="sl-ch-head">
      <div className="sl-ch-title"># {title}</div>
      <div className="sl-ch-head-right">
        <div className="sl-ch-members">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /></svg>
          {memberCount || 283}
        </div>
        <button type="button" className={`sl-bot-toggle sl-tip ${botOpen ? 'is-on' : ''}`} data-tip={botOpen ? 'Close Slackbot' : 'Slackbot'} aria-label="Toggle Slackbot" onClick={onToggleBot}>
          <span className="sl-bot-avatar is-img"><img src={SLACKBOT_ICON} alt="Slackbot" /></span>
        </button>
      </div>
    </div>
  )
}

function useHoverCard() {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)
  const show = () => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const cardW = 340
    let x = r.left
    if (x + cardW > window.innerWidth - 12) x = window.innerWidth - cardW - 12
    let y = r.bottom + 8
    if (y + 240 > window.innerHeight) y = Math.max(12, r.top - 248)
    setPos({ x, y: Math.max(12, y) })
  }
  const hide = () => setPos(null)
  return { ref, pos, show, hide }
}

function ProfileHoverCard({ name, title, avatarUrl, pos }) {
  return (
    <div className="sl-hovercard" style={{ left: pos.x, top: pos.y }}>
      <div className="sl-hovercard-top">
        {avatarUrl ? <img className="sl-hovercard-av" src={avatarUrl} alt="" /> : <span className="sl-hovercard-av sl-hovercard-init" style={{ background: colorFor(name) }}>{initials(name)}</span>}
        <div className="sl-hovercard-meta">
          <div className="sl-hovercard-name">{name} <span className="sl-hovercard-presence" /></div>
          {title && <div className="sl-hovercard-title">{title}</div>}
        </div>
      </div>
      <div className="sl-hovercard-time">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        9:41 AM local time
      </div>
      <div className="sl-hovercard-actions">
        <button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>Message</button>
        <button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 13a8 8 0 0 1 16 0M4 13v3a2 2 0 0 0 2 2M20 13v3a2 2 0 0 1-2 2" /></svg>Huddle<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></button>
        <button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M18 8v6M21 11h-6" /></svg>VIP</button>
      </div>
    </div>
  )
}

function PersonHover({ name, title, avatarUrl, children, className }) {
  const { ref, pos, show, hide } = useHoverCard()
  return (
    <>
      <span ref={ref} className={className} onMouseEnter={show} onMouseLeave={hide} style={{ cursor: 'pointer' }}>{children}</span>
      {pos && <ProfileHoverCard name={name} title={title} avatarUrl={avatarUrl} pos={pos} />}
    </>
  )
}

function ChannelThread({ messages, viewer, personaOf, viewerAvatarUrl }) {
  const rows = messages || []
  const [extra, setExtra] = useState({})
  const bump = (id, emoji, delta) => {
    if (!emoji || emoji === '__open') return
    setExtra((prev) => {
      const cur = { ...(prev[id] || {}) }
      cur[emoji] = (cur[emoji] || 0) + delta
      return { ...prev, [id]: cur }
    })
  }
  const reactionsFor = (step, id) => {
    const map = {}
    ;(step.reactions || []).forEach((r) => { map[r.emoji] = (map[r.emoji] || 0) + (r.count || 1) })
    const add = extra[id]
    if (add) Object.keys(add).forEach((e) => (map[e] = (map[e] || 0) + add[e]))
    return Object.keys(map).filter((e) => map[e] > 0).map((e) => ({ emoji: e, count: map[e], mine: !!(add && add[e] > 0) }))
  }
  return (
    <div className="sl-ch-thread">
      <div className="sl-day-divider">
        <button type="button" className="sl-day-pill">Today <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4" /></svg></button>
      </div>
      {rows.map((step, idx) => {
        const id = step.id || 'm' + idx
        const prev = rows[idx - 1]
        const grouped = prev && prev.author === step.author
        const persona = personaOf(step.author)
        const time = step.time || '10:36 AM'
        const who = step.author || viewer
        const av = (step.author === viewer || !step.author) ? (viewerAvatarUrl || persona?.avatarUrl) : persona?.avatarUrl
        const title = persona?.title
        return (
          <div className={`sl-msg ${grouped ? 'is-grouped' : ''}`} key={id}>
            <div className="sl-msg-gutter">
              {!grouped ? <PersonHover name={who} title={title} avatarUrl={av}><Avatar name={who} url={av} /></PersonHover> : <span className="sl-msg-time-hover">{time}</span>}
            </div>
            <div className="sl-msg-body">
              {!grouped && (
                <div className="sl-msg-head">
                  <PersonHover name={who} title={title} avatarUrl={av} className="sl-msg-author">{who}</PersonHover>
                  <span className="sl-msg-time">{time}</span>
                </div>
              )}
              <div className="sl-msg-text">{renderInline(step.text, 'ch' + id, true)}</div>
              <Reactions reactions={reactionsFor(step, id)} onToggle={(e, d) => bump(id, e, d)} />
            </div>
            <MsgTools onReact={(e, d) => bump(id, e, d)} />
          </div>
        )
      })}
    </div>
  )
}

function ChannelComposer({ channel }) {
  const ic = (src, tip) => (
    <button type="button" className="sl-foot-img sl-tip" data-tip={tip}><img src={src} alt={tip} /></button>
  )
  return (
    <div className="sl-ch-composer">
      <div className="sl-ch-inputrow">
        <span className="sl-ch-placeholder">Message #{channel}</span>
      </div>
      <div className="sl-ch-foot">
        <div className="sl-ch-foot-left">
          {ic(SL_ICON_PLUS, 'Shortcuts and files')}
          {ic(CH_AA, 'Formatting')}
          {ic(CH_EMOJI, 'Emoji')}
          {ic(CH_MENTION, 'Mention someone')}
          <span className="sl-ch-div" />
          {ic(CH_VIDEO, 'Record video clip')}
          {ic(CH_MIC, 'Record audio clip')}
          <span className="sl-ch-div" />
          {ic(CH_SLASH, 'Shortcuts')}
        </div>
        <div className="sl-ch-foot-right">
          <button type="button" className="sl-foot-img sl-tip" data-tip="Send"><img src={CH_SEND} alt="Send" /></button>
          <button type="button" className="sl-foot-img"><img src={CH_CHEVRON} alt="" /></button>
        </div>
      </div>
    </div>
  )
}

// ── engine logic (copied verbatim from TeamsCopilotFrame — skin-agnostic) ────
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
  chart: ['Pulling the numbers…', 'Crunching the data…', 'Building your chart…', 'Putting it together…'],
  visualization: ['Putting it together…', 'Mapping it out…', 'Building it now…', 'Almost there…'],
}
const CHART_VIZ_TYPES = new Set(['bar', 'funnel', 'scorecard'])
function phrasesForTurn(responses) {
  if (responses.some((s) => s.type === 'toolAction')) return THINK_PHRASES.toolAction
  if (responses.some((s) => s.type === 'visualization')) {
    const hasChart = responses.some((s) => s.type === 'visualization' && CHART_VIZ_TYPES.has(s.vizType))
    return hasChart ? THINK_PHRASES.chart : THINK_PHRASES.visualization
  }
  return THINK_PHRASES.assistantResponse
}

// ── Slackbot step + thinking renderers ───────────────────────────────────────
function SlackbotAvatar() {
  return (
    <span className="sl-bot-avatar is-img" aria-hidden="true">
      <img src={SLACKBOT_ICON} alt="Slackbot" />
    </span>
  )
}

function BotResponseActions() {
  return (
    <div className="sl-bot-actions">
      <button type="button" title="Copy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg></button>
      <button type="button" title="Good response"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1.5 6a2 2 0 0 1-2 1.5H7" /></svg></button>
      <button type="button" title="Bad response"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 13V4h3v9zM17 13l-4 7a2 2 0 0 1-3-2l1-5H6a2 2 0 0 1-2-2l1.5-6A2 2 0 0 1 7.5 4H17" /></svg></button>
    </div>
  )
}

function BotStep({ step }) {
  if (step.type === 'userPrompt') {
    return (
      <div className="sl-bot-row is-user">
        <Avatar name={step.author || 'You'} url={step.avatarUrl} size={28} />
        <div className="sl-bot-col">
          <div className="sl-bot-head"><span className="sl-bot-name">{step.author || 'You'}</span><span className="sl-bot-time">Just now</span></div>
          <div className="sl-bot-usertext">{renderInline(step.text, step.id, true)}</div>
        </div>
      </div>
    )
  }
  const viz = step.type === 'visualization' ? <VizBlock step={step} /> : null
  return (
    <div className="sl-bot-row">
      <SlackbotAvatar />
      <div className="sl-bot-col">
        <div className="sl-bot-head"><span className="sl-bot-name">Slackbot</span><span className="sl-bot-app">APP</span><span className="sl-bot-time">Just now</span></div>
        <div className="sl-bot-text">
          {step.type === 'toolAction' ? (
            <>
              <p className="tg-p"><strong>{step.title || 'Done'}</strong></p>
              <p className="tg-p">{renderInline(step.text, step.id, true)}</p>
            </>
          ) : step.type === 'visualization' ? (
            <>
              {step.title && <div className="sl-viz-title">{renderInline(step.title, step.id, true)}</div>}
              {viz || <pre className="sl-viz-pre">{step.text}</pre>}
            </>
          ) : (
            renderRich(step.text, step.id, true)
          )}
        </div>
        <BotResponseActions />
      </div>
    </div>
  )
}

function ThinkingRow({ phrases }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 1300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="sl-bot-row">
      <SlackbotAvatar />
      <div className="sl-bot-col">
        <div className="sl-bot-thinking"><span>{phrases[i % phrases.length]}</span></div>
      </div>
    </div>
  )
}

const SUGGESTIONS = ['Catch me up', 'Anything for me?', "What's the vibe?"]

function AssistantWelcome({ channel }) {
  return (
    <div className="sl-bot-welcome">
      <div className="sl-bot-welcome-mark"><SlackbotAvatar /></div>
      <div className="sl-bot-reading">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" /><circle cx="10" cy="10" r="2.25" /></svg>
        <span>Reading along in #{channel || 'general'}</span>
        <button type="button" className="sl-reading-x" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg></button>
      </div>
      <div className="sl-bot-suggest">
        {SUGGESTIONS.map((s) => (
          <button type="button" className="sl-bot-chip" key={s}>{s}</button>
        ))}
      </div>
    </div>
  )
}

function AssistantPane({ assistant, script, viewer, viewerAvatarUrl, resetSignal, onOpenMcp, onOpenApps, channel, onClose }) {
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

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  const fillNextPrompt = () => {
    if (busyRef.current || segIndexRef.current === 0 || input.trim()) return
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
      const totalThink = Math.min(responses.reduce((sum, s) => sum + thinkMs(s), 0), 12000)
      setThinking({ phrases: phrasesForTurn(responses) })
      await delay(totalThink)
      setThinking(null)
      for (let i = 0; i < responses.length; i++) {
        setTurns((t) => [...t, { kind: 'step', step: responses[i] }])
        if (i < responses.length - 1) await delay(600)
      }
    }
    if (!seg) {
      setThinking({ phrases: ['Thinking…'] })
      await delay(900)
      setThinking(null)
      setTurns((t) => [...t, { kind: 'step', step: { id: 'end-' + Date.now(), type: 'assistantResponse', text: "That's the end of this demo flow — refresh to start over." } }])
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
    <section className="sl-botpane">
      <div className="sl-bot-header">
        <div className="sl-bot-header-title"><SlackbotAvatar /><span>{assistant?.name || 'Slackbot'}</span></div>
        <div className="sl-bot-header-actions">
          <button type="button" title="History" aria-label="History"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.25" /><path d="M10 6v4l2.5 2" /></svg></button>
          <button type="button" title="New" aria-label="New"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 3.5l3 3L7 16l-3.5 1 1-3.5z" /><path d="M12 5l3 3" /></svg></button>
          <button type="button" title="More" aria-label="More" onClick={onOpenMcp}><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" /></svg></button>
          <button type="button" title="Close" aria-label="Close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg></button>
        </div>
      </div>
      <div className="sl-bot-thread" ref={threadRef}>
        {!started ? (
          <AssistantWelcome channel={channel} />
        ) : (
          <>
            {turns.map((t, i) =>
              t.kind === 'user' ? (
                <BotStep key={i} step={{ type: 'userPrompt', author: viewer, avatarUrl: viewerAvatarUrl, text: fillName(t.text, viewer), id: 'u' + i }} />
              ) : (
                <BotStep key={i} step={{ ...t.step, text: fillName(t.step.text, viewer), title: fillName(t.step.title, viewer) }} />
              ),
            )}
            {thinking && <ThinkingRow phrases={thinking.phrases} />}
          </>
        )}
      </div>
      <div className="sl-bot-composer">
        <div className="sl-bot-inputbox">
          <textarea
            ref={inputRef}
            className="sl-bot-input"
            rows={1}
            value={input}
            placeholder={`Ask about #${channel || 'general'} — or anything`}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onClick={fillNextPrompt}
            aria-label="Message Slackbot"
          />
          <div className="sl-bot-inputfoot">
            <div className="sl-foot-left">
              <button type="button" className="sl-foot-img sl-tip" data-tip="Shortcuts and files"><img src={SL_ICON_PLUS} alt="Add" /></button>
              <button type="button" className="sl-foot-img sl-tip" data-tip="Formatting"><img src={SL_ICON_AA} alt="Formatting" /></button>
              <button type="button" className="sl-foot-img sl-tip" data-tip="Skills"><img src={SL_ICON_SKILLS} alt="Skills" /></button>
              <button type="button" className="sl-foot-img sl-tip" data-tip="Apps" onClick={onOpenApps}><img src={SL_ICON_APPS} alt="Apps" /></button>
            </div>
            <div className="sl-foot-right">
              <button type="button" className="sl-foot-img sl-tip" data-tip="Record audio clip"><img src={SL_ICON_MIC} alt="Record" /></button>
              <button type="button" className="sl-foot-img sl-send-img sl-tip" data-tip="Send" onClick={() => send()}><img src={input.trim() ? SL_ICON_SEND_READY : SL_ICON_SEND} alt="Send" /></button>
            </div>
          </div>
        </div>
        <div className="sl-bot-disclaimer">{assistant?.name || 'Slackbot'} is AI and can make mistakes.</div>
      </div>
    </section>
  )
}

// ── Slackbot app profile card (Integrations → Apps → Manage) ─────────────────
function AppRow({ name, onManage }) {
  return (
    <div className="sl-app-row">
      <span className="sl-app-ico" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H13l3 3v11.5A1.5 1.5 0 0 1 14.5 20h-8A1.5 1.5 0 0 1 5 18.5z" fill="#1264A3"/><path d="M9 6.5A1.5 1.5 0 0 1 10.5 5H17l3 3v11.5A1.5 1.5 0 0 1 18.5 20" fill="#4a9fd4"/></svg>
      </span>
      <div className="sl-app-meta">
        <div className="sl-app-name">{name} <span className="sl-app-tag">MCP</span></div>
        <div className="sl-app-status">Connected</div>
      </div>
      <button type="button" className="sl-app-manage" onClick={onManage}>Manage</button>
    </div>
  )
}

function SlackbotProfile({ assistant, onClose, onManageMcp }) {
  return (
    <div className="sl-modal-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="sl-profile" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="sl-profile-close" aria-label="Close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        <div className="sl-profile-head">
          <span className="sl-profile-avatar"><img src={SLACKBOT_ICON} alt="" /></span>
          <div>
            <div className="sl-profile-name">{assistant?.name || 'Slackbot'}</div>
            <div className="sl-profile-sub">Here to help you do your best work in Slack.</div>
          </div>
        </div>
        <div className="sl-profile-btns">
          <button type="button" className="sl-profile-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></button>
          <button type="button" className="sl-profile-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/></svg> VIP</button>
        </div>
        <div className="sl-profile-tabs">
          {['About', 'Tabs', 'Integrations', 'Memories'].map((t) => (
            <button type="button" key={t} className={`sl-profile-tab ${t === 'Integrations' ? 'is-active' : ''}`}>{t}</button>
          ))}
        </div>
        <div className="sl-profile-body">
          <div className="sl-apps-card">
            <div className="sl-apps-title">Apps</div>
            <AppRow name="tableau-connect" onManage={onManageMcp} />
            <AppRow name="My MCP Server for MCE" onManage={onManageMcp} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MCP permissions modal (Slack-styled; reuses shared tool inventory) ───────
const PERM_OPTIONS = [
  { key: 'allow', tip: 'Always allow', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { key: 'ask', tip: 'Ask every time', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg> },
  { key: 'deny', tip: 'Never allow', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" strokeLinecap="round" /></svg> },
]
function PermToggle({ value, onChange }) {
  return (
    <div className="sl-perm-toggle" role="group" aria-label="Permission">
      {PERM_OPTIONS.map((opt) => (
        <button key={opt.key} type="button" className={`sl-perm-seg sl-tip is-${opt.key} ${value === opt.key ? 'is-on' : ''}`} data-tip={opt.tip} aria-pressed={value === opt.key} onClick={() => onChange(opt.key)}>
          {opt.icon}
        </button>
      ))}
    </div>
  )
}
function PermGroup({ label, mode, tools, perms, onPermChange, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="sl-perm-group">
      <div className="sl-perm-grouphead">
        <button type="button" className="sl-perm-grouptoggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className={`sl-perm-caret ${open ? 'is-open' : ''}`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 6l6 6-6 6" /></svg></span>
          {label} <span className="sl-perm-count">({tools.length})</span>
        </button>
        <span className="sl-perm-modeselect">{mode}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></span>
      </div>
      {open && (
        <div className="sl-perm-tools">
          {tools.map((tool) => (
            <div key={tool.name} className="sl-perm-tool">
              <span className="sl-perm-toolname">{tool.name}</span>
              <PermToggle value={perms[tool.name]} onChange={(v) => onPermChange(tool.name, v)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
function McpModal({ assistant, onClose }) {
  const initial = useMemo(() => {
    const out = {}
    READ_ONLY_TOOLS.forEach((t) => (out[t.name] = t.permission))
    WRITE_TOOLS.forEach((t) => (out[t.name] = t.permission))
    return out
  }, [])
  const [perms, setPerms] = useState(initial)
  const setPerm = (name, value) => setPerms((p) => ({ ...p, [name]: value }))
  return (
    <div className="sl-modal-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="sl-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sl-modal-head">
          <div className="sl-modal-title">Manage MCP Server for MCE</div>
          <button type="button" className="sl-modal-close" aria-label="Close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </div>
        <div className="sl-modal-body">
          <div className="sl-modal-sub"><strong>Tool permissions</strong><span>Choose when {assistant?.name || 'Slackbot'} is allowed to use these tools.</span></div>
          <PermGroup label="Read-only tools" mode={READ_ONLY_DEFAULT_MODE} tools={READ_ONLY_TOOLS} perms={perms} onPermChange={setPerm} />
          <PermGroup label="Write tools" mode={WRITE_DEFAULT_MODE} tools={WRITE_TOOLS} perms={perms} onPermChange={setPerm} />
          <div className="sl-perm-disconnect">
            <button type="button" className="sl-perm-disconnect-btn">Disconnect My MCP Server for MCE</button>
            <p>This will remove all My MCP Server for MCE tools from {assistant?.name || 'Slackbot'}. You can reconnect anytime.</p>
          </div>
        </div>
        <div className="sl-modal-foot">
          <button type="button" className="sl-modal-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="sl-modal-btn is-primary" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  )
}

function TopBar({ brand }) {
  const ico = (p, sw = 1.8) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{p}</svg>
  )
  return (
    <div className="sl-topbar">
      <div className="sl-topbar-nav">
        <button type="button" aria-label="Back">{ico(<path d="M15 6l-6 6 6 6" />)}</button>
        <button type="button" aria-label="Forward">{ico(<path d="M9 6l6 6-6 6" />)}</button>
        <button type="button" aria-label="History">{ico(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)}</button>
      </div>
      <div className="sl-topbar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        <span>Search {brand?.name || 'Slack'}</span>
      </div>
      <div className="sl-topbar-right">
        <button type="button" aria-label="Help">{ico(<><circle cx="12" cy="12" r="9" /><path d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.3c-.6.3-.9.7-.9 1.5" /><circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none" /></>)}</button>
      </div>
    </div>
  )
}

// ── default export: split-pane Slack window ──────────────────────────────────
export default function SlackFrame({ brand, assistant, script, resetSignal, viewer, groupChat, members, sidebar, chatTitle, rail, viewerAvatarUrl }) {
  const [mcpOpen, setMcpOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [paneOpen, setPaneOpen] = useState(false)
  const [paneWidth, setPaneWidth] = useState(400)
  const [dragging, setDragging] = useState(false)
  const winRef = useRef(null)
  const activeChannel = chatTitle || 'cap1-campaign-ops'
  const memberList = (members || []).map((m) => (typeof m === 'string' ? { name: m } : m))
  const personaMap = {}
  memberList.forEach((m) => {
    if (m && m.name) personaMap[m.name] = { title: m.title, avatarUrl: m.avatarUrl }
  })
  const personaOf = (name) => personaMap[name]

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      if (!winRef.current) return
      const rect = winRef.current.getBoundingClientRect()
      const next = Math.max(320, Math.min(680, rect.right - e.clientX))
      setPaneWidth(next)
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    const prev = document.body.style.cursor
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = prev
      document.body.style.userSelect = ''
    }
  }, [dragging])

  return (
    <div
      className="sl-window"
      ref={winRef}
      style={{ '--sl-aubergine': brand?.themeColor || '#3f0e40', '--sl-aubergine-dark': shade(brand?.themeColor || '#3f0e40', 0.12), ...fgVars(brand?.themeColor || '#3f0e40', brand?.accentColor) }}
    >
      <TopBar brand={brand} />
      <div className="sl-body">
      <WorkspaceRail brand={brand} rail={rail} viewer={viewer} viewerAvatarUrl={viewerAvatarUrl} onToggleBot={() => setPaneOpen((o) => !o)} botOpen={paneOpen} />
      <ChannelSidebar brand={brand} sidebar={sidebar} activeChannel={activeChannel} />
      <main className="sl-main">
        <ChannelHeader title={activeChannel} memberCount={brand?.memberCount} botOpen={paneOpen} onToggleBot={() => setPaneOpen((o) => !o)} />
        <ChannelThread messages={groupChat} viewer={viewer} personaOf={personaOf} viewerAvatarUrl={viewerAvatarUrl} />
        <ChannelComposer channel={activeChannel} />
      </main>
      {paneOpen && (
        <>
          <div className={`sl-resizer ${dragging ? 'is-dragging' : ''}`} role="separator" aria-orientation="vertical" aria-label="Resize Slackbot" onMouseDown={(e) => { e.preventDefault(); setDragging(true) }} />
          <div className="sl-botpane-wrap" style={{ flex: `0 0 ${paneWidth}px`, width: paneWidth }}>
            <AssistantPane assistant={assistant} script={script} viewer={viewer} viewerAvatarUrl={viewerAvatarUrl} resetSignal={resetSignal} onOpenMcp={() => setProfileOpen(true)} onOpenApps={() => setProfileOpen(true)} channel={activeChannel} onClose={() => setPaneOpen(false)} />
          </div>
        </>
      )}
      </div>
      {profileOpen && <SlackbotProfile assistant={assistant} onClose={() => setProfileOpen(false)} onManageMcp={() => { setProfileOpen(false); setMcpOpen(true) }} />}
      {mcpOpen && <McpModal assistant={assistant} onClose={() => setMcpOpen(false)} />}
    </div>
  )
}
