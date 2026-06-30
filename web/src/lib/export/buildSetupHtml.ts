import { buildSetupTemplate } from './setupTemplate'

// Companion export: an optional standalone HTML walkthrough of how the agent +
// MCP server were set up in Copilot Studio. Mirrors buildStandaloneHtml's shape.
export function buildSetupHtml(manifest: unknown) {
  const serialized = JSON.stringify(manifest).replace(/</g, '\\u003c')
  return buildSetupTemplate(serialized)
}
