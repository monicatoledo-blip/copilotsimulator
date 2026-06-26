function ClaudeBubble({ role, text, title, brand }) {
  if (role === 'toolAction') {
    return (
      <div className="rounded-md border border-dashed p-3 text-xs" style={{ borderColor: brand.accentColor }}>
        <div className="mb-1 font-semibold" style={{ color: brand.primaryColor }}>{title}</div>
        <div>{text}</div>
      </div>
    )
  }
  const isUser = role === 'userPrompt'
  return (
    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${isUser ? 'ml-auto text-white' : 'bg-amber-50 text-slate-900'}`} style={isUser ? { background: brand.primaryColor } : undefined}>
      {text}
    </div>
  )
}

export default function ClaudeFrame({ brand, assistant, renderedSteps }) {
  return (
    <section className="flex h-full min-h-[480px] flex-col rounded-lg border border-slate-200 bg-white">
      <header className="border-b px-4 py-3" style={{ borderColor: brand.accentColor }}>
        <p className="text-xs uppercase tracking-wide text-slate-500">Claude</p>
        <h3 className="font-semibold" style={{ color: brand.headlineColor }}>{brand.name} - {assistant.name}</h3>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <div className="rounded-lg bg-amber-100 p-3 text-sm text-slate-700">{assistant.greeting}</div>
        {renderedSteps.map((step) => (
          <ClaudeBubble key={step.id} role={step.type} text={step.text} title={step.title} brand={brand} />
        ))}
      </div>
    </section>
  )
}
