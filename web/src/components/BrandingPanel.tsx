import { useRef, useState } from 'react'
import { uploadToCloudinary } from '../lib/cloudinary'
import { CUMULUS_LOGO } from './simulators/cumulusLogoData'

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

function LogoField({ value, onChange, onFile }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    if (onFile) onFile(file)
    try {
      const url = await uploadToCloudinary(file)
      onChange('logoUrl', url)
    } catch (err) {
      setError(err && err.message ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="form-group">
      <label>Logo</label>
      <div className="logo-upload-row">
        <span className="logo-preview">
          <img src={value || CUMULUS_LOGO} alt="Logo preview" />
        </span>
        <div className="logo-upload-controls">
          <button type="button" className="logo-upload-btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="logo-clear-btn" onClick={() => onChange('logoUrl', '')}>
              Use default
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange('logoUrl', e.target.value)}
        placeholder="…or paste an image URL"
      />
      {error && <small style={{ color: '#c4314b' }}>{error}</small>}
      {!error && <small>Square images look best. Defaults to the Cumulus cloud mark.</small>}
    </div>
  )
}

export default function BrandingPanel({ brand, assistant, experienceType, onBrandChange, onAssistantChange }) {
  // The Teams Copilot UI uses Microsoft's fixed Fluent palette, so brand colors
  // only affect the Claude experience. Hide them everywhere else.
  const showColors = experienceType === 'claude'
  const isSlack = experienceType === 'slack'

  // Derive a dominant, saturated color from the uploaded logo file → theme color.
  const detectThemeFromFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const size = 48
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, size, size)
        let data
        try { data = ctx.getImageData(0, 0, size, size).data } catch { return }
        const buckets = {}
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
          if (a < 128) continue
          const max = Math.max(r, g, b), min = Math.min(r, g, b)
          const sat = max === 0 ? 0 : (max - min) / max
          if (max > 240 && min > 240) continue
          if (max < 24) continue
          if (sat < 0.18) continue
          const key = `${r >> 4},${g >> 4},${b >> 4}`
          buckets[key] = buckets[key] || { n: 0, r: 0, g: 0, b: 0 }
          buckets[key].n++; buckets[key].r += r; buckets[key].g += g; buckets[key].b += b
        }
        let best = null
        Object.values(buckets).forEach((v) => { if (!best || v.n > best.n) best = v })
        if (!best) return
        const hx = (x) => Math.round(x).toString(16).padStart(2, '0')
        onBrandChange('themeColor', `#${hx(best.r / best.n)}${hx(best.g / best.n)}${hx(best.b / best.n)}`)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

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

      <LogoField value={brand.logoUrl} onChange={onBrandChange} onFile={isSlack ? detectThemeFromFile : undefined} />

      {isSlack && (
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!brand.logoBackdrop} onChange={(e) => onBrandChange('logoBackdrop', e.target.checked)} />
            White background behind logo
          </label>
          <small>Adds a white tile behind the workspace logo — useful for logos that need a light backdrop.</small>
        </div>
      )}

      {isSlack && (
        <div className="form-group">
          <label htmlFor="themeColor">Workspace theme color</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              id="themeColor"
              type="color"
              value={brand.themeColor || '#3f0e40'}
              onChange={(e) => onBrandChange('themeColor', e.target.value)}
              style={{ width: 44, height: 34, padding: 0, border: '1px solid #d5d5d5', borderRadius: 6, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={brand.themeColor || '#3f0e40'}
              onChange={(e) => onBrandChange('themeColor', e.target.value)}
              style={{ flex: '1 1 auto' }}
            />
            <button type="button" className="logo-clear-btn" onClick={() => onBrandChange('themeColor', '#3f0e40')}>Reset</button>
          </div>
          <small>Auto-set from your logo on upload; recolors the rail, sidebar &amp; top bar. Adjust or reset to Slack aubergine.</small>
        </div>
      )}

      {isSlack && (
        <div className="form-group">
          <label htmlFor="accentColor">Accent color (notification badges)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              id="accentColor"
              type="color"
              value={brand.accentColor || '#e01e5a'}
              onChange={(e) => onBrandChange('accentColor', e.target.value)}
              style={{ width: 44, height: 34, padding: 0, border: '1px solid #d5d5d5', borderRadius: 6, cursor: 'pointer' }}
            />
            <input type="text" value={brand.accentColor || '#e01e5a'} onChange={(e) => onBrandChange('accentColor', e.target.value)} style={{ flex: '1 1 auto' }} />
            <button type="button" className="logo-clear-btn" onClick={() => onBrandChange('accentColor', '#e01e5a')}>Reset</button>
          </div>
          <small>Color of the unread/mention badges on the rail. Text stays auto-contrasted for legibility.</small>
        </div>
      )}


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

      {showColors && (
        <>
          <ColorField
            id="primaryColor"
            label="Primary Hex Color"
            value={brand.primaryColor}
            onChange={(v) => onBrandChange('primaryColor', v)}
            hint="Used for message bubbles and branded accents"
          />
          <ColorField
            id="accentColor"
            label="Accent Color"
            value={brand.accentColor}
            onChange={(v) => onBrandChange('accentColor', v)}
          />
        </>
      )}
    </div>
  )
}
