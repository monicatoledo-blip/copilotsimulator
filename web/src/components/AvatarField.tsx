import { useRef, useState } from 'react'
import { uploadToCloudinary } from '../lib/cloudinary'

// Compact avatar picker: upload an image (Cloudinary) or paste a URL. Stores a
// URL, so it round-trips cleanly into the downloaded/restored HTML. Falls back
// to whatever the caller renders (colored initials / group glyph) when empty.
export default function AvatarField({ value, onChange, shape = 'circle', label = 'Avatar' }) {
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
      onChange(url)
    } catch (err) {
      setError(err && err.message ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span
        aria-hidden="true"
        style={{
          width: 32,
          height: 32,
          borderRadius: shape === 'square' ? 6 : '50%',
          flexShrink: 0,
          overflow: 'hidden',
          background: value ? 'transparent' : '#ececf0',
          border: '1px solid #dddbda',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9a9a9a',
          fontSize: 11,
        }}
      >
        {value ? (
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          label.charAt(0)
        )}
      </span>
      <button
        type="button"
        className="msg-move-btn"
        onClick={() => fileRef.current && fileRef.current.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : value ? 'Change' : 'Upload'}
      </button>
      {value && (
        <button type="button" className="msg-move-btn" onClick={() => onChange('')}>
          Remove
        </button>
      )}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste image URL"
        style={{
          flex: '1 1 140px',
          minWidth: 120,
          padding: '6px 8px',
          border: '1px solid #dddbda',
          borderRadius: 4,
          fontSize: 12,
          fontFamily: 'inherit',
        }}
      />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {error && <small style={{ color: '#c4314b', width: '100%' }}>{error}</small>}
    </div>
  )
}
