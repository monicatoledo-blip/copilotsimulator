# Project Notes — AI Assistant Simulator (copilotsimulator)

Working handoff doc so you (or a future session) can pick up quickly.
Last updated: 2026-06-30.

---

## What this project is
A **Vite + React 19 + TypeScript** single-page web app for Salesforce Solution
Engineers to author and export **deterministic, scripted AI-assistant demo
simulations** — no live model calls. The flagship experience is **"Co-Pilot in
MS Teams"**; a **Claude** experience exists but is hidden in the UI
(`SHOW_CLAUDE_EXPERIENCE = false`). Branding is "Cumulus Financial." Built by
Monica Toledo.

The SE customizes branding, the team chat, and the Copilot script in a left
config panel, sees a live preview on the right, and clicks **Download Custom
Experience** to get a single self-contained HTML file to hand off. That HTML can
be re-uploaded ("Restore from HTML") to resume editing.

---

## ⚠️ Two things to know before you edit anything

### 1. The live app is `web/src/`, NOT `src/`
Entry chain: `index.html` → `src/main.jsx` → `src/App.jsx` →
**`web/src/pages/ExperienceGeneratorPage.tsx`**.

The `src/components/*.jsx` and `src/data/*.js` files are an **orphaned legacy
tree** — nothing in the live app imports them. Only `src/main.jsx`,
`src/App.jsx`, `src/index.css`, `src/App.css` are live. Ignore the rest of `src/`.

### 2. Every Copilot/chat UI change must be made TWICE
The live preview and the downloaded file are **two separate implementations**:
1. **Live React surface** — `web/src/components/simulators/TeamsCopilotFrame.tsx`
   + styles in `teams-copilot.css` / `teams-group.css`.
2. **Standalone export** — `web/src/lib/export/htmlTemplate.ts`, a self-contained
   vanilla-JS/CSS re-implementation (737+ lines). `buildStandaloneHtml.ts` just
   injects the manifest JSON.

If you add a feature to the React surface and forget the export, it won't appear
in the downloaded HTML the SE hands off. Always update both.

---

## Project layout (live tree)

| Path | What it does |
|---|---|
| `web/src/pages/ExperienceGeneratorPage.tsx` | Whole app shell: header, experience `<select>`, resizable config panel, tabs (Your demo / Team chat / AI Copilot), live preview, download + restore, manifest migration. |
| `web/src/components/BrandingPanel.tsx` | Brand/assistant fields editor. |
| `web/src/components/TeamChatEditor.tsx` | Edits group-chat messages, members, sidebar. |
| `web/src/components/ScriptTimelineEditor.tsx` | Edits the Copilot scripted steps. |
| `web/src/components/ReactionPicker.tsx` | Emoji reactions on chat messages. |
| `web/src/components/simulators/TeamsCopilotFrame.tsx` | High-fidelity Teams Copilot surface (interactive — each send reveals the next scripted step). **Hosts the security popup.** |
| `web/src/components/simulators/TeamsGroupChat.tsx` | Group chat render w/ persona hover cards + reaction toolbar. |
| `web/src/components/simulators/ClaudeFrame.tsx` | Claude surface (auto-plays). Hidden in UI for now. |
| `web/src/components/simulators/securityModelData.ts` | **Single source of truth for the security popup** (copy + MCE tool lists). |
| `web/src/components/simulators/{teams-copilot,teams-group}.css` | Styling. |
| `web/src/lib/export/htmlTemplate.ts` | Standalone export — mirrors the whole simulator in vanilla JS/CSS. |
| `simulators/engine/validateScript.ts` | Manifest types + `validateScript()`. |
| `simulators/engine/runScript.ts` | Plays steps with `delayMs` pacing. |
| `simulators/content/co-pilot.default.json` | Default Co-Pilot manifest (customer "stalled onboarding" play). |
| `simulators/content/claude.default.json` | Default Claude manifest. |
| `simulators/content/presets/*.json` | fins-headless-audit, fins-headless-journey-build. |

### Manifest shape
`{ id, experienceType, brand{name,primaryColor,accentColor,headlineColor,logoUrl},
assistant{name,avatarUrl,greeting}, chatTitle, viewer, members[], groupChat[],
script[] }`. Script step types: `userPrompt`, `assistantResponse`, `toolAction`,
`visualization`. `migrateManifest()` merges uploaded manifests onto current
defaults; `parseImportedManifest()` accepts raw JSON or extracts the embedded
`var MANIFEST = {...}` from an exported HTML.

---

## Run / build / test
```bash
npm run dev      # Vite dev server (usually :3000; falls back to :3001 if busy)
npm run build    # production build → dist/
npm test         # tsx tests in simulators/tests/*.test.ts
npm run lint     # oxlint
npm start        # serve dist (Heroku-ready; uses $PORT)
```

### Quick visual check without clicking through the UI
Headless Chrome can screenshot the app or an auto-opened export:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1280,900 --virtual-time-budget=2500 \
  --screenshot=/tmp/shot.png "http://localhost:3000/"
