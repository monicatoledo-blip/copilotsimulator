// Content for the optional "setup walkthrough" — a guided click-through of how
// the agent + MCP server were configured in Microsoft Copilot Studio, then
// published to Teams. Mirrors the real Copilot Studio flow from the screenshare.
//
// This is a SECOND, separate standalone HTML export (companion to the demo).
// Content is fixed (not manifest-driven); only brand/agent names are injected
// at build time so the walkthrough reads as the same agent.
//
// Each step's `screen` selects which Copilot Studio mock the export renders.

export type SetupScreen = 'agents' | 'tools' | 'addTool' | 'channels'

export interface SetupStep {
  id: string
  title: string
  caption: string
  screen: SetupScreen
}

export const SETUP_TITLE = 'How this was set up'
export const SETUP_SUBTITLE =
  'A quick look at how the agent and its Marketing Cloud MCP server were configured in Microsoft Copilot Studio — then published to Teams.'

export const SETUP_STEPS: SetupStep[] = [
  {
    id: 'agents',
    title: 'Start in Copilot Studio',
    caption:
      'Agents are built and managed in Microsoft Copilot Studio. Each agent shows a Protection status — this one is Protected, so its data access is governed by your admin.',
    screen: 'agents',
  },
  {
    id: 'tools',
    title: 'Connect the Marketing Cloud MCP server',
    caption:
      'On the Tools tab, the agent is connected to the Marketing Cloud MCP server. That single connection is what lets the agent read and act on Marketing Cloud data from chat.',
    screen: 'tools',
  },
  {
    id: 'addTool',
    title: 'Add a tool with Model Context Protocol',
    caption:
      'New capabilities are added through Add tool → Model Context Protocol — the open standard for connecting an agent to data and actions. No custom code required.',
    screen: 'addTool',
  },
  {
    id: 'channels',
    title: 'Publish to Microsoft Teams',
    caption:
      'Finally, the agent is published to the Microsoft Teams channel. That is what puts it right inside the chat your team already works in — ready for the demo.',
    screen: 'channels',
  },
]
