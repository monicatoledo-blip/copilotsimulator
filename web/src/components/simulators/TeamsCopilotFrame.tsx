function Bubble({ role, text, title, brand }) {
  if (role === 'toolAction') {
    return (
      <div className="rounded-xl border bg-sky-50 p-3 text-xs text-slate-700" style={{ borderColor: brand.accentColor }}>
        <div className="mb-1 font-semibold" style={{ color: brand.primaryColor }}>{title}</div>
        <div>{text}</div>
      </div>
    )
  }

  const isUser = role === 'userPrompt'
  return (
    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${isUser ? 'ml-auto text-white shadow' : 'border border-slate-200 bg-white text-slate-800'}`} style={isUser ? { background: brand.primaryColor } : undefined}>
      {text}
    </div>
  )
}

export default function TeamsCopilotFrame({ brand, assistant, renderedSteps }) {
  return (
    <section className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b bg-slate-50 px-4 py-3" style={{ borderColor: brand.accentColor }}>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">MS Teams Co-Pilot</p>
        <h3 className="font-semibold text-slate-900">{brand.name} - {assistant.name}</h3>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100 p-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{assistant.greeting}</div>
        {renderedSteps.map((step) => (
          <Bubble key={step.id} role={step.type} text={step.text} title={step.title} brand={brand} />
        ))}
      </div>
    </section>
  )
}
