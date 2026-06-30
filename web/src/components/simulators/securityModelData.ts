// Single source of truth for the Copilot "security / least-privilege" popup.
// Used by the live React surface (TeamsCopilotFrame) AND interpolated into the
// standalone export (htmlTemplate.ts) so both stay in sync.
//
// The story for SEs: Copilot reaching into Marketing Cloud via an MCP server
// still respects the signed-in user's existing permissions, and writes are
// gated separately from reads (least-privilege). Read-only tools are
// "Always allow"; write tools default to "Custom" so the user opts in per tool —
// destructive tools (delete / clear / stop / exit) default to "Deny".
//
// The full tool inventory mirrors the Marketing Cloud Engagement MCP server.

export type ToolPermission = 'allow' | 'ask' | 'deny'

export interface SecurityTool {
  name: string
  // Default per-tool state when the group dropdown is set to "Custom".
  permission: ToolPermission
}

export const SECURITY_TITLE = 'Manage MCP Server for Marketing Cloud'
export const SECURITY_SUBTITLE = 'Choose when Copilot is allowed to use these tools.'

// Microsoft's own wording — keep verbatim so the value prop is defensible.
export const SECURITY_BANNER =
  'Copilot only surfaces organizational data to which you already have at least view permissions, using the same access controls as the rest of Microsoft 365. Admins govern which tools are allowed, and every action is auditable in Microsoft Purview.'

// Read-only MCE tools — safe to "Always allow".
export const READ_ONLY_TOOLS: SecurityTool[] = [
  { name: 'Describe object', permission: 'allow' },
  { name: 'Search attributes', permission: 'allow' },
  { name: 'Search Content Builder assets', permission: 'allow' },
  { name: 'Get automation', permission: 'allow' },
  { name: 'Get automation categories', permission: 'allow' },
  { name: 'Get automation instance', permission: 'allow' },
  { name: 'Get automations', permission: 'allow' },
  { name: 'Get contact key by email address', permission: 'allow' },
  { name: 'Get content assets', permission: 'allow' },
  { name: 'Get Content Builder asset', permission: 'allow' },
  { name: 'Get content categories', permission: 'allow' },
  { name: 'Get data extension', permission: 'allow' },
  { name: 'Get data extension fields', permission: 'allow' },
  { name: 'Get data extension folders', permission: 'allow' },
  { name: 'Get data extension link', permission: 'allow' },
  { name: 'Get data extensions', permission: 'allow' },
  { name: 'Get data extensions by category', permission: 'allow' },
  { name: 'Get email subscription status', permission: 'allow' },
  { name: 'Get event definition', permission: 'allow' },
  { name: 'Get event definitions', permission: 'allow' },
  { name: 'Get journey', permission: 'allow' },
  { name: 'Get journey link', permission: 'allow' },
  { name: 'Get journey publish status', permission: 'allow' },
  { name: 'Get journey versions', permission: 'allow' },
  { name: 'Get journeys', permission: 'allow' },
  { name: 'Get list subscribers', permission: 'allow' },
  { name: 'Get lists', permission: 'allow' },
  { name: 'Get MobileConnect codes', permission: 'allow' },
  { name: 'Get push opt-in status by subscriber key', permission: 'allow' },
  { name: 'Get send classifications', permission: 'allow' },
  { name: 'Get sender profiles', permission: 'allow' },
  { name: 'Get SMS definition', permission: 'allow' },
  { name: 'Get SMS definitions', permission: 'allow' },
  { name: 'Get SMS subscription status', permission: 'allow' },
  { name: 'Get SQL queries', permission: 'allow' },
  { name: 'Get SQL query', permission: 'allow' },
  { name: 'Get timezones', permission: 'allow' },
  { name: 'Get transactional send status', permission: 'allow' },
  { name: 'Get triggered send summary', permission: 'allow' },
  { name: 'Retrieve contact status', permission: 'allow' },
  { name: 'Retrieve data extension record', permission: 'allow' },
  { name: 'Validate SQL query', permission: 'allow' },
]

// Write / mutating MCE tools — destructive ones default to "Deny", the rest "Ask".
export const WRITE_TOOLS: SecurityTool[] = [
  // Destructive — default Deny.
  { name: 'Clear data extension data', permission: 'deny' },
  { name: 'Delete data extension', permission: 'deny' },
  { name: 'Delete event definition', permission: 'deny' },
  { name: 'Delete journey', permission: 'deny' },
  { name: 'Exit contact from journey', permission: 'deny' },
  { name: 'Stop journey', permission: 'deny' },
  { name: 'Pause journey', permission: 'deny' },
  // Mutating — default Ask.
  { name: 'Create automation', permission: 'ask' },
  { name: 'Update automation', permission: 'ask' },
  { name: 'Run automation', permission: 'ask' },
  { name: 'Run automation activities', permission: 'ask' },
  { name: 'Create Content Builder asset', permission: 'ask' },
  { name: 'Update Content Builder asset', permission: 'ask' },
  { name: 'Create data extension', permission: 'ask' },
  { name: 'Update data extension', permission: 'ask' },
  { name: 'Create data extension field', permission: 'ask' },
  { name: 'Update data extension field', permission: 'ask' },
  { name: 'Upsert data extension record', permission: 'ask' },
  { name: 'Create email', permission: 'ask' },
  { name: 'Create email template', permission: 'ask' },
  { name: 'Create email send definition', permission: 'ask' },
  { name: 'Create event definition', permission: 'ask' },
  { name: 'Update event definition', permission: 'ask' },
  { name: 'Fire journey event', permission: 'ask' },
  { name: 'API event trigger', permission: 'ask' },
  { name: 'Data extension trigger', permission: 'ask' },
  { name: 'Create journey', permission: 'ask' },
  { name: 'Update journey', permission: 'ask' },
  { name: 'Publish journey', permission: 'ask' },
  { name: 'Republish journey content', permission: 'ask' },
  { name: 'Resume journey', permission: 'ask' },
  { name: 'Insert contacts into journey', permission: 'ask' },
  { name: 'Create SMS', permission: 'ask' },
  { name: 'Create SMS definition', permission: 'ask' },
  { name: 'Create SMS send definition', permission: 'ask' },
  { name: 'Send outbound SMS message', permission: 'ask' },
  { name: 'Create MobileConnect keyword', permission: 'ask' },
  { name: 'Create SQL query', permission: 'ask' },
  { name: 'Update SQL query', permission: 'ask' },
  { name: 'Run SQL query', permission: 'ask' },
  { name: 'Create triggered send definition', permission: 'ask' },
  { name: 'Republish triggered send', permission: 'ask' },
  { name: 'Send transactional email', permission: 'ask' },
  { name: 'Refresh transactional email', permission: 'ask' },
  { name: 'Send push notification', permission: 'ask' },
  { name: 'Update contact attributes', permission: 'ask' },
]

export const READ_ONLY_DEFAULT_MODE = 'Always allow'
export const WRITE_DEFAULT_MODE = 'Custom'