```
To screenshot the **export** with the Copilot view + security modal already open,
generate the HTML and inject clicks after `preloadChat();` (e.g.
`document.getElementById('nav-copilot').click()` then `'tc-shield'.click()`),
write to a temp file, and screenshot that file URL.
`ffmpeg` is NOT installed; to read video frames use the AVFoundation/`swift`
approach (see git history of this session if needed).

### Known pre-existing test failure
`simulators/tests/exportPlayback.test.ts` → "standalone html contains simulator
payload" was **already failing before the security work** — it asserts the
template contains the string "Cumulus Experience Export" and an old greeting that
no longer match the current template (`<title>` is "Experience"). Not caused by
recent changes. Fix or update that test separately if it bothers you.

---

## Feature: Copilot security / least-privilege popup (shipped 2026-06-30)

**Why:** When an SE demos Copilot reaching into Marketing Cloud via MCP,
prospects ask "is this safe?" This gives an on-screen affordance to land the
least-privilege / data-safety story.

**What:** A green **shield** icon in the Copilot header (top-right, next to New
chat / history / `...`) — matches the real M365 Copilot, which shows a green
shield there. Clicking it opens a **"Manage MCP Server for Marketing Cloud"**
modal. **Simplified 2026-06-30 after field feedback** (marketers found per-tool
detail too deep) — it now reads as a glanceable trust screen:
- Leads with 4 plain-language **reassurance points** (`SECURITY_POINTS`): only
  sees data you can access, admin-controlled, auditable in Purview, not used to
  train AI.
- A one-line **summary**: "42 read-only tools — always allowed · 46 write tools
  — require approval".
- **Read-only tools (42)** and **Write tools (46)** groups are now **collapsed by
  default**; one click expands the full per-tool **Allow / Ask / Deny** toggles
  for technical buyers. Destructive ops default to **Deny**, other writes **Ask**.
- Cancel / Save footer (illustrative — just close).

**Where the code lives:**
- Content: `web/src/components/simulators/securityModelData.ts` — exports
  `SECURITY_TITLE`, `SECURITY_SUBTITLE`, `SECURITY_POINTS`, `SECURITY_BANNER`
  (banner kept for reference, no longer rendered), `READ_ONLY_TOOLS`,
  `WRITE_TOOLS`, `READ_ONLY_DEFAULT_MODE`, `WRITE_DEFAULT_MODE`. Tool lists mirror
  the full Marketing Cloud Engagement MCP server.
- Live React: `TeamsCopilotFrame.tsx` — `ShieldIcon`, `PermToggle`,
  `SecurityGroup`, `SecurityModal`; `securityOpen` state in `CopilotSurface`;
  shield button is the first item in `.tc-header-actions`.
- Live styles: `teams-copilot.css` — `.tc-shield`, `.tc-secmodal*`, `.tc-sec-*`
  rules (search "security / least-privilege popup"). `.tc-app` was made
  `position: relative` so the overlay anchors to it.
- Export: `htmlTemplate.ts` — imports `securityModelData`, serializes it into a
  `var SECURITY = {...}` payload, mirrors the shield button + modal markup + CSS
  + a vanilla-JS render/toggle handler (search "Security / least-privilege
  popup" in the script block).

**The popup content is fixed (not manifest-driven).** It does not appear in the
config panel and is the same for every exported demo. Editing the tool lists or
copy = edit `securityModelData.ts` only; both surfaces update from it.

### Ideas / possible next steps
- Make the popup manifest-driven (add fields + a config sub-tab) so SEs can
  tailor tool names/permissions per demo. Would require manifest schema +
  `migrateManifest()` + export-serialization changes.
- Sub-group the write tools under visible "Destructive" / "Standard" headers.
- Re-enable the Claude experience (`SHOW_CLAUDE_EXPERIENCE = true`) if/when wanted.

---

## Feature: Setup walkthrough (second standalone HTML, shipped 2026-06-30)

**Why:** Reviewer asked whether to show how the agent + MCP server get set up.
Field ask is "what does creating a campaign in Teams via MCP look like?", and
marketers don't want depth — so this is an **optional companion**, not part of
the main demo. Built as a **guided click-through** (not an interactive builder).

**What:** A separate **"Download Setup Walkthrough"** button (Copilot experience
only) emits `<id>-setup.html` — a self-contained 4-step walkthrough of the real
Microsoft Copilot Studio flow, with Back / Next / Done nav and step dots:
1. **Agents list** — the agent row highlighted with **Protected ✓** badge.
2. **Tools tab** — Marketing Cloud MCP server connected ("Model Context
   Protocol (1)").
3. **Add tool → Model Context Protocol** — the add-tool modal, MCP card
   highlighted.
4. **Channels → Published to Microsoft Teams** — Teams channel highlighted.

It's a **second, independent file** from the demo export — SEs choose to show it
or skip straight to the campaign-in-Teams demo.

**Where the code lives:**
- Step content (fixed, data-driven): `web/src/components/simulators/setupStepsData.ts`
  — `SETUP_TITLE`, `SETUP_SUBTITLE`, `SETUP_STEPS` (each has `title`, `caption`,
  `screen`). Easy to edit step copy/order here.
- Export template: `web/src/lib/export/setupTemplate.ts` — self-contained HTML +
  inline CSS (`.su-*` classes) + vanilla JS. Renders Copilot Studio chrome
  (`chrome()`), four screen renderers (`screenAgents/Tools/AddTool/Channels`),
  and the footer nav (`render()`/`idx` step state). Brand/agent names injected
  from the manifest.
- Build wrapper: `web/src/lib/export/buildSetupHtml.ts` (mirrors
  `buildStandaloneHtml.ts`).
- Wiring: `ExperienceGeneratorPage.tsx` — `downloadSetupHtml()` + the second
  button in the download section (Copilot experience only).

**Setup content is fixed (not manifest-driven)**, like the security popup. No
manifest/schema/migration changes. There is currently **no live-preview tab** for
the walkthrough — it's download-only. Adding a `SetupFrame` React preview is a
possible next step (would read the same `setupStepsData`).

---

## Git
- Default branch: `main`. Latest relevant commit: security popup + full MCE tool
  list (`e7a6870`).
- Note: git committer identity auto-resolved to a `…internal.salesforce.com`
  email because no global `user.email` is set. Set it with
  `git config --global user.email "..."` if you want proper attribution.
