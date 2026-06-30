import { useEffect, useMemo, useRef, useState } from 'react'
import '../cumulus-chrome.css'
import BrandingPanel from '../components/BrandingPanel'
import ScriptTimelineEditor from '../components/ScriptTimelineEditor'
import TeamChatEditor from '../components/TeamChatEditor'
import TeamsCopilotFrame from '../components/simulators/TeamsCopilotFrame'
import ClaudeFrame from '../components/simulators/ClaudeFrame'
import coPilotDefault from '../../../simulators/content/co-pilot.default.json'
import claudeDefault from '../../../simulators/content/claude.default.json'
import { validateScript } from '../../../simulators/engine/validateScript'
import { runScript } from '../../../simulators/engine/runScript'
import { buildStandaloneHtml } from '../lib/export/buildStandaloneHtml'
import { buildSetupHtml } from '../lib/export/buildSetupHtml'

const TEAMS_TABS = [
  { id: 'demo', label: 'Your demo' },
  { id: 'team', label: 'Team chat' },
  { id: 'copilot', label: 'AI Copilot' },
]

const CLAUDE_TABS = [
  { id: 'demo', label: 'Your demo' },
  { id: 'copilot', label: 'AI Copilot' },
]
const SHOW_CLAUDE_EXPERIENCE = false

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 760

const CUMULUS_LOGO =
  'https://image.s4.sfmc-content.com/lib/fe3111727664047b741079/m/1/ccb17401-00ab-42c3-b141-7a1b93f23360.png'
const CURRENT_SCHEMA_VERSION = 1

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function parseImportedManifest(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) throw new Error('The uploaded file is empty.')
  if (trimmed.startsWith('{')) return JSON.parse(trimmed)
  // Allow importing a previously exported standalone HTML by extracting its embedded MANIFEST object.
  const match = trimmed.match(/var\s+MANIFEST\s*=\s*(\{[\s\S]*?\})\s*;/m)
  if (match && match[1]) return JSON.parse(match[1])
  throw new Error('Could not find a simulator manifest. Upload a working JSON file or exported simulator HTML.')
}

function normalizeStep(step, fallbackPrefix, index) {
  const safeType = ['userPrompt', 'assistantResponse', 'toolAction', 'visualization'].includes(step?.type)
    ? step.type
    : 'assistantResponse'
  const out = {
    ...step,
    id: step?.id || `${fallbackPrefix}-${index + 1}`,
    type: safeType,
    text: typeof step?.text === 'string' ? step.text : '',
  }
  if ((safeType === 'toolAction' || safeType === 'visualization') && !out.title) {
    out.title = safeType === 'toolAction' ? 'Tool action' : 'Visualization'
  }
  return out
}

// Backward-compatible loader: merges uploaded manifest onto latest defaults so
// newly added template fields keep working over time.
function migrateManifest(rawInput, selectedExperience) {
  const raw = rawInput && typeof rawInput === 'object' ? rawInput : {}
  const experienceType = raw.experienceType === 'claude' || raw.experienceType === 'teams-copilot'
    ? raw.experienceType
    : selectedExperience
  const base = clone(experienceType === 'claude' ? claudeDefault : coPilotDefault)

  const scriptSource = Array.isArray(raw.script) ? raw.script : []
  const groupChatSource = Array.isArray(raw.groupChat)
    ? raw.groupChat
    : Array.isArray(raw.messages)
      ? raw.messages
      : []

  const merged = {
    ...base,
    ...raw,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: raw.id || base.id,
    experienceType,
    brand: {
      ...base.brand,
      ...(raw.brand || {}),
    },
    assistant: {
      ...base.assistant,
      ...(raw.assistant || {}),
    },
    members: Array.isArray(raw.members) && raw.members.length ? raw.members : base.members || [],
    sidebar: Array.isArray(raw.sidebar) && raw.sidebar.length ? raw.sidebar : base.sidebar || [],
    groupChat: groupChatSource.map((s, i) => normalizeStep(s, 'gc', i)),
    script: (scriptSource.length ? scriptSource : base.script || []).map((s, i) => normalizeStep(s, 's', i)),
  }

  return merged
}

