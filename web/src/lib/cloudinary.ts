// Unsigned Cloudinary upload — same account/preset used by the prior Cumulus simulator.
const CLOUDINARY_CLOUD_NAME = 'dfx98jgdc'
const CLOUDINARY_UPLOAD_PRESET = 'experience-generator-preset'

/**
 * Uploads an image File to Cloudinary (unsigned) and returns its secure URL.
 * NOTE: Cloudinary reads FormData sequentially for unsigned uploads — the
 * append order must be upload_preset, then optional params, then the file last.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'experience-generator')
  formData.append('file', file)

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  const res = await fetch(url, { method: 'POST', body: formData })

  if (!res.ok) {
    let message = `Upload failed (${res.status})`
    try {
      const err = await res.json()
      message = err?.error?.message || message
    } catch {
      /* ignore parse errors */
    }
    throw new Error(message)
  }

  const result = await res.json()
  if (!result.secure_url) throw new Error('No URL returned from Cloudinary')
  return result.secure_url as string
}
