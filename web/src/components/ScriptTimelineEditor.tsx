const TYPES = ['userPrompt', 'assistantResponse', 'toolAction']

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Script Timeline</h3>
        <button className="rounded-lg bg-[#0F4C81] px-3 py-1.5 text-xs font-semibold text-white shadow" onClick={addStep}>+ Add step</button>
      </div>
      <div className="space-y-3">
        {script.map((step, index) => (
          <div key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">#{index + 1}</span>
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 outline-none focus:border-slate-500"
                value={step.type}
                onChange={(e) => updateStep(index, 'type', e.target.value)}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button className="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700" onClick={() => moveStep(index, -1)}>Up</button>
              <button className="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700" onClick={() => moveStep(index, 1)}>Down</button>
              <button className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs text-rose-700" onClick={() => removeStep(index)}>Remove</button>
            </div>

            {step.type === 'toolAction' && (
              <input
                className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500"
                placeholder="Tool action title"
                value={step.title || ''}
                onChange={(e) => updateStep(index, 'title', e.target.value)}
              />
            )}

            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500"
              rows={3}
              value={step.text}
              onChange={(e) => updateStep(index, 'text', e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
