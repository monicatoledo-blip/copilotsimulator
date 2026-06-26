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
    <div className="h-screen overflow-hidden bg-slate-50 p-4">
      <header className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Cumulus Financial</p>
        <h1 className="text-lg font-semibold text-slate-900">Experience Generator</h1>
        <p className="text-sm text-slate-600">Build strict scripted demos for MS Teams Co-Pilot and Claude, then export a standalone HTML handoff.</p>
      </header>

      <div className="grid h-[calc(100%-104px)] grid-cols-[minmax(520px,1fr)_minmax(420px,1fr)] gap-4">
        <section className="space-y-3 overflow-y-auto pr-1">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <label className="block text-xs text-slate-600">
              Experience
              <select
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={selectedExperience}
                onChange={(e) => switchExperience(e.target.value)}
              >
                <option value="teams-copilot">Co-Pilot in MS Teams</option>
                <option value="claude">Claude</option>
              </select>
            </label>
            <label className="mt-3 block text-xs text-slate-600">
              Scenario preset
              <select className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" defaultValue="" onChange={(e) => applyPreset(e.target.value)}>
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
          <div className="mb-3 flex items-center gap-2">
            <button disabled={isRunning} className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-50" onClick={runPreview}>
              {isRunning ? 'Running...' : 'Run Preview'}
            </button>
            <button
              disabled={validationErrors.length > 0}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
              onClick={downloadHtml}
            >
              Download Custom Experience
            </button>
          </div>

          {(errors.length > 0 || validationErrors.length > 0) && (
            <div className="mb-3 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
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
  )
}
