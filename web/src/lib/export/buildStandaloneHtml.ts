import { buildHtmlTemplate } from './htmlTemplate'

export function buildStandaloneHtml(manifest: unknown) {
  const serialized = JSON.stringify(manifest).replace(/</g, '\\u003c')
  return buildHtmlTemplate(serialized)
}
