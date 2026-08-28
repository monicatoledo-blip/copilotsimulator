// Standalone entry for the downloadable Slack export. Bundled (React inlined)
// by scripts/genSlackStandalone.mjs into slackStandaloneBundle.ts, then inlined
// into the export HTML by slackHtmlTemplate.ts. Renders the SAME SlackFrame the
// live preview uses, driven by window.MANIFEST — so download === preview.
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import SlackFrame from './components/simulators/SlackFrame'

const manifest = (window as unknown as { MANIFEST?: Record<string, unknown> }).MANIFEST || {}
const members = Array.isArray((manifest as { members?: unknown }).members)
  ? (manifest as { members: unknown[] }).members.map((m) => (typeof m === 'string' ? { name: m } : m))
  : []

const el = document.getElementById('app')
if (el) {
  createRoot(el).render(createElement(SlackFrame, { ...manifest, members, resetSignal: 0 }))
}
