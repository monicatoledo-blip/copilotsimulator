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

function LogoField({ value, onChange }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
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

      <LogoField value={brand.logoUrl} onChange={onBrandChange} />

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
