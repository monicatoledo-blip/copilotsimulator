function ColorField({ label, value, onChange }) {
  return (
    <label className="text-sm text-slate-600">
      {label}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-10 cursor-pointer rounded-md border border-slate-300 bg-white p-0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  )
}

export default function BrandingPanel({ brand, assistant, onBrandChange, onAssistantChange }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">Brand &amp; assistant</h3>
      <p className="mb-3 mt-0.5 text-xs text-slate-500">Identity and colors used across the simulated experience.</p>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-600">
          Brand name
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
            value={brand.name}
            onChange={(e) => onBrandChange('name', e.target.value)}
          />
        </label>
        <label className="text-sm text-slate-600">
          Assistant name
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
            value={assistant.name}
            onChange={(e) => onAssistantChange('name', e.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <ColorField label="Primary color" value={brand.primaryColor} onChange={(v) => onBrandChange('primaryColor', v)} />
        <ColorField label="Accent color" value={brand.accentColor} onChange={(v) => onBrandChange('accentColor', v)} />
        <ColorField label="Headline color" value={brand.headlineColor} onChange={(v) => onBrandChange('headlineColor', v)} />
      </div>
    </section>
  )
}
