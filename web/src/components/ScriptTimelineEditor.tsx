const TYPES = [
  { value: 'userPrompt', label: 'Customer message' },
  { value: 'assistantResponse', label: 'Agent response' },
  { value: 'toolAction', label: 'Tool action' },
]

export default function ScriptTimelineEditor({ script, onChange }) {
  const updateStep = (index, key, value) => {
    const next = script.map((step, idx) => (idx === index ? { ...step, [key]: value } : step))
    onChange(next)
  }

  const moveStep = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= script.length) return
    const next = [...script]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onChange(next)
  }

  const addStep = () => {
    onChange([
      ...script,
      {
        id: `step-${Date.now()}`,
        type: 'assistantResponse',
        text: 'New response',
      },
    ])
  }

  const removeStep = (index) => {
    onChange(script.filter((_, idx) => idx !== index))
  }

  return (
    <div className="form-section">
      <h3>Customer &amp; Agent Messages</h3>
      <p className="download-note" style={{ textAlign: 'left', margin: '0 0 16px' }}>
        Ordered prompts, responses, and tool actions. Plays back exactly as authored for a reliable demo.
      </p>

      {script.map((step, index) => (
        <div key={step.id} className="msg-builder-row-inner" style={{ flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#e8f4fc',
                color: '#032d60',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            <select
              value={step.type}
              onChange={(e) => updateStep(index, 'type', e.target.value)}
              style={{
                padding: '8px 10px',
                border: '1px solid #dddbda',
                borderRadius: 4,
                fontSize: 14,
                background: '#fff',
              }}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button type="button" className="msg-move-btn" onClick={() => moveStep(index, -1)}>
                Up
              </button>
              <button type="button" className="msg-move-btn" onClick={() => moveStep(index, 1)}>
                Down
              </button>
              <button type="button" className="msg-delete-btn" onClick={() => removeStep(index)}>
                Delete
              </button>
            </div>
          </div>

          {step.type === 'toolAction' && (
            <input
              type="text"
              placeholder="Tool action title"
              value={step.title || ''}
              onChange={(e) => updateStep(index, 'title', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #dddbda',
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          )}

          <textarea
            rows={3}
            value={step.text}
            onChange={(e) => updateStep(index, 'text', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #dddbda',
              borderRadius: 4,
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 64,
            }}
          />
        </div>
      ))}

      <button type="button" className="add-message-btn" onClick={addStep}>
        + Add Message
      </button>
    </div>
  )
}
