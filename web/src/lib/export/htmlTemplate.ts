export function buildHtmlTemplate(serializedManifest: string) {
  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cumulus Experience Export</title>
  <style>
    body { font-family: Segoe UI, system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .frame { max-width: 860px; margin: 0 auto; border: 1px solid #dbe3ef; border-radius: 12px; background: #fff; overflow: hidden; }
    .header { padding: 16px; border-bottom: 1px solid #e2e8f0; }
    .track { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .msg { max-width: 80%; border-radius: 10px; padding: 10px 12px; font-size: 14px; line-height: 1.35; }
    .user { margin-left: auto; color: #fff; }
    .assistant { background: #f1f5f9; color: #0f172a; }
    .tool { border: 1px solid; border-radius: 8px; padding: 10px 12px; font-size: 13px; }
    .tool-title { font-weight: 600; margin-bottom: 4px; }
    .eyebrow { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
  </style>
</head>
<body>
  <div class="frame">
    <div class="header">
      <div class="eyebrow" id="sim-type"></div>
      <div id="title"></div>
      <div id="greeting" style="margin-top:8px;font-size:14px;color:#475569;"></div>
    </div>
    <div class="track" id="track"></div>
  </div>
  <script>
    const manifest = ${serializedManifest};
    const title = document.getElementById('title');
    const greeting = document.getElementById('greeting');
    const track = document.getElementById('track');
    const simType = document.getElementById('sim-type');
    simType.innerText = manifest.experienceType === 'teams-copilot' ? 'MS Teams Co-Pilot' : 'Claude';
    title.innerText = manifest.brand.name + ' - ' + manifest.assistant.name;
    title.style.color = manifest.brand.headlineColor;
    greeting.innerText = manifest.assistant.greeting;
    manifest.script.forEach((step) => {
      if (step.type === 'toolAction') {
        const tool = document.createElement('div');
        tool.className = 'tool';
        tool.style.borderColor = manifest.brand.accentColor;
        tool.innerHTML = '<div class="tool-title" style="color:' + manifest.brand.primaryColor + '">' + (step.title || 'Tool Action') + '</div><div>' + step.text + '</div>';
        track.appendChild(tool);
        return;
      }
      const msg = document.createElement('div');
      msg.className = 'msg ' + (step.type === 'userPrompt' ? 'user' : 'assistant');
      if (step.type === 'userPrompt') msg.style.background = manifest.brand.primaryColor;
      msg.innerText = step.text;
      track.appendChild(msg);
    });
  </script>
</body>
</html>`
}
