export default function TopBar() {
  return (
    <div className="flex items-center h-12 bg-[#292929] px-3 select-none" style={{ WebkitAppRegion: 'drag' }}>
      {/* Left: Teams logo */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect width="18" height="18" rx="3" fill="#7B83EB"/>
          <text x="9" y="13" textAnchor="middle" fill="white" fontSize="10" fontFamily="Segoe UI,sans-serif" fontWeight="700">T</text>
        </svg>
        <span className="text-white/90 text-[13px] font-semibold">Teams</span>
      </div>

      {/* Back / Forward arrows */}
      <div className="flex items-center gap-0 ml-3">
        <button className="p-1.5 text-white/50 hover:text-white/80 rounded">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5"/>
          </svg>
        </button>
        <button className="p-1.5 text-white/50 hover:text-white/80 rounded">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </button>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-[#3b3b3b] rounded-[4px] px-3 py-[5px] w-[480px] max-w-[50%] border border-[#484848]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="#999"/>
          </svg>
          <span className="text-[#999] text-[13px]">Search</span>
        </div>
      </div>

      {/* Right: Settings + User avatar */}
      <div className="flex items-center gap-1.5">
        {/* Three-dot menu */}
        <button className="p-1.5 text-white/50 hover:text-white/80 hover:bg-white/10 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.2"/>
            <circle cx="8" cy="8" r="1.2"/>
            <circle cx="13" cy="8" r="1.2"/>
          </svg>
        </button>
        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-[#7B83EB] flex items-center justify-center text-white text-[10px] font-semibold cursor-pointer hover:opacity-90 ml-1">
          MB
        </div>
        {/* Window controls placeholder */}
        <div className="flex items-center gap-0 ml-2">
          <button className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
          <button className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
          </button>
          <button className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
