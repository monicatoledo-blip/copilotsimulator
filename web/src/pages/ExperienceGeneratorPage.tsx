import { useMemo, useState } from 'react'
import BrandingPanel from '../components/BrandingPanel'
import ScriptTimelineEditor from '../components/ScriptTimelineEditor'
import TeamsCopilotFrame from '../components/simulators/TeamsCopilotFrame'
import ClaudeFrame from '../components/simulators/ClaudeFrame'
import coPilotDefault from '../../../simulators/content/co-pilot.default.json'
import claudeDefault from '../../../simulators/content/claude.default.json'
import presetAudit from '../../../simulators/content/presets/fins-headless-audit.json'
import presetJourney from '../../../simulators/content/presets/fins-headless-journey-build.json'
import { validateScript } from '../../../simulators/engine/validateScript'
import { runScript } from '../../../simulators/engine/runScript'
import { buildStandaloneHtml } from '../lib/export/buildStandaloneHtml'

const PRESETS = [presetAudit, presetJourney]

const TABS = [
  { id: 'demo', label: 'Your demo' },
  { id: 'talk', label: 'Talk track' },
  { id: 'copilot', label: 'AI Copilot' },
]

const BRAND_NAVY = '#0B3D72'
const BRAND_BLUE = '#1F7AE0'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export default function ExperienceGeneratorPage() {
  const [selectedExperience, setSelectedExperience] = useState('teams-copilot')
  const [manifest, setManifest] = useState(clone(coPilotDefault))
  const [renderedSteps, setRenderedSteps] = useState([])
  const [errors, setErrors] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('demo')

  const validationErrors = useMemo(() => validateScript(manifest), [manifest])

  const switchExperience = (experienceType) => {
    setSelectedExperience(experienceType)
    setRenderedSteps([])
    setErrors([])
    setManifest(clone(experienceType === 'teams-copilot' ? coPilotDefault : claudeDefault))
  }

  const applyPreset = (presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setManifest((prev) => ({ ...prev, script: clone(preset.script) }))
    setRenderedSteps([])
  }

  const updateScript = (script) => setManifest((prev) => ({ ...prev, script }))
  const updateBrand = (key, value) => setManifest((prev) => ({ ...prev, brand: { ...prev.brand, [key]: value } }))
  const updateAssistant = (key, value) => setManifest((prev) => ({ ...prev, assistant: { ...prev.assistant, [key]: value } }))

  const runPreview = async () => {
    const foundErrors = validateScript(manifest)
    setErrors(foundErrors)
    if (foundErrors.length > 0) return
    setIsRunning(true)
    setRenderedSteps([])
    await runScript(manifest.script, (step) => {
      setRenderedSteps((prev) => [...prev, step])
    })
    setIsRunning(false)
  }

  const downloadHtml = () => {
    const foundErrors = validateScript(manifest)
    setErrors(foundErrors)
    if (foundErrors.length > 0) return
    const html = buildStandaloneHtml(manifest)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${manifest.id}.html`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const Frame = selectedExperience === 'teams-copilot' ? TeamsCopilotFrame : ClaudeFrame

  return (
    <div className="flex h-screen flex-col bg-[#eef2f7] text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${BRAND_NAVY}, ${BRAND_BLUE})` }}
          >
            C
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight text-slate-900">Cumulus Financial</div>
            <div className="text-xs leading-tight text-slate-500">Experience Generator</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">Select Experience</label>
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
            value={selectedExperience}
            onChange={(e) => switchExperience(e.target.value)}
          >
            <option value="teams-copilot">Co-Pilot in MS Teams</option>
            <option value="claude">Claude</option>
          </select>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[440px] min-w-[380px] flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <h1 className="text-2xl font-semibold text-slate-900">Configuration</h1>
            <h2 className="mt-2 text-sm font-semibold text-slate-700">Let's set up your demo</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Customize your experience below. The preview updates in real time as you go, and you can
              change anything later.
            </p>
          </div>

          <div className="flex gap-1 border-b border-slate-200 px-4 pt-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'text-[#0B3D72]' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full" style={{ background: BRAND_BLUE }} />
                  )}
                </button>
              )
            })}
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {activeTab === 'demo' && (
              <>
                <Section title="Scenario preset" subtitle="Start from a proven FINs headless narrative.">
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
                    defaultValue=""
                    onChange={(e) => applyPreset(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a preset...
                    </option>
                    {PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                </Section>

                <BrandingPanel
                  brand={manifest.brand}
                  assistant={manifest.assistant}
                  onBrandChange={updateBrand}
                  onAssistantChange={updateAssistant}
                />
              </>
            )}

            {activeTab === 'talk' && (
              <Section title="Assistant greeting" subtitle="The opening message your assistant shows.">
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1F7AE0]"
                  rows={4}
                  value={manifest.assistant.greeting}
                  onChange={(e) => updateAssistant('greeting', e.target.value)}
                />
              </Section>
            )}

            {activeTab === 'copilot' && (
              <ScriptTimelineEditor script={manifest.script} onChange={updateScript} />
            )}
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col bg-[#eef2f7]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
              <p className="text-sm text-slate-500">See your changes in real-time</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isRunning}
                onClick={runPreview}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
                style={{ background: BRAND_NAVY }}
              >
                {isRunning ? 'Running...' : 'Restart Demo'}
              </button>
              <button
                disabled={validationErrors.length > 0}
                onClick={downloadHtml}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
                style={{ background: BRAND_BLUE }}
              >
                Download Custom Experience
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {(errors.length > 0 || validationErrors.length > 0) && (
              <div className="mx-auto mb-4 max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                {(errors.length > 0 ? errors : validationErrors).map((error) => (
                  <div key={error}>{error}</div>
                ))}
              </div>
            )}

            <div className="mx-auto h-full max-w-3xl">
              <Frame brand={manifest.brand} assistant={manifest.assistant} renderedSteps={renderedSteps} />
            </div>
          </div>

          <footer className="border-t border-slate-200 bg-white px-6 py-2 text-center text-xs text-slate-400">
            © Cumulus Financial · Built for Salesforce Solution Engineers
          </footer>
        </main>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="mb-2 mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </section>
  )
}
