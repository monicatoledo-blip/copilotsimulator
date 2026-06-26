import ReactionPicker from './ReactionPicker'

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
  messages,
  sidebar = [],
  onChatTitleChange,
  onMembersChange,
  onViewerChange,
  onMessagesChange,
  onSidebarChange,
}) {
  const viewerName = viewer || 'You'
  const authorOptions = [viewerName, ...members.map((m) => m.name).filter((n) => n !== viewerName)]

  const updateSidebar = (index, key, value) =>
    onSidebarChange(sidebar.map((s, i) => (i === index ? { ...s, [key]: value } : s)))

  const addSidebar = (type) =>
    onSidebarChange([
      ...sidebar,
      {
        id: `sb-${Date.now()}`,
        name: type === 'channel' ? 'New channel' : 'New person',
        type,
        section: 'Chats',
      },
    ])

  const removeSidebar = (index) => onSidebarChange(sidebar.filter((_, i) => i !== index))

  const moveSidebar = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= sidebar.length) return
    const next = [...sidebar]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onSidebarChange(next)
  }

  const updateMember = (index, key, value) => {
    onMembersChange(members.map((m, i) => (i === index ? { ...m, [key]: value } : m)))
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

  const moveMessage = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= messages.length) return
    const next = [...messages]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onMessagesChange(next)
  }

  const addMessage = () => {
    onMessagesChange([
      ...messages,
      {
        id: `gc-${Date.now()}`,
        type: 'userPrompt',
        author: viewerName,
        text: 'New message',
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

        <div className="form-group">
          <label>Teammates</label>
          <small style={{ display: 'block', marginBottom: 8 }}>
            Name + title/role. The title shows on the hover profile card in the chat (persona-driven).
          </small>
          {members.map((member, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}
            >
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
          ))}
          <button type="button" className="add-message-btn" onClick={addMember}>
            + Add teammate
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>Chat List (sidebar)</h3>
        <small style={{ display: 'block', marginBottom: 12 }}>
          The left rail of chats & channels. Group them under any section label. An entry whose name matches the{' '}
          <strong>Chat name</strong> above becomes the highlighted/active conversation.
        </small>

        {sidebar.map((item, index) => (
          <div key={item.id || index} className="msg-builder-row-inner" style={{ flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, width: '100%', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                value={item.name}
                placeholder="Name"
                onChange={(e) => updateSidebar(index, 'name', e.target.value)}
                style={{ ...inputStyle, flex: '1 1 150px', width: 'auto' }}
              />
              <select
                value={item.type || 'person'}
                onChange={(e) => updateSidebar(index, 'type', e.target.value)}
                style={{ ...inputStyle, width: 'auto', flex: '0 0 auto', background: '#fff' }}
              >
                <option value="person">Person</option>
                <option value="channel">Channel</option>
              </select>
              <input
                type="text"
                value={item.section || ''}
                placeholder="Section (e.g. Favorites)"
                onChange={(e) => updateSidebar(index, 'section', e.target.value)}
                style={{ ...inputStyle, flex: '1 1 130px', width: 'auto', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 14, width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={!!item.unread}
                  onChange={(e) => updateSidebar(index, 'unread', e.target.checked)}
                />
                Unread (bold + dot)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={!!item.mention}
                  onChange={(e) => updateSidebar(index, 'mention', e.target.checked)}
                />
                @ mention
              </label>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button type="button" className="msg-move-btn" onClick={() => moveSidebar(index, -1)}>
                  Up
                </button>
                <button type="button" className="msg-move-btn" onClick={() => moveSidebar(index, 1)}>
                  Down
                </button>
                <button type="button" className="msg-delete-btn" onClick={() => removeSidebar(index)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="add-message-btn" onClick={() => addSidebar('person')}>
            + Add person
          </button>
          <button type="button" className="add-message-btn" onClick={() => addSidebar('channel')}>
            + Add channel
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>Team Messages</h3>
        <p className="download-note" style={{ textAlign: 'left', margin: '0 0 16px' }}>
          The existing conversation your audience “peeks” into before Copilot joins.
        </p>

        {messages.map((msg, index) => (
          <div key={msg.id || index} className="msg-builder-row-inner" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexWrap: 'wrap' }}>
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
                <button type="button" className="msg-move-btn" onClick={() => moveMessage(index, -1)}>
                  Up
                </button>
                <button type="button" className="msg-move-btn" onClick={() => moveMessage(index, 1)}>
                  Down
                </button>
                <button type="button" className="msg-delete-btn" onClick={() => removeMessage(index)}>
                  Delete
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={msg.text}
              onChange={(e) => updateMessage(index, 'text', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 52 }}
            />

            <div style={{ width: '100%' }}>
              <ReactionPicker
                value={msg.reactions || []}
                onChange={(reactions) => updateMessage(index, 'reactions', reactions)}
              />
            </div>
          </div>
        ))}

        <button type="button" className="add-message-btn" onClick={addMessage}>
          + Add message
        </button>
      </div>
    </>
  )
}
