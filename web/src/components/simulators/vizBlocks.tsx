import { renderRich } from './richText'

/**
 * Dependency-free visualization blocks shared across simulator skins.
 * Driven by optional structured fields on a `visualization` ScriptStep:
 *   vizType: 'bar'     + step.chart  -> grouped SVG bar chart
 *   vizType: 'table'   + step.table  -> bordered HTML table
 *   vizType: 'callout' + step.callout / variant -> highlighted box
 * When the structured field is absent we fall back to the plain <pre> block,
 * so existing text-only visualizations keep rendering unchanged.
 */

const DEFAULT_SERIES_COLORS = ['#E8912D', '#5B6EF5', '#2EA6A0', '#B25FE6']

function niceMax(rawMax) {
  if (!isFinite(rawMax) || rawMax <= 0) return 10
  const pow = Math.pow(10, Math.floor(Math.log10(rawMax)))
  const n = rawMax / pow
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return step * pow
}

export function BarChart({ chart }) {
  const categories = chart?.categories || []
  const series = (chart?.series || []).map((s, i) => ({
    ...s,
    color: s.color || DEFAULT_SERIES_COLORS[i % DEFAULT_SERIES_COLORS.length],
  }))
  if (!categories.length || !series.length) return null

  // Plot geometry (SVG user units; scales via viewBox).
  const W = 560
  const H = 300
  const padL = 44
  const padR = 12
  const padT = 12
  const padB = 46
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const allValues = series.flatMap((s) => s.values || [])
  const max = niceMax(Math.max(...allValues, 0))
  const ticks = 5
  const y = (v) => padT + plotH - (v / max) * plotH

  const groupW = plotW / categories.length
  const barGap = 6
  const innerW = groupW * 0.62
  const barW = (innerW - barGap * (series.length - 1)) / series.length

  return (
    <div className="viz-chart">
      {chart.title && <div className="viz-chart-title">{chart.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-chart-svg" role="img" aria-label={chart.title || 'Bar chart'}>
        {/* gridlines + y labels */}
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = (max / ticks) * i
          const yy = y(v)
          return (
            <g key={`g${i}`}>
              <line x1={padL} x2={W - padR} y1={yy} y2={yy} className="viz-grid" />
              <text x={padL - 8} y={yy + 3} className="viz-axis-lbl" textAnchor="end">
                {Number.isInteger(v) ? v : v.toFixed(0)}
              </text>
            </g>
          )
        })}
        {/* bars */}
        {categories.map((cat, ci) => {
          const gx = padL + ci * groupW + (groupW - innerW) / 2
          return (
            <g key={`c${ci}`}>
              {series.map((s, si) => {
                const val = (s.values || [])[ci] || 0
                const bx = gx + si * (barW + barGap)
                const by = y(val)
                const bh = padT + plotH - by
                return (
                  <rect
                    key={`b${ci}-${si}`}
                    x={bx}
                    y={by}
                    width={Math.max(barW, 1)}
                    height={Math.max(bh, 0)}
                    rx={2}
                    fill={s.color}
                  />
                )
              })}
              <text x={padL + ci * groupW + groupW / 2} y={H - padB + 16} className="viz-axis-lbl" textAnchor="middle">
                {cat}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="viz-legend">
        {series.map((s, i) => (
          <span key={i} className="viz-legend-item">
            <span className="viz-legend-swatch" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      {chart.caption && <div className="viz-chart-caption">{chart.caption}</div>}
    </div>
  )
}

export function DataTable({ table }) {
  const columns = table?.columns || []
  const rows = table?.rows || []
  if (!rows.length) return null
  return (
    <div className="viz-table-wrap">
      <table className="viz-table">
        {columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{renderRich(String(cell ?? ''), `t${ri}-${ci}`, true)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Callout({ variant = 'success', title, text }) {
  const icon = variant === 'warning' ? '🔴' : '✅'
  return (
    <div className={`viz-callout is-${variant}`}>
      <span className="viz-callout-ico" aria-hidden="true">
        {icon}
      </span>
      <div className="viz-callout-body">
        {title && <div className="viz-callout-title">{title}</div>}
        <div className="viz-callout-text">{renderRich(text || '', 'callout', true)}</div>
      </div>
    </div>
  )
}

/** Returns a rendered viz block for a step, or null to signal "use the <pre> fallback". */
export function VizBlock({ step }) {
  if (step.vizType === 'bar' && step.chart) return <BarChart chart={step.chart} />
  if (step.vizType === 'table' && step.table) return <DataTable table={step.table} />
  if (step.vizType === 'callout') return <Callout variant={step.variant} title={step.calloutTitle} text={step.text} />
  return null
}