export default function ExperienceGeneratorPage() {
  const [selectedExperience, setSelectedExperience] = useState('teams-copilot')
  const [manifest, setManifest] = useState(clone(coPilotDefault))
  const [renderedSteps, setRenderedSteps] = useState([])
  const [errors, setErrors] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [activeTab, setActiveTab] = useState('demo')
  const [panelWidth, setPanelWidth] = useState(400)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)
  const importRef = useRef(null)

  const validationErrors = useMemo(() => validateScript(manifest), [manifest])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const next = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, e.clientX - rect.left))
      setPanelWidth(next)
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [dragging])

  const TABS = selectedExperience === 'teams-copilot' ? TEAMS_TABS : CLAUDE_TABS

  const switchExperience = (experienceType) => {
    setSelectedExperience(experienceType)
    setRenderedSteps([])
    setErrors([])
    setActiveTab('demo')
    setManifest(clone(experienceType === 'teams-copilot' ? coPilotDefault : claudeDefault))
  }

  const updateScript = (script) => setManifest((prev) => ({ ...prev, script }))
  const updateBrand = (key, value) => setManifest((prev) => ({ ...prev, brand: { ...prev.brand, [key]: value } }))
  const updateAssistant = (key, value) => setManifest((prev) => ({ ...prev, assistant: { ...prev.assistant, [key]: value } }))
  const updateField = (key, value) => setManifest((prev) => ({ ...prev, [key]: value }))

  const viewerName = manifest.viewer || 'You'
  const rawMembers =
    manifest.members && manifest.members.length > 0
      ? manifest.members
      : Array.from(
          new Set(
            (manifest.groupChat || [])
              .map((m) => m.author)
              .filter((a) => a && a !== viewerName),
          ),
        )
  const members = rawMembers.map((m) => (typeof m === 'string' ? { name: m, title: '' } : m))

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

  // The Copilot surface is interactive (you drive it from the composer), so for
  // Teams a "restart" just resets it to the welcome screen. Claude still auto-plays.
  const restartPreview = () => {
    const foundErrors = validateScript(manifest)
    setErrors(foundErrors)
    if (foundErrors.length > 0) return
    if (selectedExperience === 'teams-copilot') {
      setResetSignal((n) => n + 1)
    } else {
      runPreview()
    }
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

  // Optional companion file: a guided walkthrough of how the agent + MCP server
  // were set up in Copilot Studio and published to Teams. SEs show it or skip it.
  const downloadSetupHtml = () => {
    const foundErrors = validateScript(manifest)
    setErrors(foundErrors)
    if (foundErrors.length > 0) return
    const html = buildSetupHtml(manifest)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${manifest.id}-setup.html`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importWorkingFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = parseImportedManifest(text)
      const next = migrateManifest(parsed, selectedExperience)
      const foundErrors = validateScript(next)
      if (foundErrors.length > 0) {
        setErrors(foundErrors)
      }
      setManifest(next)
      setSelectedExperience(next.experienceType || selectedExperience)
      setActiveTab('demo')
      setRenderedSteps([])
      setResetSignal((n) => n + 1)
    } catch (err) {
      setErrors([err?.message || 'Could not import the uploaded file.'])
    } finally {
      if (importRef.current) importRef.current.value = ''
    }
  }

  const Frame = selectedExperience === 'teams-copilot' ? TeamsCopilotFrame : ClaudeFrame

  return (
    <div className="app-shell">
      <header>
        <div className="header-content">
          <img src={CUMULUS_LOGO} alt="Cumulus" className="header-logo" />
          <div className="header-text">
            <h1>AI Assistant Simulator</h1>
            <p>Customize and download interactive simulated experiences for your demos</p>
          </div>
        </div>
      </header>

      <section className="component-control-bar">
        <div className="control-bar-content">
          <div className="control-bar-left">
            <label htmlFor="experienceSelect" className="component-select-label">
              Select Experience
            </label>
            <div className="component-select-wrap">
              <select
                id="experienceSelect"
                className="component-select-dropdown"
                value={selectedExperience}
                onChange={(e) => switchExperience(e.target.value)}
              >
                <option value="teams-copilot">Co-Pilot in MS Teams</option>
                {SHOW_CLAUDE_EXPERIENCE && <option value="claude">Claude</option>}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="generator-container" ref={containerRef}>
        <aside className="config-panel" style={{ flex: `0 0 ${panelWidth}px`, width: panelWidth }}>
          <div className="config-header">
            <h2>Configuration</h2>
            <p>Customize your experience below. Preview updates in real-time.</p>
          </div>

          {selectedExperience === 'teams-copilot' && (
            <details className="reskin-callout" open>
              <summary>
                <span aria-hidden="true">🎨</span> Reskin in 60 seconds
              </summary>
              <p className="reskin-intro">
                This template is a universal <strong>onboarding</strong> play — new sign-ups who go quiet before
                they activate. Make it your industry in 4 swaps:
              </p>
              <ol className="reskin-list">
                <li>
                  <strong>Brand &amp; logo</strong> — set your company name, agent name, and logo in the{' '}
                  <strong>Your demo</strong> tab. (Teams Copilot uses Microsoft’s fixed Fluent palette, so
                  there are no brand colors to set here — just like the real thing.)
                </li>
                <li>
                  <strong>The audience</strong> — swap “new customers” for yours: members, patients, cardholders,
                  policyholders…
                </li>
                <li>
                  <strong>The key action</strong> — swap “complete onboarding” for your activation moment: fund
                  account, book first appointment, activate card, enroll in benefits…
                </li>
                <li>
                  <strong>Segment &amp; journey names</strong> — rename “New Customers, Stalled Onboarding” and
                  “Welcome &amp; Activation” to match your play.
                </li>
              </ol>
            </details>
          )}

          {selectedExperience === 'teams-copilot' && (
            <details className="reskin-callout advanced-setup">
              <summary>
                <span aria-hidden="true">⚙️</span> Advanced — setup walkthrough
              </summary>
              <p className="reskin-intro">
                Want to get fancy with setup? Download an optional companion file that walks through how the
                agent and Marketing Cloud MCP server are configured in Copilot Studio and published to Teams —
                useful when connectivity or setup comes up. Otherwise just skip it.
              </p>
              <button
                type="button"
                className="download-btn"
                style={{ marginTop: 4, background: '#fff', color: '#5b5fc7', border: '1px solid #5b5fc7' }}
                onClick={downloadSetupHtml}
                disabled={validationErrors.length > 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Download Setup Walkthrough
              </button>
            </details>
          )}

          <form className="config-form" onSubmit={(e) => e.preventDefault()}>
            <div className="config-tab-bar" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className={`config-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'demo' && (
              <BrandingPanel
                brand={manifest.brand}
                assistant={manifest.assistant}
                experienceType={selectedExperience}
                onBrandChange={updateBrand}
                onAssistantChange={updateAssistant}
              />
            )}

            {activeTab === 'team' && (
              <TeamChatEditor
                chatTitle={manifest.chatTitle}
                members={members}
                viewer={manifest.viewer}
                messages={manifest.groupChat || []}
                sidebar={manifest.sidebar || []}
                onChatTitleChange={(value) => updateField('chatTitle', value)}
                onMembersChange={(value) => updateField('members', value)}
                onViewerChange={(value) => updateField('viewer', value)}
                onMessagesChange={(value) => updateField('groupChat', value)}
                onSidebarChange={(value) => updateField('sidebar', value)}
              />
            )}

            {activeTab === 'copilot' && (
              <>
                <div className="form-section">
                  <h3>Assistant Greeting</h3>
                  <div className="form-group">
                    <label htmlFor="greeting">Greeting</label>
                    <textarea
                      id="greeting"
                      rows={3}
                      value={manifest.assistant.greeting}
                      onChange={(e) => updateAssistant('greeting', e.target.value)}
                    />
                    <small>The opening message your assistant shows before the scripted turns.</small>
                  </div>
                </div>
                <ScriptTimelineEditor script={manifest.script} onChange={updateScript} />
              </>
            )}

            <div className="form-section download-section">
              <button
                type="button"
                className="download-btn"
                onClick={downloadHtml}
                disabled={validationErrors.length > 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Download Custom Experience
              </button>
              <p className="download-note">
                Download your customized HTML file and run it locally on your machine
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                <button
                  type="button"
                  className="cloudinary-upload-btn"
                  onClick={() => importRef.current && importRef.current.click()}
                >
                  Restore from HTML
                </button>
                <input
                  ref={importRef}
                  type="file"
                  accept=".html,text/html,.json,application/json"
                  style={{ display: 'none' }}
                  onChange={importWorkingFile}
                />
              </div>
              <p className="download-note" style={{ marginTop: 8 }}>
                One-file workflow: download the simulator HTML, then upload that same HTML later to restore where you
                left off. We auto-migrate onto the latest template fields for backward compatibility.
              </p>
              {validationErrors.length > 0 && (
                <div className="instruction-banner" style={{ margin: '12px 0 0', background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
                  {validationErrors.map((error) => (
                    <div key={error}>{error}</div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </aside>

        <div
          className={`resizer ${dragging ? 'dragging' : ''}`}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize configuration panel"
          onMouseDown={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
        >
          <div className="resizer-handle" />
        </div>

        <main className="preview-panel">
          <div className="preview-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Live Preview</h2>
              <p>See your changes in real-time</p>
            </div>
            <button
              type="button"
              className="cloudinary-upload-btn"
              style={{ borderColor: '#2a94d6', color: '#2a94d6', display: 'flex', gap: '8px', alignItems: 'center' }}
              onClick={restartPreview}
              disabled={isRunning}
            >
              {isRunning ? 'Running…' : '↻ Restart Demo'}
            </button>
          </div>
          {selectedExperience === 'teams-copilot' && (
            <div className="instruction-banner" style={{ margin: '0 0 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ fontSize: 16, lineHeight: '20px' }}>💡</span>
              <span>
                <strong>This experience has two editable screens:</strong> the{' '}
                <strong>Team chat</strong> you're working in (the conversation your audience peeks into) and the{' '}
                <strong>AI Copilot</strong>. Edit each under its tab on the left, then switch between them in the
                preview using the chat list. Click <strong>Copilot</strong> to open the assistant, then{' '}
                <strong>pick a starter or press send</strong> to step through the scripted demo — each send reveals
                the next response. <strong>Restart Demo</strong> resets it to the welcome screen.
              </span>
            </div>
          )}
          <div className="preview-container">
            <div className="preview-sim-inner">
              {errors.length > 0 && (
                <div className="instruction-banner" style={{ margin: '0 0 16px', background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
                  {errors.map((error) => (
                    <div key={error}>{error}</div>
                  ))}
                </div>
              )}
              <div style={{ width: '100%', margin: '0 auto' }}>
                <Frame
                  brand={manifest.brand}
                  assistant={manifest.assistant}
                  script={manifest.script}
                  resetSignal={resetSignal}
                  renderedSteps={renderedSteps}
                  isRunning={isRunning}
                chatTitle={manifest.chatTitle}
                viewer={manifest.viewer}
                groupChat={manifest.groupChat}
                members={members}
                sidebar={manifest.sidebar}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>© Cumulus. All rights reserved.</p>
        <p className="footer-note">Built for Salesforce Solution Engineers · Created by Monica Toledo</p>
      </footer>
    </div>
  )
}
