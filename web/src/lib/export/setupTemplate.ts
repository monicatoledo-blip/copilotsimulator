import { COPILOT_ICON } from '../../components/simulators/copilotIconData'
import { CUMULUS_LOGO } from '../../components/simulators/cumulusLogoData'
import { SALESFORCE_LOGO } from '../../components/simulators/salesforceLogoData'
import { SETUP_TITLE, SETUP_SUBTITLE, SETUP_STEPS } from '../../components/simulators/setupStepsData'

const SETUP_DATA = JSON.stringify({
  title: SETUP_TITLE,
  subtitle: SETUP_SUBTITLE,
  steps: SETUP_STEPS,
})

export function buildSetupTemplate(serializedManifest: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Setup Walkthrough</title>
  <style>
    :root { --cs-bg:#faf9f8; --cs-rail:#f3f2f1; --cs-stroke:#e1dfdd; --cs-fg-1:#242424; --cs-fg-2:#484644; --cs-fg-3:#797775; --cs-accent:#5b5fc7; --cs-green:#107c41; }
    * { box-sizing:border-box; }
    html,body { height:100%; margin:0; }
    body { font-family:"Segoe UI","Segoe UI Web (West European)",-apple-system,BlinkMacSystemFont,system-ui,sans-serif; background:#f3f3f3; color:var(--cs-fg-1); }
    .su-window { position:relative; width:100%; height:100vh; display:flex; flex-direction:column; background:#fff; overflow:hidden; }
    /* top bar */
    .su-top { height:48px; flex-shrink:0; display:flex; align-items:center; gap:12px; padding:0 16px; background:var(--cs-rail); border-bottom:1px solid var(--cs-stroke); }
    .su-waffle { color:var(--cs-fg-2); display:flex; }
    .su-brand { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:600; }
    .su-brand img { width:22px; height:22px; object-fit:contain; }
    .su-top-right { margin-left:auto; display:flex; align-items:center; gap:16px; color:var(--cs-fg-2); }
    .su-env { display:flex; align-items:center; gap:8px; font-size:12px; }
    .su-env-label { line-height:1.25; }
    .su-env-label b { display:block; font-size:11px; color:var(--cs-fg-3); font-weight:400; }
    .su-top-ico { color:var(--cs-fg-2); display:flex; cursor:default; }
    .su-avatar { width:30px; height:30px; border-radius:50%; background:#e7e7ea; border:1px solid var(--cs-stroke); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:var(--cs-fg-2); overflow:hidden; }
    .su-body { flex:1; display:flex; min-height:0; }
    /* left rail */
    .su-rail { width:64px; flex-shrink:0; background:var(--cs-rail); border-right:1px solid var(--cs-stroke); display:flex; flex-direction:column; align-items:center; padding:8px 0; gap:4px; }
    .su-rail-item { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 4px; color:var(--cs-fg-2); font-size:10px; width:56px; border-radius:6px; }
    .su-rail-item.is-active { color:var(--cs-accent); background:#ececf8; font-weight:600; }
    /* content */
    .su-content { flex:1; min-width:0; display:flex; flex-direction:column; background:#fff; }
    .su-screen { flex:1; overflow:auto; padding:22px 28px; }
    .su-page-head { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
    .su-page-title { font-size:20px; font-weight:700; }
    .su-shield-badge { display:inline-flex; align-items:center; gap:5px; color:var(--cs-green); font-size:13px; font-weight:600; }
    /* agent header: title + tab bar + publish/settings/test */
    .su-agent-bar { display:flex; align-items:center; gap:18px; padding:10px 24px 0; border-bottom:1px solid var(--cs-stroke); }
    .su-agent-title { display:flex; align-items:center; gap:8px; font-size:18px; font-weight:700; flex-shrink:0; }
    .su-agent-title .su-agent-ico { width:30px; height:30px; }
    .su-agent-shield { color:var(--cs-green); display:flex; }
    .su-tabs { display:flex; gap:16px; align-items:center; }
    .su-tab { font-size:13.5px; color:var(--cs-fg-2); padding:10px 2px; position:relative; white-space:nowrap; }
    .su-tab.is-active { color:var(--cs-fg-1); font-weight:600; }
    .su-tab.is-active::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--cs-accent); }
    .su-agent-bar-right { margin-left:auto; display:flex; align-items:center; gap:10px; }
    .su-published-meta { font-size:11px; color:var(--cs-fg-3); line-height:1.2; text-align:right; }
    .su-test-btn { display:flex; flex-direction:column; align-items:center; gap:1px; color:var(--cs-fg-2); padding:2px 6px 2px 16px; margin-left:6px; border-left:1px solid var(--cs-stroke); font-size:11px; }
    /* toolbar row above tables */
    .su-toolbar { display:flex; align-items:center; gap:10px; margin:16px 0 14px; }
    .su-search-box { margin-left:auto; width:230px; height:32px; border:1px solid var(--cs-stroke); border-radius:6px; display:flex; align-items:center; gap:8px; padding:0 10px; color:var(--cs-fg-3); font-size:13px; }
    .su-filter-pill { display:inline-flex; align-items:center; gap:6px; font-size:13px; padding:5px 12px; border-radius:16px; border:1px solid var(--cs-stroke); color:var(--cs-fg-2); }
    .su-filter-pill.is-active { background:#eaf3fb; border-color:#b6d8f2; color:#0f548c; }
    .su-refresh { margin-left:auto; display:flex; align-items:center; gap:6px; font-size:12px; color:var(--cs-fg-3); }
    /* channels */
    .su-banner { display:flex; gap:8px; align-items:flex-start; background:#f3f6fb; border:1px solid #dde6f3; border-radius:6px; padding:10px 14px; font-size:13px; color:var(--cs-fg-2); margin-bottom:16px; }
    .su-banner b { color:var(--cs-fg-1); }
    .su-status-card { border:1px solid var(--cs-stroke); border-radius:8px; padding:16px 18px; margin-bottom:22px; max-width:780px; }
    .su-status-card .lbl { font-size:13px; font-weight:600; margin-bottom:8px; }
    .su-status-card .val { display:flex; align-items:center; gap:8px; font-size:14px; color:var(--cs-fg-1); }
    .su-sec-label { font-size:13px; font-weight:600; color:var(--cs-fg-2); margin:0 0 10px; }
    /* agents-screen prompt box + header buttons */
    .su-page-actions { margin-left:auto; display:flex; gap:8px; }
    .su-prompt-box { border:1px solid var(--cs-stroke); border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,.06); padding:18px 20px; margin:0 0 26px; display:flex; flex-direction:column; gap:14px; max-width:980px; }
    .su-prompt-box .ph { color:var(--cs-fg-3); font-size:15px; }
    .su-prompt-box .gear { color:var(--cs-fg-3); display:flex; }
    .su-btn { border:1px solid var(--cs-stroke); background:#fff; font-family:inherit; font-size:13px; font-weight:600; color:var(--cs-fg-1); padding:7px 14px; border-radius:6px; cursor:pointer; }
    .su-btn.is-primary { background:var(--cs-accent); border-color:var(--cs-accent); color:#fff; }
    .su-row-actions { display:flex; gap:8px; }
    /* table */
    .su-table { width:100%; border-collapse:collapse; font-size:13px; }
    .su-table th { text-align:left; color:var(--cs-fg-3); font-weight:600; padding:10px 12px; border-bottom:1px solid var(--cs-stroke); }
    .su-table td { padding:12px; border-bottom:1px solid #f0eeec; }
    .su-agent-name { display:flex; align-items:center; gap:10px; font-weight:600; }
    .su-agent-ico { width:26px; height:26px; border-radius:6px; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .su-agent-ico img { width:22px; height:22px; object-fit:contain; }
    .su-row.is-highlight { background:#f6f6fe; outline:2px solid var(--cs-accent); outline-offset:-2px; border-radius:6px; }
    .su-pill { display:inline-flex; align-items:center; gap:6px; font-size:12px; padding:3px 10px; border-radius:14px; background:#f0f0f4; color:var(--cs-fg-2); }
    .su-pill.is-mcp { background:#eef4ff; color:#0f548c; }
    .su-toggle { width:34px; height:18px; border-radius:10px; background:var(--cs-accent); position:relative; display:inline-block; }
    .su-toggle::after { content:""; position:absolute; top:2px; right:2px; width:14px; height:14px; border-radius:50%; background:#fff; }
    /* add-tool modal */
    .su-overlay { position:absolute; inset:0; background:rgba(0,0,0,.28); display:flex; align-items:center; justify-content:center; padding:24px; }
    .su-modal { width:100%; max-width:1040px; background:#fff; border-radius:10px; box-shadow:0 8px 32px rgba(0,0,0,.24); overflow:hidden; }
    .su-modal-head { display:flex; justify-content:space-between; align-items:flex-start; padding:20px 24px 10px; }
    .su-modal-title { font-size:20px; font-weight:700; }
    .su-modal-sub { font-size:13px; color:var(--cs-fg-3); margin-top:2px; }
    .su-modal-close { color:var(--cs-fg-2); display:flex; }
    .su-search { margin:0 24px 18px; height:44px; border:1px solid var(--cs-stroke); border-radius:8px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; color:var(--cs-fg-3); font-size:14px; background:linear-gradient(#fff,#fff) padding-box, linear-gradient(90deg,#2aa5f4,#b14be0,#e5447c) border-box; border:1px solid transparent; }
    .su-create-row { display:flex; justify-content:space-between; align-items:center; padding:0 24px 10px; }
    .su-create-row .lbl { font-size:14px; font-weight:600; }
    .su-create-row .more { color:#0f6cbd; font-size:13px; }
    .su-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; padding:0 24px 16px; }
    .su-card { border:1px solid var(--cs-stroke); border-radius:8px; padding:14px; }
    .su-card.is-highlight { border-color:var(--cs-accent); box-shadow:0 0 0 1px var(--cs-accent) inset; }
    .su-card-title { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; margin-bottom:6px; }
    .su-card-ico { width:22px; height:22px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
    .su-card-text { font-size:12px; color:var(--cs-fg-3); line-height:1.45; }
    .su-modal-filters { display:flex; gap:8px; padding:4px 24px 16px; flex-wrap:wrap; }
    .su-modal-foot { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-top:1px solid var(--cs-stroke); font-size:12px; color:var(--cs-fg-3); }
    /* channels grid */
    .su-chan-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-width:780px; }
    .su-chan { border:1px solid var(--cs-stroke); border-radius:8px; padding:16px; display:flex; align-items:center; gap:12px; font-size:14px; font-weight:600; }
    .su-chan.is-highlight { border-color:var(--cs-green); background:#f3f9f5; }
    .su-chan-ico { width:34px; height:34px; border-radius:8px; background:#eef4ff; display:flex; align-items:center; justify-content:center; color:var(--cs-accent); flex-shrink:0; }
    .su-published { display:inline-flex; align-items:center; gap:8px; color:var(--cs-green); font-size:14px; font-weight:600; margin-bottom:16px; }
    /* advance by clicking the real UI element — subtle glimmer hints where.
       Feels like a live product, not a slideshow. */
    .su-hot { position:relative; cursor:pointer; }
    .su-hot::after {
      content:""; position:absolute; inset:-4px; border-radius:10px; pointer-events:none;
      box-shadow:0 0 0 2px rgba(91,95,199,.55), 0 0 14px 2px rgba(91,95,199,.35);
      animation:su-glow 1.6s ease-in-out infinite;
    }
    @keyframes su-glow { 0%,100%{ opacity:.35; } 50%{ opacity:1; } }
    /* glimmer sweep for input-style hotspots (search/textbox) */
    .su-hot.su-hot-field::before {
      content:""; position:absolute; inset:0; border-radius:8px; pointer-events:none; z-index:1;
      background:linear-gradient(100deg, transparent 30%, rgba(91,95,199,.18) 50%, transparent 70%);
      background-size:220% 100%; animation:su-sweep 1.8s ease-in-out infinite;
    }
    @keyframes su-sweep { 0%{ background-position:120% 0; } 100%{ background-position:-120% 0; } }
    .su-typed-caret { display:inline-block; width:1px; height:1em; background:var(--cs-fg-1); margin-left:1px; vertical-align:-2px; animation:su-blink 1s step-end infinite; }
    @keyframes su-blink { 50%{ opacity:0; } }
    /* subtle fallback pager, bottom-right — secondary to the in-UI glimmer */
    .su-pager { position:absolute; right:18px; bottom:16px; z-index:50; display:flex; gap:8px; opacity:.55; transition:opacity .15s; }
    .su-pager:hover { opacity:1; }
    .su-pager button { width:34px; height:34px; border-radius:50%; border:1px solid var(--cs-stroke); background:#fff; color:var(--cs-fg-2); display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,.1); }
    .su-pager button:hover { background:#f5f5f5; color:var(--cs-fg-1); }
    .su-pager button:disabled { opacity:.35; cursor:default; box-shadow:none; }
  </style>
</head>
<body>
  <div class="su-window" id="su-window"></div>
  <script>
    var SETUP = ${SETUP_DATA};
    var MANIFEST = ${serializedManifest};
    var ICON = '${COPILOT_ICON}';
    var LOGO = '${CUMULUS_LOGO}';
    var SF_LOGO = '${SALESFORCE_LOGO}';
    function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    var brand = MANIFEST.brand || {};
    var assistant = MANIFEST.assistant || {};
    var agentName = assistant.name || (brand.name ? brand.name + ' Agent' : 'Marketing Agent');
    var idx = 0;
    var win = document.getElementById('su-window');
    document.title = agentName + ' — Setup';

    var WAFFLE='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/></svg>';
    var SHIELD='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>';
    var CHECK='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

    function railIco(p){ return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
    function chrome(activeRail, inner){
      var rails=[
        {k:'home',label:'Home',ico:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'},
        {k:'agents',label:'Agents',ico:'<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/>'},
        {k:'flows',label:'Flows',ico:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8 6h6a4 4 0 0 1 4 4v6"/>'},
        {k:'tools',label:'Tools',ico:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'}
      ];
      var railHtml=rails.map(function(r){ return '<div class="su-rail-item'+(r.k===activeRail?' is-active':'')+'">'+railIco(r.ico)+'<span>'+r.label+'</span></div>'; }).join('')
        +'<div class="su-rail-item">'+railIco('<circle cx="12" cy="12" r="1.4"/><circle cx="6" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>')+'</div>';
      var envName=(brand.name||'JEK Dev Co');
      return '<div class="su-top"><span class="su-waffle">'+WAFFLE+'</span>'
        +'<span class="su-brand"><img src="'+ICON+'" alt="">Copilot Studio</span>'
        +'<span class="su-top-right">'
          +'<span class="su-env">'+railIco('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>')
            +'<span class="su-env-label"><b>Environment</b>'+esc(envName)+' (default)</span></span>'
          +'<span class="su-top-ico">'+railIco('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 8.6 19a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4 8.6a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8.6A1.7 1.7 0 0 0 10 2.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z')+'</span>'
          +'<span class="su-top-ico" style="font-size:14px;font-weight:600">?</span>'
          +'<span class="su-avatar">JK</span>'
        +'</span></div>'
        +'<div class="su-body"><nav class="su-rail">'+railHtml+'</nav><div class="su-content">'+inner+'</div></div>';
    }
    function agentIco(bg){ return '<span class="su-agent-ico" style="background:'+(bg||'transparent')+'"><img src="'+ICON+'" alt=""></span>'; }
    // MCP tool rows show the Salesforce connector icon in real Copilot Studio.
    function sfIco(){ return '<span class="su-agent-ico" style="background:transparent"><img src="'+SF_LOGO+'" alt="Salesforce"></span>'; }
    function searchIco(){ return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'; }
    // Thin line-art lab flask for the "Test" button (matches Copilot Studio):
    // a flat top bar, narrow neck, flaring to a flat-bottom Erlenmeyer body.
    function flaskIco(){ return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
      +'<path d="M8.5 4h7"/>'
      +'<path d="M10 4v5.5L5.6 18a1.6 1.6 0 0 0 1.4 2.4h10a1.6 1.6 0 0 0 1.4-2.4L14 9.5V4"/></svg>'; }

    // Full agent header: icon + name + Protected shield, tab bar, then
    // Published date / Publish / Settings / Test on the right (matches Studio).
    function agentBar(active){
      var tabs=['Overview','Knowledge','Tools','Agents','Topics','Activity','Channels'];
      var tabHtml=tabs.map(function(t){ return '<span class="su-tab'+(t===active?' is-active':'')+'">'+t+'</span>'; }).join('');
      return '<div class="su-agent-bar">'
        +'<span class="su-agent-title">'+agentIco('#eef4ff')+esc(agentName)+'<span class="su-agent-shield">'+SHIELD+'</span></span>'
        +'<div class="su-tabs">'+tabHtml+'</div>'
        +'<div class="su-agent-bar-right">'
          +'<span class="su-published-meta">Published<br>5/20/2026</span>'
          +'<button class="su-btn">Publish</button><button class="su-btn">Settings</button>'
          +'<span class="su-test-btn">'+flaskIco()+'Test</span>'
        +'</div></div>';
    }

    function gearIco(sz){ return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4z"/></svg>'; }
    function screenAgents(){
      var others=[
        {n:'Snowflake Integration Assistant', type:'Agent', pub:'Never', prot:false},
        {n:'SFDC - MCPs', type:'Agent', pub:'1 month ago', prot:true}
      ];
      function row(a, hl){
        return '<tr'+(hl?' class="su-row is-highlight" id="su-hotspot"':'')+'><td><span class="su-agent-name">'+agentIco(hl?'#e7f0ff':null)+esc(a.n)+'</span></td>'
          +'<td>'+esc(a.type)+'</td><td># Microsoft Copilot Studi…</td><td>'+esc(a.pub)+'</td><td>Jake Koeneman</td>'
          +'<td>'+(a.prot?'<span class="su-shield-badge">'+SHIELD+'Protected</span>':'<span style="color:var(--cs-fg-3)">--</span>')+'</td></tr>';
      }
      var rows=others.map(function(a){ return row(a,false); }).join('')
        + row({n:agentName, type:'Agent', pub:'1 month ago', prot:true}, true)
        + row({n:'Microsoft 365 Copilot', type:'Microsoft', pub:'Never', prot:false}, false);
      return '<div class="su-screen">'
        +'<div class="su-page-head"><span class="su-page-title">Agents</span>'
          +'<span class="su-page-actions"><button class="su-btn">+ Create blank agent</button><button class="su-btn">Import agent ↗</button></span></div>'
        +'<div class="su-prompt-box"><span class="ph">Start building by describing what your agent needs to do</span><span class="gear">'+gearIco(18)+'</span></div>'
        +'<div style="display:flex; align-items:center; margin-bottom:12px"><span style="font-size:15px; font-weight:600">My agents</span>'
          +'<span class="su-search-box" style="margin-left:auto">'+searchIco()+'Search agents</span></div>'
        +'<table class="su-table"><thead><tr><th>Name</th><th>Type</th><th>Last modified</th><th>Last published</th><th>Owner</th><th>Protection status</th></tr></thead>'
        +'<tbody>'+rows+'</tbody></table></div>';
    }

    function mcpIco(){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12l8-8 8 8-8 8z"/><path d="M8 12l4-4 4 4-4 4z"/></svg>'; }
    function screenToolsBg(hotspot){
      var tools=['Get journeys','Get list subscribers','Run automation','Send transactional email','Create journey','Search attributes'];
      var rows=tools.map(function(t){
        return '<tr><td><span class="su-agent-name" style="font-weight:500">'+sfIco()+esc(t)+'</span></td>'
          +'<td><span class="su-pill is-mcp">'+mcpIco()+' Model …</span></td>'
          +'<td><span class="su-pill">'+esc(agentName.slice(0,10))+'…</span></td>'
          +'<td><span class="su-pill">By agent</span></td><td>Jake Koeneman 1 mon…</td><td></td><td></td>'
          +'<td><span style="display:flex;align-items:center;gap:8px"><span class="su-toggle"></span>On</span></td></tr>';
      }).join('');
      return '<div class="su-screen" style="padding:0">'+agentBar('Tools')
        +'<div style="padding:0 24px 24px">'
        +'<div class="su-toolbar"><button class="su-btn is-primary"'+(hotspot?' id="su-hotspot"':'')+'>+ Add a tool</button>'
          +'<span class="su-search-box">'+searchIco()+'Search tools</span></div>'
        +'<div style="display:flex; align-items:center; gap:10px; margin-bottom:14px">'
          +'<span class="su-filter-pill is-active">All</span>'
          +'<span class="su-filter-pill">'+mcpIco()+' Model Context Protocol (6)</span>'
          +'<span class="su-refresh">↻ Last refreshed now</span></div>'
        +'<table class="su-table"><thead><tr><th>Name</th><th>Type</th><th>Available to</th><th>Trigger</th><th>Last modified</th><th>Errors</th><th>Blocked</th><th>Enabled</th></tr></thead><tbody>'+rows+'</tbody></table>'
        +'</div></div>';
    }
    function screenTools(){ return screenToolsBg(true); }

    function screenAddTool(){
      var cards=[
        {t:'Agent flow', x:'These predictable automations run the same way each time, giving you more control when you need it.', ic:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6h5a3 3 0 0 1 3 3v5"/>', hl:false},
        {t:'Prompt', x:'Analyze and transform text, documents, images, and data, with natural language and AI reasoning.', ic:'<path d="M16 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><circle cx="8" cy="14" r="5"/>', hl:false},
        {t:'Model Context Protocol', x:'Open standard for connecting your agent to data, designed with AI in mind.', ic:'<path d="M4 12l8-8 8 8-8 8z"/><path d="M8 12l4-4 4 4-4 4z"/>', hl:true},
        {t:'Computer use', x:'Empower your agent to directly use web and desktop apps.', ic:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', hl:false},
        {t:'REST API', x:'Flexible and scalable way for your agent to connect with and use data.', ic:'<path d="M8 3L4 12l4 9M16 3l4 9-4 9"/>', hl:false},
        {t:'Custom connector', x:'External services and data sources.', ic:'<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/>', hl:false}
      ];
      var cardHtml=cards.map(function(c){
        return '<div class="su-card'+(c.hl?' is-highlight':'')+'"><div class="su-card-title"><span class="su-card-ico" style="color:'+(c.hl?'#5b5fc7':'#0f6cbd')+'">'+railIco(c.ic)+'</span>'+esc(c.t)+'</div><div class="su-card-text">'+esc(c.x)+'</div></div>';
      }).join('');
      var fpills=['All','Connector','Prompt','Flow','REST API','Model Context Protocol'];
      var fpHtml=fpills.map(function(p){ var on=p==='Model Context Protocol'; return '<span class="su-filter-pill'+(on?' is-active':'')+'">'+(on?mcpIco()+' ':'')+p+'</span>'; }).join('');
      return '<div style="position:relative; flex:1; display:flex; flex-direction:column">'+screenToolsBg(false)
        +'<div class="su-overlay"><div class="su-modal">'
        +'<div class="su-modal-head"><div><div class="su-modal-title">Add tool</div><div class="su-modal-sub">Let your agent do more. <span style="color:#0f6cbd">Learn more</span></div></div>'
          +'<span class="su-modal-close">'+railIco('<path d="M6 6l12 12M18 6L6 18"/>')+'</span></div>'
        +'<div class="su-search" id="su-hotspot"><span style="display:flex;align-items:center;gap:8px;flex:1">'+searchIco()+'<span class="su-type-target" style="color:var(--cs-fg-3)">Search for a tool</span></span><span style="color:#b14be0">'+railIco('<path d="M5 12h14M13 6l6 6-6 6"/>')+'</span></div>'
        +'<div class="su-create-row"><span class="lbl">Create new</span><span class="more">See less</span></div>'
        +'<div class="su-cards">'+cardHtml+'</div>'
        +'<div class="su-modal-filters">'+fpHtml+'</div>'
        +'<div class="su-modal-foot"><span>How is your experience with adding tools?  👍 👎</span>'
          +'<span>Suggestions and search will include AI-generated results. <span style="color:#0f6cbd">See terms</span> &nbsp; <button class="su-btn">Cancel</button></span></div>'
        +'</div></div></div>';
    }

    function chanCard(name, hl, icoColor){
      return '<div class="su-chan'+(hl?' is-highlight':'')+'"><span class="su-chan-ico" style="color:'+(icoColor||'#5b5fc7')+'">'
        +(hl?CHECK:railIco('<rect x="3" y="3" width="18" height="18" rx="3"/>'))+'</span>'+name+'</div>';
    }
    function screenChannels(){
      var preview='<div class="su-chan-grid" style="grid-template-columns:1fr">'+chanCard('🌐 Demo website', false)+'</div>';
      var ms='<div class="su-chan-grid" style="grid-template-columns:1fr 1fr">'
        +chanCard('Microsoft Teams', true, '#107c41')
        +chanCard('SharePoint', false)+'</div>';
      var other='<div class="su-chan-grid">'
        +chanCard('Web app', false)+chanCard('Native app', false)+chanCard('Facebook', false)
        +chanCard('WhatsApp', false)+chanCard('Telegram', false)+chanCard('Twilio', false)+'</div>';
      return '<div class="su-screen" style="padding:0">'+agentBar('Channels')
        +'<div style="padding:18px 24px 24px">'
        +'<div class="su-banner">'+railIco('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/>')
          +'<span>You\\u2019re using <b>Microsoft authentication</b>, so only Teams and <b>Microsoft 365</b> and <b>SharePoint</b> channels are available.</span></div>'
        +'<div class="su-status-card"><div class="lbl">Published agent status</div>'
          +'<div class="val"><span style="color:var(--cs-green)">'+CHECK+'</span>Published 5/20/2026, 2:20 PM</div></div>'
        +'<p class="su-sec-label">Share a preview</p>'+preview
        +'<p class="su-sec-label" style="margin-top:20px">Microsoft channels</p>'+ms
        +'<p class="su-sec-label" style="margin-top:20px">Other channels</p>'+other
        +'</div></div>';
    }

    function renderScreen(which){
      if(which==='tools') return screenTools();
      if(which==='addTool') return screenAddTool();
      if(which==='channels') return screenChannels();
      return screenAgents();
    }

    // Tools/Channels are tabs INSIDE an agent, so the left rail stays on
    // "Agents" the whole way through — matching the real Copilot Studio.
    function railFor(){ return 'agents'; }

    function advance(){ if(idx<SETUP.steps.length-1){ idx++; render(); } }

    function render(){
      var step=SETUP.steps[idx];
      var last=idx===SETUP.steps.length-1;
      // Primary cue: a glimmer on the real UI element to click (set up in
      // wireHotspot). Subtle arrows sit bottom-right as an unobtrusive fallback,
      // so it reads as real software, not a slideshow.
      var pager='<div class="su-pager">'
        +'<button id="su-back" title="Back"'+(idx===0?' disabled':'')+'>'+railIco('<path d="M15 6l-6 6 6 6"/>')+'</button>'
        +'<button id="su-next" title="Next"'+(last?' disabled':'')+'>'+railIco('<path d="M9 6l6 6-6 6"/>')+'</button>'
        +'</div>';
      win.innerHTML = chrome(railFor(step.screen), renderScreen(step.screen)) + pager;
      var b=document.getElementById('su-back'); if(b) b.onclick=function(){ if(idx>0){idx--; render();} };
      var n=document.getElementById('su-next'); if(n) n.onclick=advance;
      wireHotspot(step.screen);
    }

    // Attach the glimmer + click handler to the right element on each screen, so
    // advancing feels like operating the product rather than clicking Next.
    function wireHotspot(screen){
      var hot=document.getElementById('su-hotspot');
      if(!hot) return;
      hot.classList.add('su-hot');
      if(screen==='addTool'){
        // Click the search box → type a tool name → then advance. Feels live.
        hot.classList.add('su-hot-field');
        hot.onclick=function(){
          if(hot.dataset.typing) return; hot.dataset.typing='1';
          hot.classList.remove('su-hot','su-hot-field');
          typeInto(hot, 'Marketing Cloud MCP', function(){ setTimeout(advance, 650); });
        };
      } else {
        hot.onclick=advance;
      }
    }

    function typeInto(el, text, done){
      var target=el.querySelector('.su-type-target') || el;
      target.innerHTML='';
      var i=0;
      (function tick(){
        if(i<=text.length){
          target.innerHTML=esc(text.slice(0,i))+'<span class="su-typed-caret"></span>';
          i++; setTimeout(tick, 55);
        } else if(done){ done(); }
      })();
    }
    render();
  </script>
</body>
</html>`
}
