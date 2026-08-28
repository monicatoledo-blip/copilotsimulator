import { SLACK_STANDALONE_JS, SLACK_STANDALONE_CSS } from './slackStandaloneBundle'
import { SLACK_FONT_CSS } from './slackFonts'

// The Slack download bundles the real React SlackFrame (see standaloneSlack.tsx),
// so the exported HTML is identical to the live preview — no hand-written mirror.
export function buildSlackHtmlTemplate(serializedManifest: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slack Experience</title>
  <style>
${SLACK_FONT_CSS}
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; background: #f3f3f3; }
    #app { width: 100%; height: 100%; }
    .sl-window { height: 100vh !important; max-height: none !important; border-radius: 0 !important; border: 0 !important; box-shadow: none !important; }
${SLACK_STANDALONE_CSS}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>window.MANIFEST = ${serializedManifest};</script>
  <script>${SLACK_STANDALONE_JS}</script>
</body>
</html>`
}
