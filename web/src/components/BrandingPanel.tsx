export default function BrandingPanel({ brand, assistant, onBrandChange, onAssistantChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Brand + Assistant</h3>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border border-slate-300" style={{ background: brand.primaryColor }} />
          <span className="h-4 w-4 rounded-full border border-slate-300" style={{ background: brand.accentColor }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-600">
          Brand name
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={brand.name}
            onChange={(e) => onBrandChange('name', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Assistant name
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={assistant.name}
            onChange={(e) => onAssistantChange('name', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Primary color
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={brand.primaryColor}
            onChange={(e) => onBrandChange('primaryColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Accent color
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={brand.accentColor}
            onChange={(e) => onBrandChange('accentColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Headline color
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={brand.headlineColor}
            onChange={(e) => onBrandChange('headlineColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Greeting
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            value={assistant.greeting}
            onChange={(e) => onAssistantChange('greeting', e.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
