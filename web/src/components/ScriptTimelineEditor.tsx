import { useEffect, useMemo, useRef, useState } from 'react'
import { FLUENT_EMOJI } from './simulators/fluentEmojiData'
import { useDragReorder, GripIcon } from './useDragReorder'
import { VizBlock } from './simulators/vizBlocks'
import { renderInline } from './simulators/richText'

const TYPES = [
  { value: 'userPrompt', label: 'User input' },
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

// Structured visualization templates — these populate the real chart/table/callout
// data the simulator renders (not ASCII), and are editable via friendly grids below.
const VIZ_TEMPLATES = [
  {
    key: 'bar',
    label: 'Bar chart',
    title: '📊 Campaign vs. Benchmark',
    text: '',
    chart: {
      categories: ['Open Rate', 'Click-Through', 'Unsubscribe'],
      series: [
        { name: 'Campaign Result', color: '#E8912D', values: [51, 24, 0.4] },
        { name: 'Industry Benchmark', color: '#5B6EF5', values: [42, 22, 0.5] },
      ],
      caption: 'This chart was generated using AI, which can produce inaccurate responses.',
    },
  },
  {
    key: 'table',
    label: 'Table',
    title: '🗂️ Data Extension — Fields',
    text: '',
    table: {
      columns: ['Field', 'Type', 'Notes'],
      rows: [
        ['`ContactKey`', 'Text', '🔑 Primary key'],
        ['`EmailAddress`', 'Email', 'Sendable address'],
        ['`FirstName`', 'Text', 'Personalization'],
      ],
    },
  },
  {
    key: 'callout',
    label: 'Callout box',
    title: '',
    calloutTitle: 'Activation is on hold',
    variant: 'success',
    text: 'The journey is sitting in Draft and no contacts have entered. It won\'t fire until published.',
  },
  {
    key: 'text',
    label: 'Custom text (monospace)',
    title: '📊 Insights',
    text: 'Type or paste any monospace layout here…',
  },
]

// ── structured viz <-> editable text (pipe-delimited) helpers ──
const PIPE = ' | '
function tableToText(table) {
  if (!table) return ''
  const cols = table.columns || []
  const rows = table.rows || []
  return [cols.join(PIPE), ...rows.map((r) => (r || []).join(PIPE))].join('\n')
}
function textToTable(text) {
  const lines = String(text || '').split('\n').filter((l) => l.trim() !== '')
  if (!lines.length) return { columns: [], rows: [] }
  const columns = lines[0].split('|').map((c) => c.trim())
  const rows = lines.slice(1).map((l) => l.split('|').map((c) => c.trim()))
  return { columns, rows }
}
const CHART_COLORS = ['#E8912D', '#5B6EF5', '#2EA6A0', '#B25FE6']
function chartToText(chart) {
  if (!chart) return ''
  const series = chart.series || []
  const cats = chart.categories || []
  const header = ['Metric', ...series.map((s) => s.name)].join(PIPE)
  const rows = cats.map((c, i) => [c, ...series.map((s) => (s.values || [])[i])].join(PIPE))
  return [header, ...rows].join('\n')
}
function textToChart(text, prev) {
  const lines = String(text || '').split('\n').filter((l) => l.trim() !== '')
  if (lines.length < 2) return { categories: [], series: [], caption: prev?.caption || '' }
  const header = lines[0].split('|').map((c) => c.trim())
  const seriesNames = header.slice(1)
  const dataRows = lines.slice(1).map((l) => l.split('|').map((c) => c.trim()))
  const categories = dataRows.map((r) => r[0])
  const series = seriesNames.map((name, i) => ({
    name,
    color: (prev?.series && prev.series[i] && prev.series[i].color) || CHART_COLORS[i % CHART_COLORS.length],
    values: dataRows.map((r) => parseFloat(r[i + 1]) || 0),
  }))
  return { categories, series, caption: prev?.caption || '' }
}

function vizKeyOf(step) {
  return step.chart ? 'bar' : step.table ? 'table' : (step.vizType === 'callout' || step.calloutTitle) ? 'callout' : 'text'
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)

export default function ScriptTimelineEditor({ script, onChange, onRestoreDefault }) {
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
    const next = script.map((s, idx) => {
      if (idx !== index) return s
      // Clear any prior structured data so switching types doesn't leave stale fields.
      const base = { ...s, vizType: key === 'text' ? '' : key, chart: undefined, table: undefined, variant: undefined, calloutTitle: undefined }
      if (!tpl) return base
      return {
        ...base,
        title: tpl.title || '',
        text: tpl.text || '',
        ...(tpl.chart ? { chart: tpl.chart } : {}),
        ...(tpl.table ? { table: tpl.table } : {}),
        ...(tpl.variant ? { variant: tpl.variant } : {}),
        ...(tpl.calloutTitle ? { calloutTitle: tpl.calloutTitle } : {}),
      }
    })
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

  const reorderStep = (from, to) => {
    const next = [...script]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }
  const { dragIndex, overIndex, handleProps, rowProps } = useDragReorder(script.length, reorderStep)

  const addStep = () => {
    onChange([
      ...script,
      {
        id: `step-${Date.now()}`,
        type: 'assistantResponse',
        text: '',
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
        // While dragging, collapse every row to a single line so the whole
        // conversation is visible at once and it's easy to see the drop target.
        if (dragIndex != null) {
          const label = TYPES.find((t) => t.value === step.type)?.label || step.type
          const snippet = (step.title || step.text || '').replace(/\s+/g, ' ').trim().slice(0, 70)
          return (
            <div
              key={step.id}
              className={`msg-builder-row-inner msg-row-collapsed${dragIndex === index ? ' is-dragging' : ''}${overIndex === index && dragIndex !== index ? ' is-drop-target' : ''}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderLeft: `4px solid ${tone.accent}`, background: tone.bg, padding: '6px 10px' }}
              {...rowProps(index)}
            >
              <span className="msg-drag-handle" title="Drag to reorder" {...handleProps(index)}><GripIcon /></span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: tone.accent, color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
              <span style={{ fontWeight: 700, color: tone.label, fontSize: 13, flexShrink: 0 }}>{label}</span>
              <span style={{ color: '#5b5b5b', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{snippet}</span>
            </div>
          )
        }
        return (
        <div
          key={step.id}
          className={`msg-builder-row-inner${dragIndex === index ? ' is-dragging' : ''}${overIndex === index && dragIndex !== index ? ' is-drop-target' : ''}`}
          style={{ flexDirection: 'column', borderLeft: `4px solid ${tone.accent}`, background: tone.bg }}
          {...rowProps(index)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexWrap: 'wrap' }}>
            <span className="msg-drag-handle" title="Drag to reorder" {...handleProps(index)}>
              <GripIcon />
            </span>
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
                value={vizKeyOf(step)}
                onChange={(e) => applyVizTemplate(index, e.target.value)}
                style={{ padding: '6px 8px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                {VIZ_TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
              <div style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                <InfoHint text="Bar & Table: edit the grid below (columns separated by ' | ', one row per line). Callout: pick a status and write the message. Custom: free monospace." />
              </div>
            </div>
          )}

          {step.type === 'visualization' && vizKeyOf(step) === 'bar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#5b5b5b' }}>Chart data — first row = <strong>Metric | Series names</strong>, then one row per category:</label>
              <textarea
                rows={5}
                value={chartToText(step.chart)}
                onChange={(e) => updateStep(index, 'chart', textToChart(e.target.value, step.chart))}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, fontFamily: 'Consolas, "SF Mono", Menlo, monospace', whiteSpace: 'pre', resize: 'vertical' }}
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                value={step.chart?.caption || ''}
                onChange={(e) => updateStep(index, 'chart', { ...(step.chart || {}), caption: e.target.value })}
                style={{ padding: '6px 10px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13 }}
              />
            </div>
          )}

          {step.type === 'visualization' && vizKeyOf(step) === 'table' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#5b5b5b' }}>Table — first line = <strong>column headers</strong>, then one row per line (cells separated by <code>|</code>):</label>
              <textarea
                rows={6}
                value={tableToText(step.table)}
                onChange={(e) => updateStep(index, 'table', textToTable(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, fontFamily: 'Consolas, "SF Mono", Menlo, monospace', whiteSpace: 'pre', resize: 'vertical' }}
              />
            </div>
          )}

          {step.type === 'visualization' && vizKeyOf(step) === 'callout' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ fontSize: 12, color: '#5b5b5b' }}>Status:</label>
              <select
                value={step.variant || 'success'}
                onChange={(e) => updateStep(index, 'variant', e.target.value)}
                style={{ padding: '6px 8px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                <option value="success">✅ Success (green)</option>
                <option value="warning">🔴 Warning (red)</option>
              </select>
              <input
                type="text"
                placeholder="Callout heading"
                value={step.calloutTitle || ''}
                onChange={(e) => updateStep(index, 'calloutTitle', e.target.value)}
                style={{ flex: '1 1 200px', padding: '6px 10px', border: '1px solid #dddbda', borderRadius: 4, fontSize: 13 }}
              />
            </div>
          )}

          {step.type === 'visualization' && vizKeyOf(step) !== 'text' && (
            <div className="viz-mini">
              <div className="viz-mini-label">Live preview</div>
              <div className="viz-mini-body">
                {step.title && vizKeyOf(step) !== 'callout' && <div className="sl-viz-title">{renderInline(step.title, `p-${step.id}`, true)}</div>}
                <VizBlock step={step} />
              </div>
            </div>
          )}

          {/* Bar & Table use their own grid editors above; hide the free-text box for them. */}
          {!(step.type === 'visualization' && (vizKeyOf(step) === 'bar' || vizKeyOf(step) === 'table')) && (
          <textarea
            id={`step-text-${step.id}`}
            rows={step.type === 'visualization' ? 8 : 3}
            value={step.text}
            placeholder={
              step.type === 'visualization'
                ? (vizKeyOf(step) === 'callout' ? 'Callout message…' : 'Type or paste monospace content…')
                : step.type === 'userPrompt'
                  ? 'What the user types to the agent…'
                  : 'What the agent says back…'
            }
            onChange={(e) => updateStep(index, 'text', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #dddbda',
              borderRadius: 4,
              fontSize: step.type === 'visualization' && vizKeyOf(step) === 'text' ? 12.5 : 14,
              fontFamily: step.type === 'visualization' && vizKeyOf(step) === 'text' ? 'Consolas, "SF Mono", Menlo, ui-monospace, monospace' : 'inherit',
              whiteSpace: step.type === 'visualization' && vizKeyOf(step) === 'text' ? 'pre' : 'pre-wrap',
              resize: 'vertical',
              minHeight: step.type === 'visualization' && vizKeyOf(step) === 'text' ? 150 : 64,
            }}
          />
          )}
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

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="add-message-btn" onClick={addStep}>
          + Add Message
        </button>
        {script.length > 0 && (
          <button
            type="button"
            className="msg-delete-btn"
            onClick={() => {
              if (window.confirm('Clear all agent conversation steps? You can rebuild from scratch or restore the default.')) onChange([])
            }}
          >
            Clear all
          </button>
        )}
        {onRestoreDefault && (
          <button
            type="button"
            className="msg-move-btn"
            onClick={() => {
              if (window.confirm('Restore the default agent conversation? This replaces the current steps.')) onRestoreDefault()
            }}
          >
            Restore default
          </button>
        )}
      </div>
    </div>
  )
}
