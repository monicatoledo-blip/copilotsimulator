import { SLACK_CSS as slackCss, SLACK_RUNTIME as slackRuntime } from './slackAssets'
import { SLACK_FONT_CSS } from './slackFonts'
import { SLACKBOT_ICON } from '../../components/simulators/slackbotIconData'
import { SALESFORCE_LOGO } from '../../components/simulators/salesforceLogoData'
import {
  READ_ONLY_TOOLS,
  WRITE_TOOLS,
  READ_ONLY_DEFAULT_MODE,
  WRITE_DEFAULT_MODE,
} from '../../components/simulators/securityModelData'

const SECURITY_DATA = JSON.stringify({
  readOnlyMode: READ_ONLY_DEFAULT_MODE,
  writeMode: WRITE_DEFAULT_MODE,
  readOnly: READ_ONLY_TOOLS,
  write: WRITE_TOOLS,
})

export function buildSlackHtmlTemplate(serializedManifest: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slack Experience</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap" />
  <style>
${SLACK_FONT_CSS}
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; background: #f3f3f3; }
    #app { width: 100%; height: 100%; }
    .sl-window { height: 100vh !important; max-height: none !important; border-radius: 0 !important; border: 0 !important; box-shadow: none !important; }
${slackCss}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    window.MANIFEST = ${serializedManifest};
    window.SECURITY = ${SECURITY_DATA};
    window.SLACKBOT_ICON = ${JSON.stringify(SLACKBOT_ICON)};
    window.SALESFORCE_LOGO = ${JSON.stringify(SALESFORCE_LOGO)};
  </script>
  <script>${slackRuntime}</script>
</body>
</html>`
}
