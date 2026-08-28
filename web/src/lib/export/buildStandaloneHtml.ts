import { buildHtmlTemplate } from './htmlTemplate'

export function serializeManifest(manifest: unknown) {
  return JSON.stringify(manifest).replace(/</g, '\\u003c')
}

// Teams/Claude standalone (vanilla template). The Slack export bundles the real
// React app and is large, so it's loaded on demand from downloadHtml (dynamic
// import) to keep it out of the main app bundle.
export function buildStandaloneHtml(manifest: unknown) {
  return buildHtmlTemplate(serializeManifest(manifest))
}
