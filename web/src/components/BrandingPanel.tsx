export default function BrandingPanel({ brand, assistant, onBrandChange, onAssistantChange }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Brand + Assistant</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-600">
          Brand name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={brand.name}
            onChange={(e) => onBrandChange('name', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Assistant name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={assistant.name}
            onChange={(e) => onAssistantChange('name', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Primary color
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={brand.primaryColor}
            onChange={(e) => onBrandChange('primaryColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Accent color
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={brand.accentColor}
            onChange={(e) => onBrandChange('accentColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Headline color
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={brand.headlineColor}
            onChange={(e) => onBrandChange('headlineColor', e.target.value)}
          />
        </label>
        <label className="text-xs text-slate-600">
          Greeting
          <input
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
            value={assistant.greeting}
            onChange={(e) => onAssistantChange('greeting', e.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
