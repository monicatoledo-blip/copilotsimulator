function ColorField({ id, label, value, onChange, hint }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="color-input-group">
        <input type="color" className="color-picker" value={value} onChange={(e) => onChange(e.target.value)} />
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
      {hint && <small>{hint}</small>}
    </div>
  )
}

export default function BrandingPanel({ brand, assistant, onBrandChange, onAssistantChange }) {
  return (
    <div className="form-section">
      <h3>Branding</h3>

      <div className="form-group">
        <label htmlFor="brandName">Brand Name</label>
        <input
          type="text"
          id="brandName"
          value={brand.name}
          onChange={(e) => onBrandChange('name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="assistantName">AI Agent Name</label>
        <input
          type="text"
          id="assistantName"
          value={assistant.name}
          onChange={(e) => onAssistantChange('name', e.target.value)}
        />
        <small>Shown in the simulated chat header</small>
      </div>

      <ColorField
        id="primaryColor"
        label="Primary Hex Color"
        value={brand.primaryColor}
        onChange={(v) => onBrandChange('primaryColor', v)}
        hint="Used for buttons and branded elements"
      />
      <ColorField
        id="accentColor"
        label="Accent Color"
        value={brand.accentColor}
        onChange={(v) => onBrandChange('accentColor', v)}
      />
      <ColorField
        id="headlineColor"
        label="Headline Text Color"
        value={brand.headlineColor}
        onChange={(v) => onBrandChange('headlineColor', v)}
      />
    </div>
  )
}
