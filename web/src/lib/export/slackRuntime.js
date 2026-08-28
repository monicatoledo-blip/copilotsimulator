/* Standalone Slack simulator runtime. Plain JS, imported as ?raw text into
   slackHtmlTemplate.ts. Reads window.MANIFEST and window.SECURITY. Mirrors
   SlackFrame.tsx (skin-agnostic engine + Slack chrome). */
(function () {
  var M = window.MANIFEST || {}
  var SEC = window.SECURITY || { readOnly: [], write: [] }
  var brand = M.brand || {}
  var assistant = M.assistant || {}
  var viewer = M.viewer || 'there'
  var activeChannel = M.chatTitle || 'cap1-campaign-ops'

  var AV = ['#4A154B', '#1264A3', '#2BAC76', '#E8912D', '#7C3AED', '#0B6E99', '#CD2553']
  function colorFor(n) {
    var h = 0
    for (var i = 0; i < (n || '').length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0
    return AV[h % AV.length]
  }
  function initials(n) {
    var p = (n || '?').trim().split(/\s+/)
    return (p.length === 1 ? p[0].charAt(0) : p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase()
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  function fillName(t) {
    if (t == null) return t
    return String(t).replace(/\{\{?\s*name\s*\}?\}/gi, viewer)
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag)
    if (cls) e.className = cls
    if (html != null) e.innerHTML = html
    return e
  }

  // inline markdown: **bold**, @mention, `code`
  function renderInline(text) {
    var s = esc(text)
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/`([^`]+)`/g, '<code class="rt-code">$1</code>')
    s = s.replace(/@\[([^\]]+)\]/g, '<span class="tg-mention">$1</span>')
    s = s.replace(/(^|[^\w])@([A-Za-z0-9_]+)/g, '$1<span class="tg-mention">$2</span>')
    return s
  }
  // block-level: paragraphs, - bullets, --- hr, > toolcall
  function renderRich(text) {
    var lines = String(text || '').split('\n')
    var out = ''
    var bullets = []
    function flush() {
      if (bullets.length) {
        out += '<ul class="tg-ul">' + bullets.map(function (b) { return '<li>' + renderInline(b) + '</li>' }).join('') + '</ul>'
        bullets = []
      }
    }
    lines.forEach(function (line) {
      var t = line.trim()
      if (t === '---' || t === '—') { flush(); out += '<hr class="tg-hr" />' }
      else if (t.indexOf('> ') === 0) {
        flush()
        out += '<div class="tg-toolcall"><svg class="tg-toolcall-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z"/></svg><span>' + renderInline(t.slice(2)) + '</span></div>'
      }
      else if (t.indexOf('- ') === 0) bullets.push(t.slice(2))
      else if (t === '') flush()
      else { flush(); out += '<p class="tg-p">' + renderInline(line) + '</p>' }
    })
    flush()
    return out
  }

  window.__SL = { M: M, SEC: SEC, brand: brand, assistant: assistant, viewer: viewer, activeChannel: activeChannel, colorFor: colorFor, initials: initials, esc: esc, fillName: fillName, el: el, renderInline: renderInline, renderRich: renderRich }
})();
;(function () {
  var S = window.__SL
  var esc = S.esc, renderRich = S.renderRich, renderInline = S.renderInline
  var DEF_COLORS = ['#E8912D', '#5B6EF5', '#2EA6A0', '#B25FE6']

  function niceMax(m) {
    if (!isFinite(m) || m <= 0) return 10
    var pow = Math.pow(10, Math.floor(Math.log10(m)))
    var n = m / pow
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
    return step * pow
  }
  function barChart(chart) {
    var cats = chart.categories || []
    var series = (chart.series || []).map(function (s, i) { return { name: s.name, values: s.values || [], color: s.color || DEF_COLORS[i % DEF_COLORS.length] } })
    if (!cats.length || !series.length) return ''
    var W = 560, H = 300, padL = 44, padR = 12, padT = 12, padB = 46
    var plotW = W - padL - padR, plotH = H - padT - padB
    var all = [].concat.apply([], series.map(function (s) { return s.values }))
    var max = niceMax(Math.max.apply(null, all.concat([0])))
    var ticks = 5
    function y(v) { return padT + plotH - (v / max) * plotH }
    var groupW = plotW / cats.length, gap = 6, innerW = groupW * 0.62
    var barW = (innerW - gap * (series.length - 1)) / series.length
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="viz-chart-svg" role="img">'
    for (var i = 0; i <= ticks; i++) {
      var v = (max / ticks) * i, yy = y(v)
      svg += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + yy + '" y2="' + yy + '" class="viz-grid"/>'
      svg += '<text x="' + (padL - 8) + '" y="' + (yy + 3) + '" class="viz-axis-lbl" text-anchor="end">' + (Number.isInteger(v) ? v : v.toFixed(0)) + '</text>'
    }
    cats.forEach(function (cat, ci) {
      var gx = padL + ci * groupW + (groupW - innerW) / 2
      series.forEach(function (s, si) {
        var val = s.values[ci] || 0, bx = gx + si * (barW + gap), by = y(val), bh = padT + plotH - by
        svg += '<rect x="' + bx + '" y="' + by + '" width="' + Math.max(barW, 1) + '" height="' + Math.max(bh, 0) + '" rx="2" fill="' + s.color + '"/>'
      })
      svg += '<text x="' + (padL + ci * groupW + groupW / 2) + '" y="' + (H - padB + 16) + '" class="viz-axis-lbl" text-anchor="middle">' + esc(cat) + '</text>'
    })
    svg += '</svg>'
    var legend = '<div class="viz-legend">' + series.map(function (s) { return '<span class="viz-legend-item"><span class="viz-legend-swatch" style="background:' + s.color + '"></span>' + esc(s.name) + '</span>' }).join('') + '</div>'
    var cap = chart.caption ? '<div class="viz-chart-caption">' + esc(chart.caption) + '</div>' : ''
    return '<div class="viz-chart">' + svg + legend + cap + '</div>'
  }
  function dataTable(table) {
    var cols = table.columns || [], rows = table.rows || []
    if (!rows.length) return ''
    var h = cols.length ? '<thead><tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>' }).join('') + '</tr></thead>' : ''
    var b = '<tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + renderRich(String(c == null ? '' : c)) + '</td>' }).join('') + '</tr>' }).join('') + '</tbody>'
    return '<div class="viz-table-wrap"><table class="viz-table">' + h + b + '</table></div>'
  }
  function callout(step) {
    var variant = step.variant || 'success'
    var icon = variant === 'warning' ? '🔴' : '✅'
    var title = step.calloutTitle ? '<div class="viz-callout-title">' + esc(step.calloutTitle) + '</div>' : ''
    return '<div class="viz-callout is-' + variant + '"><span class="viz-callout-ico">' + icon + '</span><div class="viz-callout-body">' + title + '<div class="viz-callout-text">' + renderRich(step.text) + '</div></div></div>'
  }
  function vizHtml(step) {
    if (step.vizType === 'bar' && step.chart) return barChart(step.chart)
    if (step.vizType === 'table' && step.table) return dataTable(step.table)
    if (step.vizType === 'callout') return callout(step)
    return '<pre class="sl-viz-pre">' + esc(step.text) + '</pre>'
  }

  // engine (mirrors TeamsCopilotFrame)
  function buildSegments(script) {
    var segs = [], cur = null
    ;(script || []).forEach(function (step) {
      if (step.type === 'userPrompt') { if (cur) segs.push(cur); cur = { prompt: step, responses: [] } }
      else { if (!cur) cur = { prompt: null, responses: [] }; cur.responses.push(step) }
    })
    if (cur) segs.push(cur)
    return segs
  }
  var PACING = { low: 0.5, medium: 1, high: 1.7 }
  function thinkMs(step) {
    var base
    if (step.type === 'visualization') base = 6500
    else if (step.type === 'toolAction') base = 6000
    else base = Math.min(Math.max(step.delayMs || 3200, 3600), 5200)
    return Math.round(base * (PACING[step.pacing] || 1))
  }
  var PHRASES = {
    assistantResponse: ['Thinking…', 'Reasoning over your request…', 'Lining things up…', 'Working on it…'],
    toolAction: ['Connecting to Marketing Cloud…', 'Reaching into the MCP server…', 'Setting that up for you…', 'Wiring it up…', 'Almost there…'],
    chart: ['Pulling the numbers…', 'Crunching the data…', 'Building your chart…', 'Putting it together…'],
    visualization: ['Putting it together…', 'Mapping it out…', 'Building it now…', 'Almost there…']
  }
  var CHART_TYPES = { bar: 1, funnel: 1, scorecard: 1 }
  function phrasesFor(rs) {
    if (rs.some(function (s) { return s.type === 'toolAction' })) return PHRASES.toolAction
    if (rs.some(function (s) { return s.type === 'visualization' })) {
      var hasChart = rs.some(function (s) { return s.type === 'visualization' && CHART_TYPES[s.vizType] })
      return hasChart ? PHRASES.chart : PHRASES.visualization
    }
    return PHRASES.assistantResponse
  }

  S.vizHtml = vizHtml
  S.buildSegments = buildSegments
  S.thinkMs = thinkMs
  S.phrasesFor = phrasesFor
})()
;(function () {
  var S = window.__SL
  var esc = S.esc, colorFor = S.colorFor, initials = S.initials, renderInline = S.renderInline
  var M = S.M, brand = S.brand, viewer = S.viewer, activeChannel = S.activeChannel

  function avatarHtml(name, url, size) {
    var sz = size || 36
    if (url) return '<span class="sl-avatar" style="background:transparent"><img src="' + esc(url) + '" alt="' + esc(name) + '"/></span>'
    return '<span class="sl-avatar" style="background:' + colorFor(name) + ';width:' + sz + 'px;height:' + sz + 'px"><span class="sl-avatar-txt">' + esc(initials(name)) + '</span></span>'
  }
  function reactsHtml(rs) {
    if (!rs || !rs.length) return ''
    return '<div class="sl-reacts">' + rs.map(function (r) { return '<span class="sl-react"><span class="sl-react-e">' + esc(r.emoji) + '</span><span class="sl-react-c">' + esc(r.count) + '</span></span>' }).join('') + '</div>'
  }
  var BOT_ICON = window.SLACKBOT_ICON || ''
  var BOT_AV = BOT_ICON
    ? '<span class="sl-bot-avatar is-img"><img src="' + BOT_ICON + '" alt="Slackbot"/></span>'
    : '<span class="sl-bot-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01"/></svg></span>'

  // ── sidebar ──
  function sidebarHtml() {
    var items = (M.sidebar && M.sidebar.length) ? M.sidebar : []
    var order = [], groups = {}
    items.forEach(function (it) { var sec = it.section || 'Channels'; if (!groups[sec]) { groups[sec] = []; order.push(sec) } groups[sec].push(it) })
    var body = order.map(function (sec) {
      return '<div class="sl-sec">' + esc(sec) + '</div>' + groups[sec].map(function (it) {
        var isChan = it.type !== 'person', active = it.name === activeChannel
        var glyph = isChan ? '#' : '<span class="sl-presence-dot ' + (it.presence === "away" ? "is-away" : "is-active") + '"></span>'
        return '<div class="sl-chan ' + (active ? 'is-active' : '') + ' ' + (it.unread ? 'is-unread' : '') + '"><span class="sl-chan-glyph">' + glyph + '</span><span class="sl-chan-name">' + esc(it.name) + '</span></div>'
      }).join('')
    }).join('')
    var quick = ['Threads', 'Huddles', 'Drafts & sent'].map(function (q) { return '<div class="sl-quick-item">' + q + '</div>' }).join('')
    return '<aside class="sl-sidebar"><div class="sl-ws-head"><span class="sl-ws-name">' + esc(brand.name || 'Workspace') + '</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><div class="sl-nav-quick">' + quick + '</div>' + body + '</aside>'
  }
  function railHtml() {
    function ri(p) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>' }
    var ICONS = {
      home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
      dms: '<path d="M4 5h16v10H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
      activity: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
      sales: '<path d="M4 19h16"/><path d="M6 16l3-4 3 2 5-7"/><path d="M17 5h2v2"/>',
      files: '<rect x="7" y="4" width="10" height="12" rx="1.5"/><path d="M5 7v11a1 1 0 0 0 1 1h9"/>',
      more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
    }
    var DEFAULT_RAIL = [
      { key: 'home', label: 'Home', active: true, tile: true, dot: true },
      { key: 'dms', label: 'DMs', badge: '1' },
      { key: 'activity', label: 'Activity', badge: '61' },
      { key: 'sales', label: 'Sales' },
      { key: 'files', label: 'Files' },
      { key: 'more', label: 'More', badge: '3' }
    ]
    var rail = (M.rail && M.rail.length) ? M.rail : DEFAULT_RAIL
    function item(it) {
      var glyph = it.img ? '<img src="' + it.img + '" alt="" class="sl-rail-img"/>' : ri(ICONS[it.icon || it.key] || ICONS.home)
      return '<button type="button" class="sl-rail-item ' + (it.active ? 'is-active' : '') + '"><span class="sl-rail-ico ' + (it.tile ? 'is-tile' : '') + ' ' + (it.img ? 'is-img' : '') + '">' + glyph +
        (it.dot ? '<span class="sl-rail-dot"></span>' : '') + (it.badge ? '<span class="sl-rail-badge">' + esc(it.badge) + '</span>' : '') + '</span>' +
        (it.label ? '<span class="sl-rail-label">' + esc(it.label) + '</span>' : '') + '</button>'
    }
    var wsIcon = (brand.workspaceIcon || '').trim() || (brand.logoUrl || '').trim() || window.SALESFORCE_LOGO || ''
    var ws = wsIcon ? '<img src="' + wsIcon + '" alt=""/>' : esc((brand.name || 'W').charAt(0).toUpperCase())
    var me = M.viewerAvatarUrl
      ? '<img src="' + M.viewerAvatarUrl + '" alt=""/>'
      : '<span class="sl-rail-me-txt" style="background:' + colorFor(viewer) + '">' + esc(initials(viewer)) + '</span>'
    return '<nav class="sl-rail"><div class="sl-rail-ws">' + ws + '</div>' +
      item({ key: 'slackbot', label: 'Slackbot', img: BOT_ICON }) +
      rail.map(item).join('') +
      '<div class="sl-rail-spacer"></div>' +
      '<button type="button" class="sl-rail-round"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>' +
      '<button type="button" class="sl-rail-round"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>' +
      '<span class="sl-rail-me">' + me + '<span class="sl-rail-presence"></span></span></nav>'
  }
  // ── channel ──
  function channelHtml() {
    var rows = M.groupChat || []
    var thread = rows.map(function (step, idx) {
      var prev = rows[idx - 1], grouped = prev && prev.author === step.author, time = step.time || '10:36 AM'
      var av = (step.author === viewer || !step.author) ? (M.viewerAvatarUrl || null) : null
      var gutter = grouped ? '<span class="sl-msg-time-hover">' + esc(time) + '</span>' : avatarHtml(step.author || viewer, av, 36)
      var head = grouped ? '' : '<div class="sl-msg-head"><span class="sl-msg-author">' + esc(step.author || viewer) + '</span><span class="sl-msg-time">' + esc(time) + '</span></div>'
      return '<div class="sl-msg ' + (grouped ? 'is-grouped' : '') + '"><div class="sl-msg-gutter">' + gutter + '</div><div class="sl-msg-body">' + head + '<div class="sl-msg-text">' + renderInline(step.text) + '</div>' + reactsHtml(step.reactions) + '</div></div>'
    }).join('')
    var composer = '<div class="sl-ch-composer"><div class="sl-ch-format"></div><div class="sl-ch-inputrow"><span class="sl-ch-placeholder">Message #' + esc(activeChannel) + '</span><button type="button" class="sl-ch-send"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z"/></svg></button></div></div>'
    var header = '<div class="sl-ch-head"><div class="sl-ch-title"># ' + esc(activeChannel) + '</div><div class="sl-ch-members"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/></svg>283</div></div>'
    return '<main class="sl-main">' + header + '<div class="sl-ch-thread"><div class="sl-day-divider"><span>Today</span></div>' + thread + '</div>' + composer + '</main>'
  }

  S.avatarHtml = avatarHtml
  S.reactsHtml = reactsHtml
  S.BOT_AV = BOT_AV
  S.sidebarHtml = sidebarHtml
  S.railHtml = railHtml
  S.channelHtml = channelHtml
})()
;(function () {
  var S = window.__SL
  var esc = S.esc, renderInline = S.renderInline, renderRich = S.renderRich, fillName = S.fillName
  var assistant = S.assistant, viewer = S.viewer, BOT_AV = S.BOT_AV, avatarHtml = S.avatarHtml
  var activeChannel = S.activeChannel

  var ACTIONS = '<div class="sl-bot-actions"><button type="button" title="Copy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button></div>'

  function botStepHtml(step) {
    if (step.type === 'userPrompt') {
      return '<div class="sl-bot-row is-user">' + avatarHtml(step.author || 'You', null, 28) + '<div class="sl-bot-col"><div class="sl-bot-head"><span class="sl-bot-name">' + esc(step.author || 'You') + '</span><span class="sl-bot-time">Just now</span></div><div class="sl-bot-usertext">' + renderInline(fillName(step.text)) + '</div></div></div>'
    }
    var head = '<div class="sl-bot-head"><span class="sl-bot-name">Slackbot</span><span class="sl-bot-app">APP</span><span class="sl-bot-time">Just now</span></div>'
    var body
    if (step.type === 'toolAction') body = '<p class="tg-p"><strong>' + esc(fillName(step.title || 'Done')) + '</strong></p><p class="tg-p">' + renderInline(fillName(step.text)) + '</p>'
    else if (step.type === 'visualization') body = (step.title ? '<div class="sl-viz-title">' + renderInline(fillName(step.title)) + '</div>' : '') + S.vizHtml(step)
    else body = renderRich(fillName(step.text))
    return '<div class="sl-bot-row">' + BOT_AV + '<div class="sl-bot-col">' + head + '<div class="sl-bot-text">' + body + '</div>' + ACTIONS + '</div></div>'
  }
  function thinkingHtml(phrase) {
    return '<div class="sl-bot-row" id="sl-thinking">' + BOT_AV + '<div class="sl-bot-col"><div class="sl-bot-thinking"><span id="sl-think-text">' + esc(phrase) + '</span></div></div></div>'
  }
  function welcomeHtml() {
    var chips = ['Catch me up', 'Anything for me?', "What's the vibe?"]
    var eye = '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z"/><circle cx="10" cy="10" r="2.25"/></svg>'
    var x = '<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>'
    return '<div class="sl-bot-welcome"><div class="sl-bot-welcome-mark">' + BOT_AV + '</div><div class="sl-bot-reading">' + eye + '<span>Reading along in #' + esc(activeChannel) + '</span><button type="button" class="sl-reading-x">' + x + '</button></div><div class="sl-bot-suggest">' + chips.map(function (c) { return '<button type="button" class="sl-bot-chip">' + esc(c) + '</button>' }).join('') + '</div></div>'
  }
  function botPaneHtml() {
    var ha = '<button type="button" title="History"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.25"/><path d="M10 6v4l2.5 2"/></svg></button>' +
      '<button type="button" title="New"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 3.5l3 3L7 16l-3.5 1 1-3.5z"/><path d="M12 5l3 3"/></svg></button>' +
      '<button type="button" id="sl-mcp-btn" title="More"><svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg></button>' +
      '<button type="button" title="Close"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg></button>'
    var header = '<div class="sl-bot-header"><div class="sl-bot-header-title">' + BOT_AV + '<span>' + esc(assistant.name || 'Slackbot') + '</span></div><div class="sl-bot-header-actions">' + ha + '</div></div>'
    function fmt(t, inner) { return '<button type="button" class="sl-fmt" title="' + t + '">' + inner + '</button>' }
    var toolbar = fmt('Bold', '<b>B</b>') + fmt('Italic', '<i>I</i>') + fmt('Underline', '<u>U</u>') + fmt('Strikethrough', '<s>S</s>') + '<span class="sl-fmt-sep"></span>' +
      fmt('Link', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-1 1"/><path d="M11.5 8.5a3 3 0 0 0-4.2 0L5 10.8a3 3 0 0 0 4.2 4.2l1-1"/></svg>') +
      fmt('Ordered list', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 6h9M8 10h9M8 14h9M3 5v3M3 8h1M2.5 12.5h1.5L2.5 14.5H4"/></svg>') +
      fmt('Bulleted list', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 6h10M7 10h10M7 14h10"/><circle cx="3.5" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="14" r="1.1" fill="currentColor" stroke="none"/></svg>') +
      '<span class="sl-fmt-sep"></span>' +
      fmt('Blockquote', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 5v10M9 7h8M9 10h8M9 13h5"/></svg>') +
      fmt('Code', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4"/></svg>') +
      fmt('Code block', '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="M8 8l-2 2 2 2M12 8l2 2-2 2"/></svg>')
    var footLeft = '<button type="button" class="sl-foot-btn sl-foot-plus" title="Add"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 4v12M4 10h12"/></svg></button>' +
      '<button type="button" class="sl-foot-btn" title="Formatting"><span class="sl-foot-aa">Aa</span></button>' +
      '<button type="button" class="sl-foot-btn" title="Canvas"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="12" height="14" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h4"/></svg></button>' +
      '<button type="button" class="sl-foot-btn is-active" title="Integrations"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3M12 3v3M6 6h8v3a4 4 0 0 1-8 0zM10 13v4"/></svg></button>'
    var footRight = '<button type="button" class="sl-foot-btn" title="Record"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="7.5" y="2.5" width="5" height="9" rx="2.5"/><path d="M5 9a5 5 0 0 0 10 0M10 14v3"/></svg></button>' +
      '<button type="button" id="sl-send" class="sl-bot-send" title="Send"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16V4M5 9l5-5 5 5"/></svg></button>'
    var composer = '<div class="sl-bot-composer"><div class="sl-bot-inputbox"><div class="sl-bot-format">' + toolbar + '</div><textarea id="sl-input" class="sl-bot-input" rows="1" placeholder="Ask about #' + esc(activeChannel) + ' — or anything"></textarea><div class="sl-bot-inputfoot"><div class="sl-foot-left">' + footLeft + '</div><div class="sl-foot-right">' + footRight + '</div></div></div><div class="sl-bot-disclaimer">' + esc(assistant.name || 'Slackbot') + ' is AI and can make mistakes.</div></div>'
    return '<section class="sl-botpane">' + header + '<div class="sl-bot-thread" id="sl-thread">' + welcomeHtml() + '</div>' + composer + '</section>'
  }

  // ── MCP modal ──
  function modalHtml() {
    function group(label, mode, tools, open) {
      var rows = tools.map(function (t) {
        function seg(k, l) { return '<button type="button" class="sl-perm-seg is-' + k + ' ' + (t.permission === k ? 'is-on' : '') + '">' + l + '</button>' }
        return '<div class="sl-perm-tool"><span class="sl-perm-toolname">' + esc(t.name) + '</span><div class="sl-perm-toggle">' + seg('allow', 'Allow') + seg('ask', 'Ask') + seg('deny', 'Deny') + '</div></div>'
      }).join('')
      return '<div class="sl-perm-group"><div class="sl-perm-grouphead"><button type="button" class="sl-perm-grouptoggle"><span class="sl-perm-caret ' + (open ? 'is-open' : '') + '"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg></span>' + label + ' <span class="sl-perm-count">(' + tools.length + ')</span></button><span class="sl-perm-mode">' + esc(mode) + '</span></div>' + (open ? '<div class="sl-perm-tools">' + rows + '</div>' : '') + '</div>'
    }
    return '<div class="sl-modal-overlay" id="sl-modal" style="display:none"><div class="sl-modal"><div class="sl-modal-head"><div class="sl-modal-title">Manage MCP Server for MCE</div><button type="button" id="sl-modal-close" class="sl-modal-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="sl-modal-body"><div class="sl-modal-sub"><strong>Tool permissions</strong><span>Choose when ' + esc(assistant.name || 'Slackbot') + ' is allowed to use these tools.</span></div>' + group('Read-only tools', S.SEC.readOnlyMode || 'Always allow', S.SEC.readOnly || [], true) + group('Write tools', S.SEC.writeMode || 'Custom', S.SEC.write || [], false) + '</div><div class="sl-modal-foot"><button type="button" class="sl-modal-btn sl-modal-dismiss">Cancel</button><button type="button" class="sl-modal-btn is-primary sl-modal-dismiss">Save</button></div></div></div>'
  }

  S.botStepHtml = botStepHtml
  S.thinkingHtml = thinkingHtml
  S.welcomeHtml = welcomeHtml
  S.botPaneHtml = botPaneHtml
  S.modalHtml = modalHtml
})()
;(function () {
  var S = window.__SL
  var M = S.M, fillName = S.fillName
  function mount() {
    var app = document.getElementById('app')
    if (!app) return
    var brandName = (S.M.brand && S.M.brand.name) || 'Slack'
    function shade(hex, pct) {
      var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return hex
      var n = parseInt(m[1], 16)
      var r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - pct)))
      var g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - pct)))
      var b = Math.max(0, Math.round((n & 255) * (1 - pct)))
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
    var theme = (S.M.brand && S.M.brand.themeColor) || '#3f0e40'
    function isLight(hex) { var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return false; var n = parseInt(m[1], 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 150 }
    var L = isLight(theme)
    var badge = (S.M.brand && S.M.brand.accentColor) || '#e01e5a'
    var badgeFg = isLight(badge) ? '#111' : '#fff'
    var fg = (L
      ? '--sl-fg:rgba(0,0,0,0.82);--sl-fg-muted:rgba(0,0,0,0.58);--sl-fg-faint:rgba(0,0,0,0.45);--sl-fg-strong:#111;--sl-fg-soft:rgba(0,0,0,0.10)'
      : '--sl-fg:rgba(255,255,255,0.82);--sl-fg-muted:rgba(255,255,255,0.60);--sl-fg-faint:rgba(255,255,255,0.48);--sl-fg-strong:#fff;--sl-fg-soft:rgba(255,255,255,0.12)')
      + ';--sl-badge:' + badge + ';--sl-badge-fg:' + badgeFg
    var themeStyle = '--sl-aubergine:' + theme + ';--sl-aubergine-dark:' + shade(theme, 0.12) + ';' + fg
    var topbar = '<div class="sl-topbar"><div class="sl-topbar-nav">' +
      '<button type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<button type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<button type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></button>' +
      '</div><div class="sl-topbar-search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><span>Search ' + S.esc(brandName) + '</span></div>' +
      '<div class="sl-topbar-right"><button type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.3c-.6.3-.9.7-.9 1.5"/></svg></button></div></div>'
    app.innerHTML = '<div class="sl-window" style="' + themeStyle + '">' + topbar + '<div class="sl-body">' + S.railHtml() + S.sidebarHtml() + S.channelHtml() + S.botPaneHtml() + '</div></div>' + S.modalHtml()

    var segments = S.buildSegments(M.script)
    var segIndex = 0, busy = false
    var thread = document.getElementById('sl-thread')
    var input = document.getElementById('sl-input')
    var started = false

    function scroll() { thread.scrollTop = thread.scrollHeight }
    function delay(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

    function fillNext() {
      if (busy || segIndex === 0 || input.value.trim()) return
      var seg = segments[segIndex]
      if (seg && seg.prompt) { input.value = seg.prompt.text; input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px' }
    }
    function append(html) { var d = document.createElement('div'); d.innerHTML = html; while (d.firstChild) thread.appendChild(d.firstChild); scroll() }

    function send() {
      if (busy) return
      var idx = segIndex, seg = segments[idx]
      var text = (input.value.trim()) || (seg && seg.prompt ? seg.prompt.text : '')
      if (!text) return
      busy = true
      if (!started) { started = true; thread.innerHTML = '' }
      input.value = ''; input.style.height = 'auto'
      append(S.botStepHtml({ type: 'userPrompt', author: S.viewer, text: fillName(text), id: 'u' }))
      segIndex = idx + 1
      var responses = seg ? seg.responses : []
      var run = Promise.resolve()
      if (responses.length) {
        var total = Math.min(responses.reduce(function (s, x) { return s + S.thinkMs(x) }, 0), 12000)
        var phrases = S.phrasesFor(responses)
        append(S.thinkingHtml(phrases[0]))
        var ti = 0
        var timer = setInterval(function () { ti++; var t = document.getElementById('sl-think-text'); if (t) t.textContent = phrases[ti % phrases.length] }, 1300)
        run = delay(total).then(function () {
          clearInterval(timer)
          var th = document.getElementById('sl-thinking'); if (th) th.remove()
          return responses.reduce(function (p, r, i) { return p.then(function () { append(S.botStepHtml(r)); if (i < responses.length - 1) return delay(600) }) }, Promise.resolve())
        })
      } else if (!seg) {
        append(S.thinkingHtml('Thinking…'))
        run = delay(900).then(function () { var th = document.getElementById('sl-thinking'); if (th) th.remove(); append(S.botStepHtml({ type: 'assistantResponse', text: "That's the end of this demo flow — refresh to start over." })) })
      }
      run.then(function () { busy = false; input.focus() })
    }

    input.addEventListener('click', fillNext)
    input.addEventListener('input', function () { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px' })
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } })
    document.getElementById('sl-send').addEventListener('click', send)

    var modal = document.getElementById('sl-modal')
    document.getElementById('sl-mcp-btn').addEventListener('click', function () { modal.style.display = 'flex' })
    document.getElementById('sl-modal-close').addEventListener('click', function () { modal.style.display = 'none' })
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) modal.style.display = 'none' })
    Array.prototype.forEach.call(document.querySelectorAll('.sl-modal-dismiss'), function (b) { b.addEventListener('click', function () { modal.style.display = 'none' }) })
    input.focus()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
