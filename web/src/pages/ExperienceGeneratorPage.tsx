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

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export default function ExperienceGeneratorPage() {
  const [selectedExperience, setSelectedExperience] = useState('teams-copilot')
  const [manifest, setManifest] = useState(clone(coPilotDefault))
  const [renderedSteps, setRenderedSteps] = useState([])
  const [errors, setErrors] = useState([])
  const [isRunning, setIsRunning] = useState(false)

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
    <div className="h-screen overflow-hidden bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto h-full max-w-[1480px]">
        <header className="mb-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cumulus Financial</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Experience Generator</h1>
          <p className="mt-1 text-sm text-slate-600">
            Customize and download interactive simulated experiences for your demos.
          </p>
        </header>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">Your demo</div>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">Adaptive walkthrough</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">Talk track</div>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">Guided narrative copy</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">AI Copilot</div>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">Prompt + response scripting</div>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Configure your demo journey</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {['Brand & Customer', 'Homepage', 'Category Page', 'AI Chat', 'Offer', 'Return Visit'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700">{idx + 1}</div>
                <span className="text-xs text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid h-[calc(100%-300px)] grid-cols-[minmax(600px,1fr)_minmax(440px,1fr)] gap-4">
          <section className="space-y-3 overflow-y-auto pr-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Experience setup</p>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Select Experience
                <select
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                  value={selectedExperience}
                  onChange={(e) => switchExperience(e.target.value)}
                >
                  <option value="teams-copilot">Co-Pilot in MS Teams</option>
                  <option value="claude">Claude</option>
                </select>
              </label>
              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Apply Scenario Preset
                <select
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                  defaultValue=""
                  onChange={(e) => applyPreset(e.target.value)}
                >
                  <option value="" disabled>Select a preset...</option>
                  {PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>{preset.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <BrandingPanel brand={manifest.brand} assistant={manifest.assistant} onBrandChange={updateBrand} onAssistantChange={updateAssistant} />
            <ScriptTimelineEditor script={manifest.script} onChange={updateScript} />
          </section>

          <section className="flex flex-col">
            <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
              <p className="mt-0.5 text-xs text-slate-600">See your changes in real-time.</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  disabled={isRunning}
                  className="rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
                  onClick={runPreview}
                >
                  {isRunning ? 'Running...' : 'Run Preview'}
                </button>
                <button
                  disabled={validationErrors.length > 0}
                  className="rounded-lg bg-[#1D9BF0] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
                  onClick={downloadHtml}
                >
                  Download Custom Experience
                </button>
              </div>
            </div>

            {(errors.length > 0 || validationErrors.length > 0) && (
              <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
                {(errors.length > 0 ? errors : validationErrors).map((error) => (
                  <div key={error}>{error}</div>
                ))}
              </div>
            )}

            <div className="min-h-0 flex-1">
              <Frame brand={manifest.brand} assistant={manifest.assistant} renderedSteps={renderedSteps} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
