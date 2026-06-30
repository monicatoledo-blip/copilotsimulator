import { COPILOT_ICON } from '../../components/simulators/copilotIconData'
import { FLUENT_EMOJI } from '../../components/simulators/fluentEmojiData'
import { CUMULUS_LOGO } from '../../components/simulators/cumulusLogoData'
import { COMPOSER_ICONS } from '../../components/simulators/composerIconData'
import {
  SECURITY_TITLE,
  SECURITY_SUBTITLE,
  SECURITY_BANNER,
  READ_ONLY_TOOLS,
  WRITE_TOOLS,
  READ_ONLY_DEFAULT_MODE,
  WRITE_DEFAULT_MODE,
} from '../../components/simulators/securityModelData'

// Bundle the fixed security-popup content so the exported HTML's vanilla JS can
// render it without importing TS modules. Single source: securityModelData.ts.
const SECURITY_DATA = JSON.stringify({
  title: SECURITY_TITLE,
  subtitle: SECURITY_SUBTITLE,
  banner: SECURITY_BANNER,
  readOnlyMode: READ_ONLY_DEFAULT_MODE,
  writeMode: WRITE_DEFAULT_MODE,
  readOnly: READ_ONLY_TOOLS,
  write: WRITE_TOOLS,
})

export function buildHtmlTemplate(serializedManifest: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Experience</title>
  <style>
    :root {
      --tw-rail:#f0f0f3; --tw-titlebar:#ebebef; --tw-brand:#5b5fc7;
      --tg-purple:#5b5fc7; --tg-you:#e8ebfa; --tg-other:#f5f5f5;
      --tg-fg-1:#242424; --tg-fg-2:#424242; --tg-fg-3:#616161;
      --tc-gradient:linear-gradient(120deg,#2ec5a0 0%,#2aa5f4 32%,#5a6af0 58%,#b14be0 80%,#e5447c 100%);
    }
    * { box-sizing:border-box; }
    html,body { height:100%; margin:0; }
    body {
      font-family:"Segoe UI","Segoe UI Web (West European)",-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
      background:#f3f3f3; color:var(--tg-fg-1);
    }
    .tc-stage { width:100%; height:100vh; }
    .tw-window { width:100%; height:100vh; display:flex; flex-direction:column; background:#fff; overflow:hidden; }
    .tw-titlebar { height:44px; flex-shrink:0; background:var(--tw-titlebar); display:flex; align-items:center; gap:14px; padding:0 14px; border-bottom:1px solid #deded6; }
    .tw-traffic { display:flex; gap:8px; }
    .tw-traffic span { width:12px; height:12px; border-radius:50%; display:block; }
    .tw-traffic .r{ background:#ff5f57; } .tw-traffic .y{ background:#febc2e; } .tw-traffic .g{ background:#28c840; }
    .tw-nav { display:flex; gap:2px; color:#8a8a8a; }
    .tw-search { flex:1; max-width:600px; margin:0 auto; height:30px; background:#fff; border:1px solid #e0e0e0; border-radius:6px; display:flex; align-items:center; gap:8px; padding:0 10px; color:#616161; font-size:13px; }
    .tw-titlebar-right { display:flex; align-items:center; gap:10px; margin-left:auto; }
    .tw-profile { width:28px; height:28px; border-radius:50%; background:var(--tw-brand); color:#fff; font-size:12px; font-weight:600; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .tw-profile.has-logo, .tw-rail-avatar.has-logo { background:#fff; border:1px solid #e2e2e8; }
    .tw-profile img, .tw-rail-avatar img { width:100%; height:100%; object-fit:contain; padding:2px; box-sizing:border-box; border-radius:50%; }
    .tw-body { flex:1; display:flex; min-height:0; }
    .tw-rail { width:72px; flex-shrink:0; background:var(--tw-rail); border-right:1px solid #e2e2e8; display:flex; flex-direction:column; padding:6px 0; gap:2px; }
    .tw-rail-item { position:relative; display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 2px 6px; color:#444; cursor:pointer; border:none; background:transparent; font-family:inherit; }
    .tw-rail-item:hover { background:#e6e6ec; }
    .tw-rail-item span { font-size:10.5px; line-height:1.1; text-align:center; }
    .tw-rail-item.is-active { color:var(--tw-brand); font-weight:600; }
    .tw-rail-item.is-active::before { content:""; position:absolute; left:0; top:8px; bottom:8px; width:3px; border-radius:0 3px 3px 0; background:var(--tw-brand); }
    .tw-rail-spacer { flex:1; }
    .tw-rail-avatar { width:30px; height:30px; border-radius:50%; background:#c4314b; color:#fff; font-size:12px; font-weight:600; display:flex; align-items:center; justify-content:center; margin:6px auto; }
    .tw-content { flex:1; min-width:0; display:flex; background:#fff; }

    /* group chat */
    .tg-surface { flex:1; display:flex; flex-direction:column; min-width:0; min-height:0; background:#fff; }
    .tg-chat-header { flex-shrink:0; height:56px; display:flex; align-items:center; gap:12px; padding:0 18px; border-bottom:1px solid #ededed; }
    .tg-chat-avatars { display:flex; }
    .tg-chat-avatars .tg-mini { width:30px; height:30px; border-radius:50%; border:2px solid #fff; margin-left:-8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:#fff; }
    .tg-chat-avatars .tg-mini:first-child { margin-left:0; }
    .tg-chan-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; background-image:var(--tc-gradient); }
    .tg-chat-title { font-size:16px; font-weight:700; line-height:1.2; }
    .tg-chat-sub { font-size:12px; color:var(--tg-fg-3); }
    .tg-tabs { display:flex; align-items:center; gap:1px; margin-left:6px; }
    .tg-tab { position:relative; border:none; background:transparent; font-family:inherit; font-size:14px; color:var(--tg-fg-2); padding:8px 10px; border-radius:6px; cursor:pointer; }
    .tg-tab:hover { background:#f5f5f5; }
    .tg-tab.is-active { font-weight:600; color:var(--tg-fg-1); }
    .tg-tab.is-active::after { content:""; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; border-radius:2px; background:var(--tg-purple); }
    .tg-tab-add { width:28px; height:28px; border:none; background:transparent; border-radius:6px; color:var(--tg-fg-2); display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tg-tab-add:hover { background:#f5f5f5; }
    .tg-divider { display:flex; align-items:center; text-align:center; color:var(--tg-fg-3); font-size:12px; margin:2px 0 6px; }
    .tg-divider::before, .tg-divider::after { content:""; flex:1; height:1px; background:#ededed; }
    .tg-divider span { padding:0 12px; font-weight:600; }
    /* secondary chat-list pane */
    .tl-pane { width:280px; flex-shrink:0; background:#fff; border-right:1px solid #ededed; display:flex; flex-direction:column; min-height:0; }
    .tl-head { display:flex; align-items:center; padding:14px 12px 8px 16px; }
    .tl-head h2 { margin:0; flex:1; font-size:20px; font-weight:700; }
    .tl-head-actions { display:flex; gap:2px; color:#424242; }
    .tl-head-actions button { width:30px; height:30px; border:none; background:transparent; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:inherit; }
    .tl-head-actions button:hover { background:#f0f0f0; }
    .tl-filters { display:flex; gap:6px; padding:2px 14px 10px; }
    .tl-pill { font-size:12px; border:1px solid #e0e0e0; background:#fff; border-radius:14px; padding:4px 12px; cursor:pointer; color:#424242; font-family:inherit; }
    .tl-pill.is-active { background:#f0f0f5; border-color:#e3e3ee; }
    .tl-list { flex:1; overflow-y:auto; padding:0 8px 12px; }
    .tl-list::-webkit-scrollbar { width:8px; } .tl-list::-webkit-scrollbar-thumb { background:#c8c8c8; border-radius:4px; }
    .tl-nav-item, .tl-item { display:flex; align-items:center; gap:10px; padding:7px 8px; border-radius:6px; cursor:pointer; font-size:14px; color:#242424; }
    .tl-nav-item:hover, .tl-item:hover { background:#f5f5f5; }
    .tl-item.is-active { background:#eaeaf5; font-weight:600; }
    .tl-ico { width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#616161; flex-shrink:0; }
    .tl-ico img { display:block; object-fit:contain; }
    .tl-sec { font-size:12px; color:#616161; font-weight:600; padding:12px 10px 4px; }
    .tl-avatar { position:relative; width:28px; height:28px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:600; }
    .tl-avatar.is-channel { background-image:var(--tc-gradient); }
    .tl-presence-sm { position:absolute; right:-1px; bottom:-1px; width:10px; height:10px; border-radius:50%; background:#6bb700; border:2px solid #fff; }
    .tl-name { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .tl-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; background:transparent; }
    .tl-dot.on { background:#5b5fc7; }
    .tl-item.is-unread .tl-name { font-weight:700; }
    .tl-mention { margin-left:auto; color:#c4314b; font-weight:700; font-size:15px; padding-left:6px; }
    @media (max-width:900px){ .tl-pane { display:none; } }
    .tg-chat-actions { margin-left:auto; display:flex; gap:4px; color:var(--tg-fg-2); }
    .tg-chat-actions button { width:34px; height:34px; border:none; background:transparent; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:inherit; }
    .tg-chat-actions button:hover { background:#f0f0f0; }
    .tg-thread { flex:1; overflow-y:auto; padding:18px 18px 6px; display:flex; flex-direction:column; gap:16px; }
    .tg-thread::-webkit-scrollbar { width:8px; }
    .tg-thread::-webkit-scrollbar-thumb { background:#c8c8c8; border-radius:4px; }
    .tg-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#fff; overflow:hidden; }
    .tg-avatar.is-copilot { background:transparent; border-radius:0; overflow:visible; }
    .tg-avatarwrap { position:relative; flex-shrink:0; width:32px; height:32px; }
    .tg-presence { position:absolute; right:-2px; bottom:-2px; width:13px; height:13px; border-radius:50%; background:#6bb700; border:2px solid #fff; display:flex; align-items:center; justify-content:center; }
    .tg-row { display:flex; gap:10px; align-items:flex-start; position:relative; }
    .tg-col { min-width:0; max-width:80%; position:relative; }
    .tg-meta { display:flex; align-items:baseline; gap:8px; margin-bottom:3px; }
    .tg-name { font-size:13px; font-weight:600; }
    .tg-time { font-size:11px; color:var(--tg-fg-3); }
    .tg-name, .tg-cop-name, .tg-avatarwrap, .tg-avatar.is-copilot { cursor:pointer; }
    .tg-name:hover, .tg-cop-name:hover { text-decoration:underline; }
    .tg-personcard { position:fixed; width:280px; background:#fff; border:1px solid #e3e3e3; border-radius:10px; box-shadow:0 10px 32px rgba(0,0,0,.2); padding:16px; z-index:1000; }
    .tg-pc-head { display:flex; gap:12px; align-items:center; }
    .tg-pc-avatar { width:48px; height:48px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:17px; font-weight:600; overflow:hidden; }
    .tg-pc-avatar img { width:100%; height:100%; object-fit:cover; }
    .tg-pc-avatar.is-copilot { background:transparent; border-radius:0; overflow:visible; }
    .tg-pc-name { display:flex; align-items:center; gap:7px; font-size:16px; font-weight:700; color:var(--tg-fg-1); }
    .tg-pc-presence { width:9px; height:9px; border-radius:50%; background:#6bb700; display:inline-block; flex-shrink:0; }
    .tg-pc-title { font-size:13px; color:var(--tg-fg-3); margin-top:2px; line-height:1.35; }
    .tg-pc-actions { display:flex; gap:8px; margin-top:14px; padding-top:14px; border-top:1px solid #eee; }
    .tg-pc-actions button { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px; border:1px solid #d6d6d6; background:#fff; border-radius:6px; padding:7px 8px; font-size:12px; font-weight:600; color:var(--tg-fg-1); cursor:pointer; font-family:inherit; }
    .tg-pc-actions button:hover { background:#f5f5f5; }
    .tg-bubble { background:var(--tg-other); border-radius:4px 8px 8px 8px; padding:9px 13px; font-size:14px; line-height:20px; color:var(--tg-fg-1); word-wrap:break-word; }
    .tg-row.is-you { flex-direction:row-reverse; }
    .tg-row.is-you .tg-col { display:flex; flex-direction:column; align-items:flex-end; }
    .tg-row.is-you .tg-bubble { background:var(--tg-you); border-radius:8px 4px 8px 8px; }
    .tg-you-time { font-size:11px; color:var(--tg-fg-3); margin-bottom:3px; }
    .tg-sent { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--tg-fg-3); margin-top:4px; }
    .tg-row.is-copilot .tg-col { max-width:92%; flex:1; }
    .tg-cop-head { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
    .tg-cop-name { font-size:13px; font-weight:600; }
    .tg-ai-badge { font-size:10px; line-height:1; color:var(--tg-fg-3); background:#f0f0f0; border:1px solid #e3e3e3; border-radius:4px; padding:3px 6px; font-weight:600; }
    .tg-quote { border-left:3px solid #d6d6d6; background:#fafafa; border-radius:4px; padding:8px 12px; margin-bottom:8px; }
    .tg-quote-meta { display:flex; gap:8px; align-items:baseline; margin-bottom:2px; }
    .tg-quote-name { font-size:12px; font-weight:600; color:var(--tg-purple); }
    .tg-quote-text { font-size:13px; color:var(--tg-fg-2); line-height:18px; }
    .tg-cop-body { font-size:14px; line-height:21px; color:var(--tg-fg-1); }
    .tg-cop-body .tg-p { margin:0 0 8px; } .tg-cop-body .tg-p:last-child { margin-bottom:0; }
    .tg-cop-body .tg-ul { margin:0 0 8px; padding-left:20px; } .tg-cop-body .tg-ul li { margin:2px 0; }
    .tg-hr { border:none; border-top:1px solid #ececec; margin:10px 0; }
    .tg-mention { color:var(--tg-purple); font-weight:600; }
    .tg-fluent-emoji { display:inline-block; vertical-align:-3px; object-fit:contain; }
    .tg-inline-emoji { width:1.15em; height:1.15em; vertical-align:-0.22em; margin:0 0.02em; }
    .tg-uni { font-family:"Segoe UI Emoji","Apple Color Emoji",sans-serif; }
    .tg-reacts { display:flex; gap:4px; margin-top:-11px; padding-left:12px; position:relative; z-index:2; flex-wrap:wrap; }
    .tg-row.is-you .tg-reacts { justify-content:flex-end; padding-left:0; padding-right:12px; }
    .tg-row.is-copilot .tg-reacts { margin-top:8px; padding-left:0; }
    .tg-react { display:inline-flex; align-items:center; gap:5px; background:#fff; border:1px solid #e1e1e1; border-radius:14px; padding:2px 9px 2px 7px; line-height:18px; cursor:pointer; font-family:inherit; box-shadow:0 1px 2px rgba(0,0,0,.06); }
    .tg-react .c { font-size:12px; font-weight:600; color:#424242; }
    .tg-react:hover { background:#f5f5f5; }
    .tg-react.is-mine { background:#e8ebfa; border-color:#b6bdef; }
    .tg-react.is-mine:hover { background:#dfe3f7; }
    .tg-react.is-mine .c { color:#5b5fc7; }
    /* Teams-style hover reaction toolbar */
    .tg-react-tool { position:absolute; top:-16px; right:0; display:flex; align-items:center; gap:1px; background:#fff; border:1px solid #e6e6e6; border-radius:22px; padding:3px 5px; box-shadow:0 2px 10px rgba(0,0,0,.14); opacity:0; transform:translateY(4px); transition:opacity .12s, transform .12s; pointer-events:none; z-index:6; }
    .tg-row:hover .tg-react-tool { opacity:1; transform:translateY(0); pointer-events:auto; }
    .tg-row.is-you .tg-react-tool { right:0; left:auto; }
    .tg-react-tool button { width:30px; height:30px; border:none; background:transparent; border-radius:50%; display:flex; align-items:center; justify-content:center; padding:0; cursor:pointer; transition:transform .08s, background .08s; }
    .tg-react-tool button:hover { background:#f3f3f3; transform:scale(1.14); }
    .tg-react-tool .tg-tool-sep { width:1px; height:18px; background:#e6e6e6; margin:0 3px; }
    .tg-react-tool .tg-tool-more { color:#616161; }
    /* typing */
    .tg-typing-row { display:flex; align-items:center; gap:10px; }
    .tg-typing-text { font-size:13px; color:var(--tg-fg-3); }
    .tg-dots { display:inline-flex; gap:4px; }
    .tg-dots span { width:6px; height:6px; border-radius:50%; background-image:var(--tc-gradient); opacity:.5; animation:tg-bounce 1.2s infinite ease-in-out; }
    .tg-dots span:nth-child(2){ animation-delay:.18s; } .tg-dots span:nth-child(3){ animation-delay:.36s; }
    @keyframes tg-bounce { 0%,60%,100%{ transform:translateY(0); opacity:.4; } 30%{ transform:translateY(-3px); opacity:1; } }
    /* composer */
    .tg-composer { flex-shrink:0; padding:8px 16px 12px; }
    .tg-composer-box { border:1px solid #e0e0e0; border-bottom:2px solid var(--tg-purple); border-radius:4px; background:#fff; }
    .tg-composer-input { font-size:14px; color:var(--tg-fg-1); font-family:inherit; border:none; outline:none; background:transparent; width:100%; padding:13px 14px; }
    .tg-composer-input::placeholder { color:var(--tg-fg-3); }
    .tg-composer-tools { display:flex; align-items:center; gap:1px; color:#616161; margin-top:4px; padding:0 2px; }
    .tg-composer-tools .tg-spacer { flex:1; }
    .tg-composer-tools button { width:32px; height:32px; border:none; background:transparent; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:inherit; }
    .tg-composer-tools button:hover { background:#f0f0f0; }
    .tg-composer-tools button img { width:20px; height:20px; object-fit:contain; display:block; pointer-events:none; }
    .tg-composer-tools .tg-send { color:var(--tg-purple); }
    .tg-composer-tools .tg-send:disabled { color:var(--tg-fg-3); cursor:default; opacity:.55; }
    /* Copilot surface (separate app you click into) */
    .tc-app { --tc-gradient:linear-gradient(120deg,#2ec5a0 0%,#2aa5f4 32%,#5a6af0 58%,#b14be0 80%,#e5447c 100%); position:relative; flex:1; display:flex; flex-direction:column; min-width:0; min-height:0; background:#fff; }
    .tc-header { display:flex; align-items:center; justify-content:space-between; gap:12px; height:48px; padding:0 12px 0 16px; border-bottom:1px solid #e0e0e0; flex-shrink:0; }
    .tc-header-left { display:flex; align-items:center; gap:10px; min-width:0; }
    .tc-header-title { font-size:14px; font-weight:600; color:#242424; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .tc-header-sub { font-size:12px; color:#616161; }
    .tc-chevron { color:#616161; display:flex; }
    .tc-header-actions { display:flex; align-items:center; gap:2px; }
    .tc-icon-btn { width:32px; height:32px; border:none; background:transparent; border-radius:6px; color:#424242; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tc-icon-btn:hover { background:#f0f0f0; }
    .tc-icon-btn.tc-shield { color:#107c41; }
    .tc-icon-btn.tc-shield:hover { background:#e7f4ec; color:#0b5c30; }
    /* security / least-privilege popup */
    .tc-secmodal-overlay { position:absolute; inset:0; z-index:30; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,.32); }
    .tc-secmodal { width:100%; max-width:520px; max-height:100%; display:flex; flex-direction:column; background:#fff; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,.24); overflow:hidden; }
    .tc-secmodal-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:18px 18px 14px; border-bottom:1px solid #e0e0e0; }
    .tc-secmodal-titlewrap { display:flex; align-items:flex-start; gap:12px; min-width:0; }
    .tc-secmodal-shield { flex-shrink:0; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:#e7f4ec; color:#107c41; }
    .tc-secmodal-title { font-size:16px; font-weight:700; color:#242424; }
    .tc-secmodal-sub { font-size:13px; color:#616161; margin-top:2px; }
    .tc-secmodal-close { flex-shrink:0; width:30px; height:30px; border:none; background:transparent; border-radius:6px; color:#424242; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tc-secmodal-close:hover { background:#f0f0f0; }
    .tc-secmodal-body { padding:16px 18px; overflow-y:auto; }
    .tc-sec-banner { display:flex; gap:10px; align-items:flex-start; padding:12px 14px; margin-bottom:16px; background:#f3f9f5; border:1px solid #cde8d7; border-radius:8px; font-size:12.5px; line-height:1.45; color:#1f5132; }
    .tc-sec-banner-ico { flex-shrink:0; color:#107c41; margin-top:1px; }
    .tc-sec-group { border:1px solid #e0e0e0; border-radius:8px; margin-bottom:12px; overflow:hidden; }
    .tc-sec-grouphead { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; }
    .tc-sec-grouptoggle { display:flex; align-items:center; gap:8px; border:none; background:transparent; font-family:inherit; font-size:14px; color:#242424; cursor:pointer; padding:0; }
    .tc-sec-caret { display:flex; transition:transform .15s ease; color:#616161; }
    .tc-sec-caret.is-open { transform:rotate(90deg); }
    .tc-sec-grouplabel { font-weight:600; }
    .tc-sec-count { color:#616161; font-weight:400; }
    .tc-sec-mode { font-size:12.5px; color:#424242; border:1px solid #d1d1d1; border-radius:6px; padding:4px 10px; background:#fafafa; white-space:nowrap; }
    .tc-sec-tools { border-top:1px solid #e0e0e0; }
    .tc-sec-tool { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 14px; }
    .tc-sec-tool:nth-child(even) { background:#fafafa; }
    .tc-sec-toolname { font-size:13px; color:#242424; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .tc-sec-toggle { display:flex; flex-shrink:0; border:1px solid #d1d1d1; border-radius:6px; overflow:hidden; }
    .tc-sec-seg { border:none; background:#fff; font-family:inherit; font-size:11.5px; font-weight:600; color:#616161; padding:4px 9px; cursor:pointer; border-left:1px solid #d1d1d1; }
    .tc-sec-seg:first-child { border-left:none; }
    .tc-sec-seg:hover { background:#f5f5f5; }
    .tc-sec-seg.is-allow.is-on { background:#107c41; color:#fff; }
    .tc-sec-seg.is-ask.is-on { background:#c19c00; color:#fff; }
    .tc-sec-seg.is-deny.is-on { background:#c4314b; color:#fff; }
    .tc-secmodal-foot { display:flex; justify-content:flex-end; gap:8px; padding:14px 18px; border-top:1px solid #e0e0e0; }
    .tc-sec-btn { border:1px solid #d1d1d1; background:#fff; font-family:inherit; font-size:13px; font-weight:600; color:#242424; padding:7px 16px; border-radius:6px; cursor:pointer; }
    .tc-sec-btn:hover { background:#f5f5f5; }
    .tc-sec-btn.is-primary { background:#5b5fc7; border-color:#5b5fc7; color:#fff; }
    .tc-sec-btn.is-primary:hover { background:#4f52b3; }
    .tc-thread { flex:1; overflow-y:auto; padding:20px 18px 8px; display:flex; flex-direction:column; gap:18px; background:#fff; }
    .tc-thread::-webkit-scrollbar { width:8px; } .tc-thread::-webkit-scrollbar-thumb { background:#c8c8c8; border-radius:4px; }
    .tc-row-user { display:flex; justify-content:flex-end; }
    .tc-user-bubble { max-width:78%; background:#f5f5f5; color:#242424; font-size:14px; line-height:20px; padding:10px 14px; border-radius:18px 18px 4px 18px; word-wrap:break-word; }
    .tc-row-assistant { display:flex; gap:12px; align-items:flex-start; }
    .tc-avatar { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-top:2px; }
    .tc-avatar.is-copilot { background:transparent; border-radius:0; overflow:visible; }
    .tc-avatar img { width:100%; height:100%; object-fit:contain; }
    .tc-assistant-col { flex:1; min-width:0; }
    .tc-assistant-name { font-size:13px; font-weight:600; color:#242424; margin-bottom:4px; }
    .tc-assistant-text { font-size:14px; line-height:21px; color:#242424; word-wrap:break-word; }
    .tc-assistant-text .tg-p { margin:0 0 8px; } .tc-assistant-text .tg-p:last-child { margin-bottom:0; }
    .tc-assistant-text .tg-ul { margin:0 0 8px; padding-left:20px; } .tc-assistant-text .tg-ul li { margin:2px 0; }
    .tc-assistant-text .tg-hr { border:none; border-top:1px solid #ececec; margin:10px 0; }
    .tc-assistant-text .tg-mention { color:#5b5fc7; font-weight:600; }
    .tc-actions { display:flex; align-items:center; gap:2px; margin-top:10px; }
    .tc-action-btn { width:28px; height:28px; border:none; background:transparent; border-radius:6px; color:#616161; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tc-action-btn:hover { background:#f0f0f0; color:#242424; }
    .tc-card { margin-top:10px; border:1px solid #e0e0e0; border-radius:8px; background:#fbfbfb; overflow:hidden; }
    .tc-card-accent { height:3px; background:var(--tc-gradient); }
    .tc-card-body { padding:12px 14px; }
    .tc-card-head { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
    .tc-card-check { width:18px; height:18px; border-radius:50%; background:#107c41; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tc-card-title { font-size:13px; font-weight:600; color:#242424; }
    .tc-card-text { font-size:13px; line-height:19px; color:#424242; }
    .tg-toolcall { display:flex; align-items:center; gap:7px; font-size:12.5px; line-height:18px; color:#6f6f6f; margin:5px 0; }
    .tg-toolcall-ico { flex-shrink:0; color:#8a8aff; }
    .tg-toolcall .tg-mention { color:#6f6f6f; font-weight:600; }
    .tc-viz { margin-top:6px; }
    .tc-viz-title { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:700; color:#242424; margin:2px 0 8px; }
    .tc-viz-title .tg-inline-emoji { width:1.25em; height:1.25em; }
    .tc-viz-card { border:1px solid #e0e0e0; border-radius:10px; background:#fff; padding:16px 18px; overflow-x:auto; box-shadow:0 1px 2px rgba(0,0,0,0.04); }
    .tc-viz-pre { margin:0; font-family:"Cascadia Code","Consolas","SF Mono","Menlo",ui-monospace,monospace; font-size:12.5px; line-height:1.55; color:#2b2b2b; white-space:pre; tab-size:2; }
    .tc-viz-card::-webkit-scrollbar { height:8px; }
    .tc-viz-card::-webkit-scrollbar-thumb { background:#c8c8c8; border-radius:4px; }
    .tc-typing { display:inline-flex; align-items:center; gap:5px; padding:6px 2px; }
    .tc-typing span { width:7px; height:7px; border-radius:50%; background-image:var(--tc-gradient); opacity:.5; animation:tc-bounce 1.2s infinite ease-in-out; }
    .tc-typing span:nth-child(2){ animation-delay:.18s; } .tc-typing span:nth-child(3){ animation-delay:.36s; }
    @keyframes tc-bounce { 0%,60%,100%{ transform:translateY(0); opacity:.4; } 30%{ transform:translateY(-4px); opacity:1; } }
    .tc-composer { flex-shrink:0; padding:8px 16px 12px; background:#fff; }
    .tc-input { display:flex; align-items:flex-end; gap:8px; border:1px solid #d1d1d1; border-radius:12px; padding:8px 8px 8px 12px; }
    .tc-input-left { display:flex; align-items:center; gap:2px; padding-bottom:4px; }
    .tc-placeholder { flex:1; font-size:14px; color:#616161; padding:6px 4px; user-select:none; }
    .tc-input-field { flex:1; min-width:0; border:none; outline:none; background:transparent; font-family:inherit; font-size:14px; line-height:20px; color:#242424; padding:6px 4px; resize:none; overflow-y:auto; max-height:160px; }
    .tc-input-field::placeholder { color:#616161; }
    .tc-thread.is-welcome { align-items:center; justify-content:center; }
    .tc-welcome { margin:auto; width:100%; max-width:760px; display:flex; flex-direction:column; align-items:center; text-align:center; padding:24px 16px; }
    .tc-welcome-brand { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .tc-welcome-titles { display:flex; flex-direction:column; gap:1px; }
    .tc-welcome-title { font-size:30px; font-weight:600; color:#242424; letter-spacing:-0.01em; }
    .tc-welcome-sub { font-size:12px; font-weight:600; letter-spacing:0.02em; text-transform:uppercase; color:#616161; }
    .tc-welcome-invite { font-size:15px; line-height:22px; color:#424242; margin-bottom:26px; max-width:560px; }
    .tc-suggest-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; width:100%; }
    .tc-suggest-card { display:flex; flex-direction:column; gap:8px; align-items:flex-start; text-align:left; background:#fff; border:1px solid #ededed; border-radius:10px; padding:16px 18px; font-family:inherit; transition:border-color .15s, box-shadow .15s; }
    .tc-suggest-card:hover { border-color:#c7c7f0; box-shadow:0 2px 10px rgba(0,0,0,0.07); }
    .tc-suggest-head { display:flex; align-items:center; gap:8px; }
    .tc-suggest-ico { flex-shrink:0; display:flex; color:#5b5fc7; }
    .tc-suggest-label { font-size:14px; font-weight:600; color:#242424; }
    .tc-suggest-text { font-size:13px; line-height:18px; color:#616161; }
    .tc-thinking { display:inline-flex; align-items:center; gap:9px; padding:4px 0; }
    .tc-thinking-text { font-size:14px; font-weight:600; background:var(--tc-gradient); background-size:200% auto; -webkit-background-clip:text; background-clip:text; color:transparent; animation:tc-shimmer 2s linear infinite; }
    @keyframes tc-shimmer { to { background-position:200% center; } }
    .tc-dots { display:inline-flex; gap:4px; }
    .tc-dots span { width:6px; height:6px; border-radius:50%; background:#8a8aff; background-image:var(--tc-gradient); opacity:.5; animation:tc-bounce 1.2s infinite ease-in-out; }
    .tc-dots span:nth-child(2){ animation-delay:.18s; } .tc-dots span:nth-child(3){ animation-delay:.36s; }
    .tc-send { width:32px; height:32px; border:none; border-radius:8px; background:var(--tc-gradient); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:filter .15s, transform .1s; }
    .tc-send:hover { filter:brightness(1.08); } .tc-send:active { transform:scale(0.93); }
    .tw-nav svg { padding:4px; border-radius:6px; cursor:pointer; transition:background .15s; }
    .tw-nav svg:hover { background:#e2e2e8; }
    .tw-search:hover { border-color:#c7c7c7; background:#fafafa; cursor:text; }
    .tw-profile { cursor:pointer; transition:box-shadow .15s; }
    .tw-profile:hover { box-shadow:0 0 0 2px rgba(98,100,167,0.35); }
    .tw-traffic span { transition:filter .15s; }
    .tw-traffic:hover span { filter:brightness(1.12); }
    .tc-disclaimer { text-align:center; font-size:11px; color:#616161; margin-top:8px; }
  </style>
</head>
<body>
  <div class="tc-stage">
   <div class="tw-window">
    <div class="tw-titlebar">
      <div class="tw-traffic"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="tw-nav"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 6l-6 6 6 6"/></svg><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg></div>
      <div class="tw-search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><span>Search</span></div>
      <div class="tw-titlebar-right"><div class="tw-profile" id="tw-profile"></div></div>
    </div>
    <div class="tw-body">
      <nav class="tw-rail">
        <button class="tw-rail-item"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span>Activity</span></button>
        <button class="tw-rail-item is-active"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Chat</span></button>
        <button class="tw-rail-item"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17 14.5a6 6 0 0 1 4 5.5"/></svg><span>Teams</span></button>
        <button class="tw-rail-item"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>Calendar</span></button>
        <div class="tw-rail-spacer"></div>
        <div class="tw-rail-avatar" id="tw-railavatar"></div>
      </nav>
      <aside class="tl-pane">
        <div class="tl-head">
          <h2>Chat</h2>
          <div class="tl-head-actions">
            <button title="More options"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>
            <button title="Search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></button>
            <button title="New chat"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          </div>
        </div>
        <div class="tl-filters">
          <button class="tl-pill is-active">Unread</button>
          <button class="tl-pill">Channels</button>
          <button class="tl-pill">Chats</button>
        </div>
        <div class="tl-list">
          <div class="tl-nav-item" id="nav-copilot"><span class="tl-ico"><img src="${COPILOT_ICON}" width="18" height="18" alt="Copilot"></span>Copilot</div>
          <div class="tl-nav-item"><span class="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5 13 13l-3.5 1.5L11 11z"/></svg></span>Discover</div>
          <div class="tl-nav-item"><span class="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/></svg></span>Mentions</div>
          <div class="tl-nav-item"><span class="tl-ico"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>Followed threads</div>
          <div id="tl-sections"></div>
        </div>
      </aside>
      <div class="tw-content">
        <section class="tg-surface" id="tg-surface">
          <div class="tg-chat-header">
            <span class="tg-chan-avatar"><svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><circle cx="8" cy="9" r="2.4"/><circle cx="16" cy="9" r="2.4"/><path d="M3.5 18a4.5 4.5 0 0 1 9 0z"/><path d="M11.5 18a4.5 4.5 0 0 1 9 0z"/></svg></span>
            <div class="tg-chat-title" id="tg-title"></div>
            <div class="tg-tabs">
              <button class="tg-tab is-active">Chat</button>
              <button class="tg-tab">Shared</button>
              <button class="tg-tab-add" title="Add a tab"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
            <div class="tg-chat-actions">
              <button title="Video"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M23 7l-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></button>
              <button title="Call"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg></button>
              <button title="Add people"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M18 8v6M21 11h-6"/></svg></button>
            </div>
          </div>
          <div class="tg-thread" id="thread"></div>
          <div class="tg-composer">
            <div class="tg-composer-box">
              <input id="tg-input" class="tg-composer-input" placeholder="Type a new message" autocomplete="off">
            </div>
            <div class="tg-composer-tools">
              <button title="Format"><img src="${COMPOSER_ICONS.format}" alt=""></button>
              <button title="Attach file"><img src="${COMPOSER_ICONS.attach}" alt=""></button>
              <button title="Emoji"><img src="${COMPOSER_ICONS.emoji}" alt=""></button>
              <button title="GIF"><img src="${COMPOSER_ICONS.gif}" alt=""></button>
              <button title="Sticker"><img src="${COMPOSER_ICONS.sticker}" alt=""></button>
              <button title="Schedule"><img src="${COMPOSER_ICONS.schedule}" alt=""></button>
              <div class="tg-spacer"></div>
              <button id="tg-send" class="tg-send" title="Send"><img src="${COMPOSER_ICONS.send}" alt="Send"></button>
            </div>
          </div>
        </section>
        <section class="tc-app" id="tc-app" style="display:none">
          <header class="tc-header">
            <div class="tc-header-left">
              <div class="tc-avatar is-copilot"><img src="${COPILOT_ICON}" alt="Copilot"></div>
              <div style="min-width:0">
                <div class="tc-header-title" id="tc-name">Copilot</div>
                <div class="tc-header-sub" id="tc-sub"></div>
              </div>
              <span class="tc-chevron"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
            </div>
            <div class="tc-header-actions">
              <button class="tc-icon-btn tc-shield" id="tc-shield" title="Tool permissions &amp; data security" aria-label="Tool permissions and data security"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg></button>
              <button class="tc-icon-btn" title="New chat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
              <button class="tc-icon-btn" title="Chat history"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg></button>
              <button class="tc-icon-btn" title="More options"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>
            </div>
          </header>
          <div class="tc-thread" id="tc-thread"></div>
          <div class="tc-composer">
            <div class="tc-input">
              <div class="tc-input-left">
                <button class="tc-icon-btn" title="Add attachment"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21.4 11.05 12.2 20.3a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.48-8.49"/></svg></button>
              </div>
              <textarea class="tc-input-field" id="tc-input" rows="1" placeholder="Message Copilot" aria-label="Message Copilot"></textarea>
              <button class="tc-send" id="tc-send" title="Send"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z"/></svg></button>
            </div>
            <div class="tc-disclaimer">AI-generated content may be incorrect</div>
          </div>
          <div class="tc-secmodal-overlay" id="tc-secmodal" role="dialog" aria-modal="true" style="display:none"></div>
        </section>
      </div>
    </div>
   </div>
  </div>

  <script>
    var ICON = '${COPILOT_ICON}';
    var LOGO = '${CUMULUS_LOGO}';
    var MANIFEST = ${serializedManifest};
    var SECURITY = ${SECURITY_DATA};
    var FLUENT = ${JSON.stringify(FLUENT_EMOJI)};
    var QUICK = ['👍','❤️','😂','😮','😢','😡'];
    var AV_COLORS = ['#c4314b','#0f6cbd','#107c41','#8764b8','#c19c00','#005b70','#a4262c'];
    function emojiHtml(ch, size){ size=size||18; var src=FLUENT[ch]||FLUENT[String(ch).replace(/\\uFE0F/g,'')]; if(src){ return '<img class="tg-fluent-emoji" src="'+src+'" width="'+size+'" height="'+size+'" alt="'+esc(ch)+'">'; } return '<span class="tg-uni">'+esc(ch)+'</span>'; }
    var EMOJI_KEYS = Object.keys(FLUENT).sort(function(a,b){ return b.length-a.length; });
    var EMOJI_RE = EMOJI_KEYS.length ? new RegExp('('+EMOJI_KEYS.map(function(k){ return k.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&'); }).join('|')+')','g') : null;
    function emojiInline(html){ if(!EMOJI_RE) return html; return html.replace(EMOJI_RE, function(m){ var src=FLUENT[m]||FLUENT[m.replace(/\\uFE0F/g,'')]; return src ? '<img class="tg-fluent-emoji tg-inline-emoji" src="'+src+'" alt="'+esc(m)+'">' : m; }); }

    var brand = MANIFEST.brand || {};
    var viewer = MANIFEST.viewer || 'You';
    var members = (MANIFEST.members || []).map(function(m){ return typeof m === 'string' ? { name:m } : m; });
    var thread = document.getElementById('thread');

    function clone(v){ return JSON.parse(JSON.stringify(v || [])); }
    function colorFor(name){ var h=0; name=name||''; for(var i=0;i<name.length;i++){ h=(h*31+name.charCodeAt(i))>>>0; } return AV_COLORS[h%AV_COLORS.length]; }
    function initials(name){ var p=(name||'?').trim().split(/\\s+/); return (p.length===1?p[0][0]:(p[0][0]+p[p.length-1][0])).toUpperCase(); }
    function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    var personaMap = {};
    members.forEach(function(m){ if(m && m.name) personaMap[m.name] = { title:m.title, avatarUrl:m.avatarUrl }; });
    if(!personaMap.Copilot) personaMap.Copilot = { title:'AI assistant' };
    function personaOf(name){ return personaMap[name]; }
    var CARD_ACTIONS = '<div class="tg-pc-actions">'
      + '<button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Chat</button>'
      + '<button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M23 7l-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>Meet</button>'
      + '<button type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>Call</button>'
      + '</div>';
    function cardAvatar(name, persona){
      if(name==='Copilot') return '<span class="tg-pc-avatar is-copilot"><img src="'+ICON+'" width="40" height="40" style="object-fit:contain"></span>';
      if(persona && persona.avatarUrl) return '<span class="tg-pc-avatar" style="background:'+colorFor(name)+'"><img src="'+esc(persona.avatarUrl)+'" alt="'+esc(name)+'"></span>';
      return '<span class="tg-pc-avatar" style="background:'+colorFor(name)+'">'+initials(name)+'</span>';
    }
    function attachCard(el, name){
      if(!el) return; var persona=personaOf(name); var card=null;
      el.addEventListener('mouseenter', function(){
        if(card) return;
        var rect=el.getBoundingClientRect(); var cardW=280; var x=rect.left;
        if(x+cardW > window.innerWidth-12) x=window.innerWidth-cardW-12; if(x<12) x=12;
        var y=rect.bottom+6; if(y+170>window.innerHeight) y=rect.top-176;
        card=document.createElement('div'); card.className='tg-personcard'; card.style.left=x+'px'; card.style.top=y+'px';
        var titleHtml = (persona&&persona.title) ? '<div class="tg-pc-title">'+esc(persona.title)+'</div>' : '';
        card.innerHTML='<div class="tg-pc-head">'+cardAvatar(name,persona)+'<div style="min-width:0"><div class="tg-pc-name">'+esc(name)+'<span class="tg-pc-presence" title="Available"></span></div>'+titleHtml+'</div></div>'+CARD_ACTIONS;
        document.body.appendChild(card);
      });
      el.addEventListener('mouseleave', function(){ if(card){ card.remove(); card=null; } });
    }
    function fillName(text){ return text==null?text:String(text).replace(/\\{\\{?\\s*name\\s*\\}?\\}/gi, viewer||'there'); }
    function inlineHtml(text){
      var s = esc(fillName(text));
      s = s.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
      s = s.replace(/@\\[([^\\]]+)\\]/g, '<span class="tg-mention">$1</span>');
      s = s.replace(/@([A-Za-z0-9_]+)/g, '<span class="tg-mention">$1</span>');
      return emojiInline(s);
    }
    function richHtml(text){
      var lines = String(fillName(text)||'').split('\\n'); var html=''; var bullets=[];
      function flush(){ if(bullets.length){ html += '<ul class="tg-ul">'+bullets.map(function(b){return '<li>'+inlineHtml(b)+'</li>';}).join('')+'</ul>'; bullets=[]; } }
      lines.forEach(function(line){ var t=line.trim();
        if(t==='---'||t==='—'){ flush(); html+='<hr class="tg-hr">'; }
        else if(t.indexOf('> ')===0){ flush(); html+='<div class="tg-toolcall"><svg class="tg-toolcall-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z"/></svg><span>'+inlineHtml(t.slice(2))+'</span></div>'; }
        else if(t.indexOf('- ')===0){ bullets.push(t.slice(2)); }
        else if(t===''){ flush(); }
        else { flush(); html+='<p class="tg-p">'+inlineHtml(line)+'</p>'; }
      }); flush(); return html;
    }
    function copilotAvatar(){ return '<span class="tg-avatar is-copilot"><img src="'+ICON+'" width="28" height="28" style="object-fit:contain"></span>'; }
    function scrollDown(){ thread.scrollTop = thread.scrollHeight; }
    function delay(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

    // header
    var brandLogo = (brand.logoUrl || '').trim() || LOGO;
    var logoImg = '<img src="'+brandLogo+'" alt="'+esc(brand.name||'Brand')+'">';
    var twProfile = document.getElementById('tw-profile');
    var twRail = document.getElementById('tw-railavatar');
    twProfile.innerHTML = logoImg; twProfile.classList.add('has-logo');
    twRail.innerHTML = logoImg; twRail.classList.add('has-logo');
    var chatName = MANIFEST.chatTitle || ((brand.name||'') + ' Team');
    document.getElementById('tg-title').textContent = chatName;
    (function(){
      var box = document.getElementById('tl-sections');
      var GROUPSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><circle cx="8" cy="9" r="2.4"/><circle cx="16" cy="9" r="2.4"/><path d="M3.5 18a4.5 4.5 0 0 1 9 0zM11.5 18a4.5 4.5 0 0 1 9 0z"/></svg>';
      var items = (MANIFEST.sidebar && MANIFEST.sidebar.length) ? MANIFEST.sidebar : (function(){
        var arr=[{name:chatName,type:'channel',section:'Favorites'}];
        members.forEach(function(m){ arr.push({name:m.name,type:'person',section:'Chats'}); });
        return arr;
      })();
      var order=[], groups={};
      items.forEach(function(it){ var sec=it.section||'Chats'; if(!groups[sec]){ groups[sec]=[]; order.push(sec); } groups[sec].push(it); });
      var hasActive = items.some(function(it){ return it.name===chatName; });
      function rowHtml(it){
        var isChannel = it.type==='channel'; var isActiveChat = it.name===chatName;
        var avatar = isChannel
          ? '<span class="tl-avatar '+(isActiveChat?'is-channel':'')+'"'+(isActiveChat?'':' style="background:'+colorFor(it.name)+'"')+'>'+GROUPSVG+'</span>'
          : '<span class="tl-avatar" style="background:'+colorFor(it.name)+'">'+initials(it.name)+'<span class="tl-presence-sm"></span></span>';
        return '<div class="tl-item '+(isActiveChat?'is-active':'')+' '+(it.unread?'is-unread':'')+'"'+(isActiveChat?' data-active="1"':'')+'>'
          +'<span class="tl-dot '+(it.unread?'on':'')+'"></span>'+avatar
          +'<span class="tl-name">'+esc(it.name)+'</span>'+(it.mention?'<span class="tl-mention">@</span>':'')+'</div>';
      }
      var html='';
      if(!hasActive){ html+='<div class="tl-sec">Favorites</div>'+rowHtml({name:chatName,type:'channel'}); }
      order.forEach(function(sec){ html+='<div class="tl-sec">'+esc(sec)+'</div>'; groups[sec].forEach(function(it){ html+=rowHtml(it); }); });
      box.innerHTML=html;
    })();
    document.title = (brand.name ? brand.name + ' \\u2014 ' : '') + (MANIFEST.chatTitle || 'Teams');

    function addReaction(step, emoji, delta){ if(!step) return; step.reactions=step.reactions||[]; var ex=null; step.reactions.forEach(function(r){ if(r.emoji===emoji) ex=r; });
      if(ex){ ex.count+=delta; ex.mine=delta>0; if(ex.count<=0){ step.reactions=step.reactions.filter(function(r){ return r!==ex; }); } }
      else if(delta>0){ step.reactions.push({emoji:emoji,count:1,mine:true}); }
    }

    function renderPills(pillsEl, step){
      pillsEl.innerHTML='';
      (step.reactions||[]).forEach(function(r){
        var p=document.createElement('button'); p.type='button'; p.className='tg-react'+(r.mine?' is-mine':''); p.title=r.mine?'Remove your reaction':'React';
        p.innerHTML=emojiHtml(r.emoji, 16)+'<span class="c">'+r.count+'</span>';
        var mine=r.mine; p.onclick=function(e){ e.stopPropagation(); addReaction(step, r.emoji, mine?-1:1); renderPills(pillsEl, step); };
        pillsEl.appendChild(p);
      });
    }
    function reactionArea(step){ var d=document.createElement('div'); d.className='tg-reacts'; renderPills(d, step); return d; }
    function reactToolbar(host, step, pillsEl){
      var bar=document.createElement('div'); bar.className='tg-react-tool';
      QUICK.forEach(function(emoji){
        var b=document.createElement('button'); b.type='button'; b.title='React'; b.innerHTML=emojiHtml(emoji, 20);
        b.onmousedown=function(e){ e.preventDefault(); };
        b.onclick=function(e){ e.stopPropagation(); addReaction(step, emoji, 1); renderPills(pillsEl, step); };
        bar.appendChild(b);
      });
      var sep=document.createElement('span'); sep.className='tg-tool-sep'; bar.appendChild(sep);
      var more=document.createElement('button'); more.type='button'; more.className='tg-tool-more'; more.title='More options';
      more.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';
      bar.appendChild(more);
      host.appendChild(bar);
    }

    function personRow(step){
      var isYou = !step.author || step.author===viewer;
      var row=document.createElement('div'); row.className='tg-row'+(isYou?' is-you':'');
      var col=document.createElement('div'); col.className='tg-col';
      if(isYou){
        col.innerHTML='<div class="tg-bubble">'+inlineHtml(step.text)+'</div>';
        var pillsY=reactionArea(step); col.appendChild(pillsY);
        var sent=document.createElement('div'); sent.className='tg-sent'; sent.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/></svg>'; col.appendChild(sent);
        row.appendChild(col); reactToolbar(col, step, pillsY);
      } else {
        var av=document.createElement('span'); av.className='tg-avatarwrap';
        av.innerHTML='<span class="tg-avatar" style="background:'+colorFor(step.author)+'">'+initials(step.author)+'</span><span class="tg-presence" title="Available"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>';
        col.innerHTML='<div class="tg-meta"><span class="tg-name">'+esc(step.author)+'</span></div><div class="tg-bubble">'+inlineHtml(step.text)+'</div>';
        var pillsP=reactionArea(step); col.appendChild(pillsP);
        row.appendChild(av); row.appendChild(col); reactToolbar(col, step, pillsP);
        attachCard(av, step.author); attachCard(col.querySelector('.tg-name'), step.author);
      }
      return row;
    }

    function copilotRow(step, quote){
      var row=document.createElement('div'); row.className='tg-row is-copilot';
      var av=document.createElement('span'); av.className='tg-avatar is-copilot'; av.innerHTML='<img src="'+ICON+'" width="28" height="28" style="object-fit:contain">';
      var col=document.createElement('div'); col.className='tg-col';
      var head='<div class="tg-cop-head"><span class="tg-cop-name">Copilot</span><span class="tg-ai-badge">AI generated</span></div>';
      var quoteHtml = quote ? '<div class="tg-quote"><div class="tg-quote-meta"><span class="tg-quote-name">'+esc(quote.author)+'</span></div><div class="tg-quote-text">'+inlineHtml(quote.text)+'</div></div>' : '';
      var body = step.type==='toolAction'
        ? '<div class="tg-cop-body"><p class="tg-p"><strong>'+esc(step.title||'Action complete')+'</strong></p><p class="tg-p">'+inlineHtml(step.text)+'</p></div>'
        : '<div class="tg-cop-body">'+richHtml(step.text)+'</div>';
      col.innerHTML=head+quoteHtml+body;
      var pills=reactionArea(step); col.appendChild(pills);
      row.appendChild(av); row.appendChild(col); reactToolbar(col, step, pills);
      attachCard(av, 'Copilot'); attachCard(col.querySelector('.tg-cop-name'), 'Copilot');
      return row;
    }

    function typingRow(){
      var row=document.createElement('div'); row.className='tg-typing-row';
      row.innerHTML=copilotAvatar()+'<span class="tg-typing-text">Copilot is typing</span><span class="tg-dots"><span></span><span></span><span></span></span>';
      return row;
    }
    function isCopilot(s){ return s && (s.type==='assistantResponse' || s.type==='toolAction' || s.type==='visualization'); }

    // ---- Group chat: preload the human conversation only (no Copilot) ----
    function preloadChat(){
      thread.innerHTML='';
      var divider=document.createElement('div'); divider.className='tg-divider'; divider.innerHTML='<span>Today</span>'; thread.appendChild(divider);
      var history = clone(MANIFEST.groupChat);
      history.forEach(function(step){
        if(isCopilot(step)) thread.appendChild(copilotRow(step, null));
        else thread.appendChild(personRow(step));
      });
      scrollDown();
    }

    // ---- Copilot surface: separate app you click into ----
    var assistant = MANIFEST.assistant || {};
    var asstName = assistant.name || 'Copilot';
    var copThread = document.getElementById('tc-thread');
    document.getElementById('tc-name').textContent = asstName;
    document.getElementById('tc-sub').textContent = brand.name || '';
    var tcInput = document.getElementById('tc-input');
    var tcSend = document.getElementById('tc-send');
    tcInput.placeholder = 'Message ' + asstName;

    function tcAvatar(){ return '<div class="tc-avatar is-copilot"><img src="'+ICON+'" alt="'+esc(asstName)+'"></div>'; }
    function tcActions(){ return '<div class="tc-actions">'
      +'<button class="tc-action-btn" title="Copy"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>'
      +'<button class="tc-action-btn" title="Good response"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1.5 6a2 2 0 0 1-2 1.5H7"/></svg></button>'
      +'<button class="tc-action-btn" title="Bad response"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17 13V4h3v9zM17 13l-4 7a2 2 0 0 1-3-2l1-5H6a2 2 0 0 1-2-2l1.5-6A2 2 0 0 1 7.5 4H17"/></svg></button>'
      +'</div>'; }
    function tcUserRow(step){ var r=document.createElement('div'); r.className='tc-row-user'; r.innerHTML='<div class="tc-user-bubble">'+inlineHtml(step.text)+'</div>'; return r; }
    function tcAssistantRow(step){
      var r=document.createElement('div'); r.className='tc-row-assistant';
      var body;
      if(step.type==='toolAction'){
        body='<div class="tc-card"><div class="tc-card-accent"></div><div class="tc-card-body"><div class="tc-card-head"><span class="tc-card-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></span><span class="tc-card-title">'+esc(fillName(step.title||'Action complete'))+'</span></div><div class="tc-card-text">'+inlineHtml(step.text)+'</div></div></div>';
      } else if(step.type==='visualization'){
        body='<div class="tc-viz"><div class="tc-viz-title">'+inlineHtml(step.title||'Insights')+'</div><div class="tc-viz-card"><pre class="tc-viz-pre">'+esc(fillName(step.text))+'</pre></div></div>';
      } else {
        body='<div class="tc-assistant-text">'+richHtml(step.text)+'</div>';
      }
      r.innerHTML=tcAvatar()+'<div class="tc-assistant-col"><div class="tc-assistant-name">'+esc(asstName)+'</div>'+body+tcActions()+'</div>';
      return r;
    }
    function tcTyping(){ var r=document.createElement('div'); r.className='tc-row-assistant'; r.innerHTML=tcAvatar()+'<div class="tc-assistant-col"><div class="tc-typing"><span></span><span></span><span></span></div></div>'; return r; }
    function copScroll(){ copThread.scrollTop = copThread.scrollHeight; }

    // Group the script into turns: each starts with a customer prompt and includes
    // the Copilot responses that follow it. The viewer drives playback from the composer.
    function buildSegments(script){ var segs=[],cur=null; (script||[]).forEach(function(step){ if(step.type==='userPrompt'){ if(cur)segs.push(cur); cur={prompt:step,responses:[]}; } else { if(!cur)cur={prompt:null,responses:[]}; cur.responses.push(step); } }); if(cur)segs.push(cur); return segs; }
    var segments = buildSegments(clone(MANIFEST.script));
    var copStarted=false, copBusy=false, segIndex=0;

    var STARTER_TILES=[
      {label:'Idea', copy:'Spark ideas for your next campaign or customer moment.', icon:'<path d="M9 18h6M10 21h4"/><path d="M12 2a7 7 0 0 0-4 12.6c.6.4 1 1.1 1 1.9V18h6v-1.5c0-.8.4-1.5 1-1.9A7 7 0 0 0 12 2z"/>'},
      {label:'Design', copy:'Shape a rough concept into a polished, on-brand asset.', icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 14l-4-4-7 7"/>'},
      {label:'Create', copy:'Build a segment, journey, or email right from chat.', icon:'<path d="M5 21L15 11"/><path d="M16 3l.9 2.1L19 6l-2.1.9L16 9l-.9-2.1L13 6l2.1-.9z"/>'},
      {label:'Ask', copy:'Ask anything about your audiences, data, or setup.', icon:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.3c-.6.3-.9.7-.9 1.5"/><circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none"/>'}
    ];
    function tcWelcome(){
      var cards = STARTER_TILES.map(function(t){
        return '<div class="tc-suggest-card"><span class="tc-suggest-head"><span class="tc-suggest-ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+t.icon+'</svg></span><span class="tc-suggest-label">'+esc(t.label)+'</span></span><span class="tc-suggest-text">'+esc(t.copy)+'</span></div>';
      }).join('');
      var w=document.createElement('div'); w.className='tc-welcome';
      w.innerHTML='<div class="tc-welcome-brand"><span class="tc-avatar is-copilot"><img src="'+ICON+'" width="40" height="40" style="object-fit:contain" alt="'+esc(asstName)+'"></span><span class="tc-welcome-titles"><span class="tc-welcome-title">'+esc(asstName)+'</span><span class="tc-welcome-sub">Copilot agent</span></span></div>'
        +'<div class="tc-welcome-invite">'+esc(fillName(assistant.greeting) || 'What will you create today?')+'</div>'
        +'<div class="tc-suggest-grid" aria-hidden="true">'+cards+'</div>';
      return w;
    }
    function renderWelcome(){
      copThread.innerHTML=''; copThread.classList.add('is-welcome');
      copThread.appendChild(tcWelcome());
    }
    function tcAutoGrow(){ tcInput.style.height='auto'; tcInput.style.height=Math.min(tcInput.scrollHeight,160)+'px'; }

    // How long Copilot "works" before each response, plus rotating status phrases.
    var PACING_MULT={low:0.5,medium:1,high:1.7};
    function thinkMs(step){ var base; if(step.type==='visualization') base=6500; else if(step.type==='toolAction') base=6000; else base=Math.min(Math.max(step.delayMs||3200,3600),5200); return Math.round(base*(PACING_MULT[step.pacing]||1)); }
    var THINK_PHRASES={
      assistantResponse:['Thinking\\u2026','Reasoning over your request\\u2026','Lining things up\\u2026','Working on it\\u2026'],
      toolAction:['Connecting to Marketing Cloud\\u2026','Reaching into the MCP server\\u2026','Setting that up for you\\u2026','Wiring it up\\u2026','Almost there\\u2026'],
      chart:['Pulling the numbers\\u2026','Crunching the data\\u2026','Building your chart\\u2026','Putting it together\\u2026'],
      visualization:['Putting it together\\u2026','Mapping it out\\u2026','Building it now\\u2026','Almost there\\u2026']
    };
    var CHART_VIZ_TYPES={bar:1,funnel:1,scorecard:1};
    // Real Copilot "thinks" once per turn, then streams the whole answer.
    function phrasesForTurn(responses){
      for(var i=0;i<responses.length;i++) if(responses[i].type==='toolAction') return THINK_PHRASES.toolAction;
      var hasViz=false, hasChart=false;
      for(var j=0;j<responses.length;j++){ if(responses[j].type==='visualization'){ hasViz=true; if(CHART_VIZ_TYPES[responses[j].vizType]) hasChart=true; } }
      if(hasViz) return hasChart ? THINK_PHRASES.chart : THINK_PHRASES.visualization;
      return THINK_PHRASES.assistantResponse;
    }
    function tcThinking(phrases){
      var r=document.createElement('div'); r.className='tc-row-assistant';
      r.innerHTML=tcAvatar()+'<div class="tc-assistant-col"><div class="tc-thinking"><span class="tc-thinking-text"></span><span class="tc-dots"><span></span><span></span><span></span></span></div></div>';
      var label=r.querySelector('.tc-thinking-text'); var i=0;
      label.textContent=phrases[0];
      r._timer=setInterval(function(){ i++; label.textContent=phrases[i%phrases.length]; }, 1300);
      return r;
    }
    function stopThinking(r){ if(r&&r._timer){ clearInterval(r._timer); } if(r&&r.parentNode){ r.parentNode.removeChild(r); } }
    async function copSend(rawText){
      if(copBusy) return;
      var seg=segments[segIndex];
      var text=((rawText!=null?rawText:tcInput.value)||'').trim() || (seg&&seg.prompt?seg.prompt.text:'');
      if(!text) return;
      copBusy=true;
      if(!copStarted){ copStarted=true; copThread.classList.remove('is-welcome'); copThread.innerHTML=''; }
      tcInput.value=''; tcAutoGrow();
      copThread.appendChild(tcUserRow({text:text})); copScroll();
      segIndex++;
      var responses=seg?seg.responses:[];
      if(responses.length){
        var totalThink=Math.min(responses.reduce(function(s,st){return s+thinkMs(st);},0),12000);
        var think=tcThinking(phrasesForTurn(responses)); copThread.appendChild(think); copScroll();
        await delay(totalThink);
        stopThinking(think);
        for(var i=0;i<responses.length;i++){
          copThread.appendChild(tcAssistantRow(responses[i])); copScroll();
          if(i<responses.length-1) await delay(600);
        }
      }
      if(!seg){
        var t2=tcTyping(); copThread.appendChild(t2); copScroll(); await delay(900); copThread.removeChild(t2);
        copThread.appendChild(tcAssistantRow({type:'assistantResponse', text:"That's the end of this demo flow \\u2014 refresh to start over."})); copScroll();
      }
      copBusy=false;
      tcInput.focus();
    }
    // First prompt is typed by hand; after that, click to "paste" the next one.
    tcInput.addEventListener('click', function(){
      if(copBusy) return;
      if(segIndex===0) return;
      if(tcInput.value.trim()) return;
      var seg=segments[segIndex];
      if(seg && seg.prompt){ tcInput.value=seg.prompt.text; tcAutoGrow(); }
    });
    tcSend.addEventListener('click', function(){ copSend(); });
    tcInput.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); copSend(); } });
    tcInput.addEventListener('input', tcAutoGrow);

    // ---- View switching (chat <-> copilot) ----
    var tgSurface=document.getElementById('tg-surface');
    var tcApp=document.getElementById('tc-app');
    var navCopilot=document.getElementById('nav-copilot');
    var activeRow=document.querySelector('.tl-item[data-active="1"]');
    function showCopilot(){
      tgSurface.style.display='none'; tcApp.style.display='flex';
      navCopilot.classList.add('is-active');
      if(activeRow) activeRow.classList.remove('is-active');
      if(!copStarted) renderWelcome();
      tcInput.focus();
    }
    function showChat(){
      tcApp.style.display='none'; tgSurface.style.display='flex';
      navCopilot.classList.remove('is-active');
      if(activeRow) activeRow.classList.add('is-active');
    }
    navCopilot.addEventListener('click', showCopilot);
    if(activeRow) activeRow.addEventListener('click', showChat);

    // ---- Security / least-privilege popup ----
    (function(){
      var shield=document.getElementById('tc-shield');
      var overlay=document.getElementById('tc-secmodal');
      if(!shield||!overlay) return;
      var SHIELD_SVG='<svg width="SZ" height="SZ" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>';
      // Per-tool permission state, seeded from the bundled defaults.
      var perms={};
      SECURITY.readOnly.forEach(function(t){ perms[t.name]=t.permission; });
      SECURITY.write.forEach(function(t){ perms[t.name]=t.permission; });
      var PERM_OPTS=[{key:'allow',label:'Allow'},{key:'ask',label:'Ask'},{key:'deny',label:'Deny'}];
      // Track group open-state so it survives the re-render on each toggle.
      var openState={ ro: SECURITY.readOnlyMode==='Custom', wr: SECURITY.writeMode==='Custom' };
      function toggleHtml(name){
        return '<div class="tc-sec-toggle" role="group" aria-label="Permission">'+PERM_OPTS.map(function(o){
          var on=perms[name]===o.key?' is-on':'';
          return '<button type="button" class="tc-sec-seg is-'+o.key+on+'" data-tool="'+esc(name)+'" data-perm="'+o.key+'" title="'+o.label+'">'+o.label+'</button>';
        }).join('')+'</div>';
      }
      function groupHtml(key, label, mode, tools){
        var open=openState[key];
        var rows=tools.map(function(t){
          return '<div class="tc-sec-tool"><span class="tc-sec-toolname">'+esc(t.name)+'</span>'+toggleHtml(t.name)+'</div>';
        }).join('');
        return '<div class="tc-sec-group" data-group="'+key+'">'
          +'<div class="tc-sec-grouphead">'
            +'<button type="button" class="tc-sec-grouptoggle" data-group="'+key+'" aria-expanded="'+(open?'true':'false')+'">'
              +'<span class="tc-sec-caret'+(open?' is-open':'')+'"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg></span>'
              +'<span class="tc-sec-grouplabel">'+esc(label)+' <span class="tc-sec-count">('+tools.length+')</span></span>'
            +'</button>'
            +'<span class="tc-sec-mode">'+esc(mode)+'</span>'
          +'</div>'
          +'<div class="tc-sec-tools" '+(open?'':'style="display:none"')+'>'+rows+'</div>'
        +'</div>';
      }
      function render(){
        overlay.innerHTML='<div class="tc-secmodal">'
          +'<div class="tc-secmodal-head">'
            +'<div class="tc-secmodal-titlewrap"><span class="tc-secmodal-shield">'+SHIELD_SVG.replace(/SZ/g,'20')+'</span>'
              +'<div><div class="tc-secmodal-title">'+esc(SECURITY.title)+'</div><div class="tc-secmodal-sub">'+esc(SECURITY.subtitle)+'</div></div></div>'
            +'<button type="button" class="tc-secmodal-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
          +'</div>'
          +'<div class="tc-secmodal-body">'
            +'<div class="tc-sec-banner"><span class="tc-sec-banner-ico">'+SHIELD_SVG.replace(/SZ/g,'16')+'</span><span>'+esc(SECURITY.banner)+'</span></div>'
            +groupHtml('ro', 'Read-only tools', SECURITY.readOnlyMode, SECURITY.readOnly)
            +groupHtml('wr', 'Write tools', SECURITY.writeMode, SECURITY.write)
          +'</div>'
          +'<div class="tc-secmodal-foot"><button type="button" class="tc-sec-btn" data-close="1">Cancel</button><button type="button" class="tc-sec-btn is-primary" data-close="1">Save</button></div>'
        +'</div>';
      }
      function open(){ render(); overlay.style.display='flex'; }
      function close(){ overlay.style.display='none'; }
      shield.addEventListener('click', open);
      overlay.addEventListener('click', function(e){
        if(e.target===overlay || e.target.closest('[data-close]') || e.target.closest('.tc-secmodal-close')){ close(); return; }
        var seg=e.target.closest('.tc-sec-seg');
        if(seg){ perms[seg.getAttribute('data-tool')]=seg.getAttribute('data-perm'); render(); return; }
        var gt=e.target.closest('.tc-sec-grouptoggle');
        if(gt){ var key=gt.getAttribute('data-group'); openState[key]=!openState[key]; render(); }
      });
    })();

    // ---- Composer in the group chat ----
    (function(){
      var input=document.getElementById('tg-input');
      var sendBtn=document.getElementById('tg-send');
      if(!input||!sendBtn) return;
      function refresh(){ sendBtn.disabled = !input.value.trim(); }
      function sendMsg(){
        var text=input.value.trim(); if(!text) return;
        var step={ id:'usr-'+Date.now(), type:'userPrompt', author:viewer, text:text, reactions:[] };
        thread.appendChild(personRow(step)); scrollDown();
        input.value=''; refresh();
      }
      input.addEventListener('input', refresh);
      input.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMsg(); } });
      sendBtn.addEventListener('click', sendMsg);
      refresh();
    })();

    preloadChat();
  </script>
</body>
</html>`
}
