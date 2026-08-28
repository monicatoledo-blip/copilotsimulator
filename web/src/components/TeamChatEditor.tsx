import ReactionPicker from './ReactionPicker'
import AvatarField from './AvatarField'
import { useDragReorder, GripIcon } from './useDragReorder'

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #dddbda',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'inherit',
}

export default function TeamChatEditor({
  chatTitle,
  members,
  viewer,
  viewerAvatarUrl,
  nativeEmoji = false,
  messages,
  sidebar = [],
  onChatTitleChange,
  onMembersChange,
  onViewerChange,
  onViewerAvatarChange,
  onMessagesChange,
  onSidebarChange,
  onRestoreDefaultMessages,
}) {
  const viewerName = viewer || 'You'
  const authorOptions = [viewerName, ...members.map((m) => m.name).filter((n) => n !== viewerName)]

  const updateSidebar = (index, key, value) =>
    onSidebarChange(sidebar.map((s, i) => (i === index ? { ...s, [key]: value } : s)))

  const addSidebarTo = (section) => {
    const type = section === 'Direct messages' ? 'person' : 'channel'
    onSidebarChange([
      ...sidebar,
      {
        id: `sb-${Date.now()}`,
        name: section === 'Direct messages' ? 'New person' : 'new-channel',
        type,
        section,
      },
    ])
  }

  const removeSidebar = (index) => onSidebarChange(sidebar.filter((_, i) => i !== index))

  // Reorder an item within its own section (swap with the nearest same-section neighbor).
  const moveWithinSection = (index, direction) => {
    const section = sidebar[index]?.section
    let target = index + direction
    while (target >= 0 && target < sidebar.length && sidebar[target]?.section !== section) target += direction
    if (target < 0 || target >= sidebar.length) return
    const next = [...sidebar]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onSidebarChange(next)
  }

  const updateMember = (index, key, value) => {
    const prevName = members[index]?.name
    onMembersChange(members.map((m, i) => (i === index ? { ...m, [key]: value } : m)))
    // Renaming a teammate must cascade to every message they authored, otherwise
    // the chat rows keep showing the old name (author is stored per-message).
    if (key === 'name' && prevName && prevName !== value) {
      onMessagesChange(messages.map((msg) => (msg.author === prevName ? { ...msg, author: value } : msg)))
    }
  }

  const addMember = () =>
    onMembersChange([...members, { name: `Member ${members.length + 1}`, title: '' }])

  const removeMember = (index) => {
    onMembersChange(members.filter((_, i) => i !== index))
  }

  const changeViewer = (value) => {
    const nextName = value || 'You'
    onMessagesChange(messages.map((m) => (m.author === viewerName ? { ...m, author: nextName } : m)))
    onViewerChange(value)
  }

  const updateMessage = (index, key, value) => {
    onMessagesChange(messages.map((msg, i) => (i === index ? { ...msg, [key]: value } : msg)))
  }

  const reorderMessage = (from, to) => {
    const next = [...messages]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onMessagesChange(next)
  }
  // Sidebar keeps its Up/Down buttons; messages use drag-to-reorder.
  const msgDrag = useDragReorder(messages.length, reorderMessage)

  const addMessage = () => {
    onMessagesChange([
      ...messages,
      {
        id: `gc-${Date.now()}`,
        type: 'userPrompt',
        author: viewerName,
        text: '',
      },
    ])
  }

  const removeMessage = (index) => onMessagesChange(messages.filter((_, i) => i !== index))

  return (
    <>
      <div className="form-section">
        <h3>Team Chat</h3>

        <div className="form-group">
          <label htmlFor="chatTitle">Chat name</label>
          <input
            id="chatTitle"
            type="text"
            value={chatTitle || ''}
            onChange={(e) => onChatTitleChange(e.target.value)}
            placeholder="e.g. Campaign Ops"
          />
          <small>Shown in the chat header (e.g. a group name or topic).</small>
        </div>

        <div className="form-group">
          <label htmlFor="viewer">Your name</label>
          <input
            id="viewer"
            type="text"
            value={viewer || ''}
            onChange={(e) => changeViewer(e.target.value)}
            placeholder="You"
          />
          <small>This is you — your messages appear right-aligned in purple. Not part of the member list.</small>
        </div>

        {onViewerAvatarChange && (
          <div className="form-group">
            <label>Your profile photo</label>
            <AvatarField
              value={viewerAvatarUrl}
              onChange={(url) => onViewerAvatarChange(url)}
              label={viewerName}
            />
            <small>Shows as {viewerName}'s avatar in the rail and on {viewerName}'s messages. Leave blank for colored initials.</small>
          </div>
        )}

        <div className="form-group">
          <label>Teammates</label>
          <small style={{ display: 'block', marginBottom: 8 }}>
            Name + title/role. The title shows on the hover profile card in the chat (persona-driven). Add an
            avatar image, or leave it blank for colored initials.
          </small>
          {members.map((member, index) => (
            <div
              key={index}
              style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10, padding: 8, border: '1px solid #eee', borderRadius: 6 }}
            >
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 140px' }}>
                  <input
                    type="text"
                    value={member.name}
                    placeholder="Name"
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={member.title || ''}
                    placeholder="Title / role, e.g. VP, Marketing"
                    onChange={(e) => updateMember(index, 'title', e.target.value)}
                    style={{ ...inputStyle, fontSize: 13 }}
                  />
                </div>
                <button type="button" className="msg-delete-btn" onClick={() => removeMember(index)}>
                  Delete
                </button>
              </div>
              <AvatarField
                value={member.avatarUrl}
                onChange={(url) => updateMember(index, 'avatarUrl', url)}
                label={member.name || 'A'}
              />
            </div>
          ))}
          <button type="button" className="add-message-btn" onClick={addMember}>
            + Add teammate
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>Team Messages</h3>
        <p className="download-note" style={{ textAlign: 'left', margin: '0 0 16px' }}>
          The existing conversation your audience “peeks” into before Copilot joins.
        </p>

        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`msg-builder-row-inner${msgDrag.dragIndex === index ? ' is-dragging' : ''}${msgDrag.overIndex === index && msgDrag.dragIndex !== index ? ' is-drop-target' : ''}`}
            style={{ flexDirection: 'column' }}
            {...msgDrag.rowProps(index)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexWrap: 'wrap' }}>
              <span className="msg-drag-handle" title="Drag to reorder" {...msgDrag.handleProps(index)}>
                <GripIcon />
              </span>
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
                value={msg.author || viewerName}
                onChange={(e) => updateMessage(index, 'author', e.target.value)}
                style={{ ...inputStyle, width: 'auto', flex: '0 1 auto', background: '#fff' }}
              >
                {authorOptions.map((member, i) => (
                  <option key={i} value={member}>
                    {member === viewerName ? `${member} (you)` : member}
                  </option>
                ))}
              </select>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button type="button" className="msg-delete-btn" onClick={() => removeMessage(index)}>
                  Delete
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={msg.text}
              placeholder="Type the message…"
              onChange={(e) => updateMessage(index, 'text', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 52 }}
            />

            <div style={{ width: '100%' }}>
              <ReactionPicker
                native={nativeEmoji}
                value={msg.reactions || []}
                onChange={(reactions) => updateMessage(index, 'reactions', reactions)}
              />
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" className="add-message-btn" onClick={addMessage}>
            + Add message
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              className="msg-delete-btn"
              onClick={() => {
                if (window.confirm('Clear all team messages? You can rebuild from scratch or restore the default.')) onMessagesChange([])
              }}
            >
              Clear all
            </button>
          )}
          {onRestoreDefaultMessages && (
            <button
              type="button"
              className="msg-move-btn"
              onClick={() => {
                if (window.confirm('Restore the default team conversation? This replaces the current messages.')) onRestoreDefaultMessages()
              }}
            >
              Restore default
            </button>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Chat List (sidebar)</h3>
        <small style={{ display: 'block', marginBottom: 12 }}>
          The left rail, grouped into Slack's three sections. An entry whose name matches the{' '}
          <strong>Chat name</strong> above becomes the highlighted/active conversation.
        </small>

        {['Broadcast', 'Channels', 'Direct messages'].map((section) => {
          const rows = sidebar
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => (item.section || 'Channels') === section)
          return (
            <div key={section} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#5b5b5b', margin: '4px 0 8px' }}>{section}</div>
              {rows.map(({ item, index }) => (
                <div key={item.id || index} className="msg-builder-row-inner" style={{ flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: '#8d8d8d' }}>{section === 'Direct messages' ? '•' : '#'}</span>
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Name"
                      onChange={(e) => updateSidebar(index, 'name', e.target.value)}
                      style={{ ...inputStyle, flex: '1 1 150px', width: 'auto' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={!!item.unread}
                        onChange={(e) => updateSidebar(index, 'unread', e.target.checked)}
                      />
                      Unread (bold)
                    </label>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      <button type="button" className="msg-move-btn" onClick={() => moveWithinSection(index, -1)}>Up</button>
                      <button type="button" className="msg-move-btn" onClick={() => moveWithinSection(index, 1)}>Down</button>
                      <button type="button" className="msg-delete-btn" onClick={() => removeSidebar(index)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="add-message-btn" onClick={() => addSidebarTo(section)}>
                + Add to {section}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}
