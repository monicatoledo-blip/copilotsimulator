export default function TopBar() {
  return (
    <div className="flex items-center h-[clamp(40px,3.2vw,52px)] bg-[#f0f0f0] border-b border-[#e0e0e0] select-none">
      {/* Left: Teams logo */}
      <div className="flex items-center gap-2 pl-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect width="16" height="16" rx="2.5" fill="#6264A7"/>
          <text x="8" y="11.5" textAnchor="middle" fill="white" fontSize="9" fontFamily="Segoe UI,sans-serif" fontWeight="700">T</text>
        </svg>
      </div>

      {/* Back / Forward arrows */}
      <div className="flex items-center gap-0 ml-2.5">
        <button className="w-7 h-7 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#e0e0e0] rounded transition-colors">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5"/>
          </svg>
        </button>
        <button className="w-7 h-7 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#e0e0e0] rounded transition-colors">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </button>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="flex items-center gap-2 bg-white rounded-[4px] px-3.5 py-[5px] w-[clamp(320px,35vw,640px)] max-w-[50%] border border-[#d1d1d1]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="#999"/>
          </svg>
          <span className="text-[#999] text-[13px]">Search</span>
        </div>
      </div>

      {/* Right: Three dots + User avatar + window controls */}
      <div className="flex items-center gap-0 pr-0">
        {/* Three-dot menu */}
        <button className="w-[46px] h-full flex items-center justify-center text-[#616161] hover:bg-[#e0e0e0] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.2"/>
            <circle cx="8" cy="8" r="1.2"/>
            <circle cx="13" cy="8" r="1.2"/>
          </svg>
        </button>
        {/* User avatar - photo-like circle */}
        <div className="w-8 h-8 rounded-full overflow-hidden mx-2 cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-[#7B83EB] to-[#5B5FC7] flex items-center justify-center text-white text-[11px] font-semibold">
            MB
          </div>
        </div>

        {/* Window controls: minimize, maximize, close */}
        <div className="flex items-center h-full">
          <button className="w-[46px] h-full flex items-center justify-center text-[#616161] hover:bg-[#e0e0e0] transition-colors">
            <svg width="10" height="1" viewBox="0 0 10 1">
              <line x1="0" y1="0.5" x2="10" y2="0.5" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </button>
          <button className="w-[46px] h-full flex items-center justify-center text-[#616161] hover:bg-[#e0e0e0] transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </button>
          <button className="w-[46px] h-full flex items-center justify-center text-[#616161] hover:bg-[#C42B1C] hover:text-white transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
