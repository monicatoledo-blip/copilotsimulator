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

const TEAMS_TABS = [
  { id: 'demo', label: 'Your demo' },
  { id: 'team', label: 'Team chat' },
  { id: 'copilot', label: 'AI Copilot' },
]

const CLAUDE_TABS = [
  { id: 'demo', label: 'Your demo' },
  { id: 'copilot', label: 'AI Copilot' },
]

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 760

const CUMULUS_LOGO =
  'https://image.s4.sfmc-content.com/lib/fe3111727664047b741079/m/1/ccb17401-00ab-42c3-b141-7a1b93f23360.png'

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
  const [panelWidth, setPanelWidth] = useState(400)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)

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
    <div className="app-shell">
      <header>
        <div className="header-content">
          <img src={CUMULUS_LOGO} alt="Cumulus Financial" className="header-logo" />
          <div className="header-text">
            <h1>Experience Generator</h1>
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
                <option value="claude">Claude</option>
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
              onClick={runPreview}
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
                preview using the chat list — click <strong>Copilot</strong> to open the assistant, or your chat under{' '}
                <strong>Favorites</strong> to return.
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
        <p>© Cumulus Financial. All rights reserved.</p>
        <p className="footer-note">Built for Salesforce Solution Engineers · Created by Monica Toledo</p>
      </footer>
    </div>
  )
}
