export default function DemoResponseCard({ card }) {
  if (!card) return null

  switch (card.type) {
    case 'dataExtension':
      return <DataExtensionCard card={card} />
    case 'journey':
      return <JourneyCard card={card} />
    case 'performance':
      return <PerformanceCard card={card} />
    case 'compliance':
      return <ComplianceCard card={card} />
    default:
      return null
  }
}

function DataExtensionCard({ card }) {
  return (
    <div className="mt-3 bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
      <div className="bg-[#004977] px-4 py-3">
        <p className="text-white font-semibold text-sm">{card.title}</p>
        <p className="text-white/70 text-xs mt-0.5">{card.name}</p>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[#616161]">📁 Location:</span>
          <span className="text-xs font-medium text-[#242424]">{card.location}</span>
        </div>

        {/* Fields table */}
        <div className="border border-[#e5e5e5] rounded overflow-hidden">
          <div className="grid grid-cols-3 bg-[#f5f5f5] px-3 py-1.5 border-b border-[#e5e5e5]">
            <span className="text-[11px] font-semibold text-[#616161] uppercase">Field</span>
            <span className="text-[11px] font-semibold text-[#616161] uppercase">Type</span>
            <span className="text-[11px] font-semibold text-[#616161] uppercase">Key</span>
          </div>
          {card.fields.map((field, i) => (
            <div key={i} className={`grid grid-cols-3 px-3 py-1.5 ${i < card.fields.length - 1 ? 'border-b border-[#f0f0f0]' : ''}`}>
              <span className="text-xs text-[#242424] font-medium">{field.name}</span>
              <span className="text-xs text-[#616161]">{field.type}</span>
              <span className="text-xs">
                {field.primaryKey && <span className="text-[#D03027] font-semibold">🔑 PK</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#f0f0f0]">
          <span className="w-2 h-2 bg-[#2D9F4F] rounded-full" />
          <span className="text-xs text-[#2D9F4F] font-medium">{card.status}</span>
          <span className="text-xs text-[#616161] ml-auto">{card.recordCount}</span>
        </div>
      </div>
    </div>
  )
}

function JourneyCard({ card }) {
  return (
    <div className="mt-3 bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
      <div className="bg-[#004977] px-4 py-3">
        <p className="text-white font-semibold text-sm">{card.title}</p>
        <p className="text-white/70 text-xs mt-0.5">{card.journeyName}</p>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[#616161]">📊 Entry Source:</span>
          <span className="text-xs font-medium text-[#6264A7]">{card.entrySource}</span>
        </div>

        {/* Journey steps */}
        <div className="space-y-0">
          {card.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="text-lg">{step.icon}</span>
                {i < card.steps.length - 1 && (
                  <div className="w-0.5 h-6 bg-[#e5e5e5] my-1" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-sm font-medium text-[#242424]">{step.name}</p>
                <p className="text-xs text-[#616161]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Email preview */}
        {card.emailPreview && (
          <div className="mt-3 border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="bg-[#f5f5f5] px-3 py-2 border-b border-[#e5e5e5]">
              <p className="text-xs font-semibold text-[#616161]">📧 Email Preview — Offer Email</p>
            </div>
            <div className="p-3">
              <div className="bg-[#004977] rounded-t px-4 py-3 text-center">
                <p className="text-white font-semibold text-sm">Your Venture X rewards are waiting.</p>
                <p className="text-white/70 text-[11px] mt-0.5">You've earned them — and we're adding a bonus.</p>
              </div>
              <div className="bg-white border border-[#e5e5e5] border-t-0 rounded-b px-4 py-3">
                <div className="bg-[#f8f8f8] border-l-4 border-[#D03027] px-3 py-2 mb-2">
                  <p className="text-[10px] text-[#666] uppercase tracking-wide">Your rewards balance</p>
                  <p className="text-lg font-bold text-[#004977]">%%RewardsBalance%% pts</p>
                </div>
                <div className="bg-[#fff8e1] border-2 border-[#D03027] rounded px-3 py-2 text-center">
                  <p className="text-[10px] text-[#D03027] uppercase tracking-wide font-semibold">Limited-Time Offer</p>
                  <p className="text-sm font-bold text-[#004977]">Earn a 10% Rewards Bonus</p>
                </div>
                <div className="text-center mt-2">
                  <span className="inline-block bg-[#D03027] text-white text-xs font-semibold px-4 py-1.5 rounded">
                    Activate My Rewards →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#f0f0f0]">
          <span className="text-xs px-2 py-0.5 rounded bg-[#FFF3CD] text-[#856404] font-medium">
            {card.status}
          </span>
        </div>
      </div>
    </div>
  )
}

function PerformanceCard({ card }) {
  return (
    <div className="mt-3 bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
      <div className="bg-[#004977] px-4 py-3">
        <p className="text-white font-semibold text-sm">{card.title}</p>
        <p className="text-white/70 text-xs mt-0.5">{card.campaignName}</p>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#616161]">📅 {card.sendDate}</span>
          <span className="text-xs text-[#616161]">Total Sent: <strong className="text-[#242424]">{card.totalSent}</strong></span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {card.metrics.map((metric, i) => (
            <div key={i} className="bg-[#fafafa] rounded-lg p-3 border border-[#f0f0f0]">
              <p className="text-[11px] text-[#616161] mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-[#242424]">{metric.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[11px] font-medium ${
                  (metric.status === 'above' && metric.label !== 'Unsubscribe Rate' && metric.label !== 'Bounce Rate') ||
                  (metric.status === 'below' && (metric.label === 'Unsubscribe Rate' || metric.label === 'Bounce Rate'))
                    ? 'text-[#2D9F4F]' : 'text-[#C4314B]'
                }`}>
                  {metric.delta}
                </span>
                <span className="text-[11px] text-[#616161]">vs {metric.benchmark} benchmark</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div className="bg-[#F0F4FF] border border-[#D5D9F5] rounded-lg p-3">
          <p className="text-xs text-[#242424] leading-relaxed">
            <span className="font-semibold">💡 Insight: </span>
            {card.insight}
          </p>
        </div>
      </div>
    </div>
  )
}

function ComplianceCard({ card }) {
  return (
    <div className="mt-3 bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
      <div className="bg-[#E97548] px-4 py-3">
        <p className="text-white font-semibold text-sm">{card.title}</p>
        <p className="text-white/80 text-xs mt-0.5">{card.journeyName}</p>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded bg-[#FFF3CD] text-[#856404] font-medium">
            {card.status}
          </span>
        </div>

        <div className="bg-[#FFF8F0] border border-[#FFD6B0] rounded-lg p-3 mb-3">
          <p className="text-xs text-[#242424]">
            <span className="font-semibold">Flag Reason: </span>
            {card.flagReason}
          </p>
        </div>

        {/* Actions taken */}
        <div className="space-y-2 mb-3">
          {card.actions.map((action, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm">{action.icon}</span>
              <p className="text-xs text-[#242424]">{action.text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0]">
          <button className="text-xs text-[#6264A7] font-medium hover:underline">
            {card.approvalLink}
          </button>
          <span className="text-[11px] text-[#616161]">{card.eta}</span>
        </div>
      </div>
    </div>
  )
}
