export default function RichCard({ type }) {
  if (type === 'analyticsInsight') {
    return <AnalyticsInsightCard />
  }
  return null
}

function AnalyticsInsightCard() {
  const kpis = [
    { label: 'Closed Won ($)', value: '$82.64M', color: '#2D9F4F' },
    { label: 'Pipeline ($)', value: '$151.78M', color: '#4F6BED' },
    { label: 'Commit ($)', value: '$39.2M', color: '#E97548' },
    { label: 'At Risk Opportunity ($)', value: '$223.47M', color: '#C4314B' },
  ]

  return (
    <div className="mt-2 bg-white rounded-lg border border-[#e5e5e5] max-w-[520px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f0f0]">
        <div>
          <p className="font-semibold text-[13px] text-[#242424]">Analytics Insights Brief</p>
          <p className="text-[11px] text-[#616161]">Wednesday, June 24</p>
        </div>
        <span className="text-[11px] text-[#616161] bg-[#f5f5f5] px-2 py-0.5 rounded">Today</span>
      </div>

      {/* Forecast section */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#4F6BED">
            <path d="M2 14V6l4-4 4 4v8H2zm6 0V9H4v5h4zm2-8l4 4v4h-4V6z"/>
          </svg>
          <h3 className="text-[13px] font-semibold text-[#242424]">Forecast Brief</h3>
        </div>
        <p className="text-[11px] text-[#616161] mb-1.5">FQ2 FY2026 | Change baseline: Friday, June 12</p>
        <p className="text-[12px] text-[#424242] leading-[1.6]">
          Pipeline remains healthy with $151.8M in pipeline and $82.6M already closed won this quarter.
          However, $223.5M in at-risk opportunities now exceeds current commit by nearly 6x, making risk
          mitigation the top priority. Focus on high-value deals showing stalled activity, validate close
          dates, and secure executive alignment on the largest opportunities.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="px-4 pb-3">
        <h4 className="text-[12px] font-semibold text-[#242424] mb-2">Team KPI Health This Quarter</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {kpis.map((kpi, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: kpi.color }} />
                <span className="text-[11px] text-[#616161]">{kpi.label}</span>
              </div>
              <p className="text-[18px] font-semibold text-[#242424] leading-tight">{kpi.value}</p>
              <button className="flex items-center gap-1 text-[11px] text-[#6264A7] font-medium mt-0.5 hover:underline">
                Explore
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                  <path d="M2 1l4 3-4 3V1z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
