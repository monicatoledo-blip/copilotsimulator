import { buildHtmlTemplate } from './htmlTemplate'
import { buildSlackHtmlTemplate } from './slackHtmlTemplate'

export function buildStandaloneHtml(manifest: unknown) {
  const serialized = JSON.stringify(manifest).replace(/</g, '\\u003c')
  const experienceType = (manifest as { experienceType?: string } | null)?.experienceType
  if (experienceType === 'slack') return buildSlackHtmlTemplate(serialized)
  return buildHtmlTemplate(serialized)
}
