export type ScriptStepType = 'userPrompt' | 'assistantResponse' | 'toolAction'

export interface ScriptStep {
  id: string
  type: ScriptStepType
  text: string
  title?: string
  delayMs?: number
  typingState?: boolean
}

export interface SimulatorManifest {
  id: string
  experienceType: 'teams-copilot' | 'claude'
  brand: {
    name: string
    primaryColor: string
    accentColor: string
    headlineColor: string
    logoUrl?: string
  }
  assistant: {
    name: string
    avatarUrl: string
    greeting: string
  }
  script: ScriptStep[]
}

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6})$/
const STEP_TYPES = new Set(['userPrompt', 'assistantResponse', 'toolAction'])

export function validateScript(manifest: SimulatorManifest): string[] {
  const errors: string[] = []

  if (!manifest.id) errors.push('Manifest id is required.')
  if (!manifest.brand?.name) errors.push('Brand name is required.')
  if (!HEX_COLOR_REGEX.test(manifest.brand?.primaryColor ?? '')) errors.push('Primary color must be a 6-digit hex value.')
  if (!HEX_COLOR_REGEX.test(manifest.brand?.accentColor ?? '')) errors.push('Accent color must be a 6-digit hex value.')
  if (!HEX_COLOR_REGEX.test(manifest.brand?.headlineColor ?? '')) errors.push('Headline color must be a 6-digit hex value.')
  if (!manifest.assistant?.name) errors.push('Assistant name is required.')
  if (!manifest.assistant?.greeting) errors.push('Assistant greeting is required.')

  if (!Array.isArray(manifest.script) || manifest.script.length === 0) {
    errors.push('Script must contain at least one step.')
    return errors
  }

  const ids = new Set<string>()
  manifest.script.forEach((step, index) => {
    const row = index + 1
    if (!step.id) errors.push(`Step ${row}: id is required.`)
    if (step.id && ids.has(step.id)) errors.push(`Step ${row}: duplicate id "${step.id}".`)
    if (step.id) ids.add(step.id)
    if (!STEP_TYPES.has(step.type)) errors.push(`Step ${row}: invalid type "${step.type}".`)
    if (!step.text?.trim()) errors.push(`Step ${row}: text is required.`)
    if (step.delayMs != null && step.delayMs < 0) errors.push(`Step ${row}: delayMs cannot be negative.`)
    if (step.type === 'toolAction' && !step.title?.trim()) {
      errors.push(`Step ${row}: toolAction requires a title.`)
    }
  })

  return errors
}
