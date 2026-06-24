export default function TopBar() {
  return (
    <div className="flex items-center h-12 bg-[#2b2b2b] px-4 select-none" style={{ WebkitAppRegion: 'drag' }}>
      {/* Left: Teams logo + name */}
      <div className="flex items-center gap-2 mr-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="3" fill="#6264A7"/>
          <text x="10" y="14" textAnchor="middle" fill="white" fontSize="11" fontFamily="Segoe UI,sans-serif" fontWeight="600">T</text>
        </svg>
        <span className="text-white/90 text-sm font-semibold">Teams</span>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-[#3d3d3d] rounded px-3 py-1.5 w-[400px] max-w-[50%]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.896 3.9a.75.75 0 01-1.06 1.06l-3.9-3.896A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="#999"/>
          </svg>
          <span className="text-[#999] text-sm">Search</span>
        </div>
      </div>

      {/* Right: User avatar */}
      <div className="flex items-center gap-3">
        <button className="text-white/60 hover:text-white/90 p-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a1 1 0 011 1v4.793l2.854 2.854a1 1 0 01-1.415 1.414L7.293 8.415A1 1 0 017 7.707V2.5a1 1 0 011-1z"/>
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#6264A7] flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-90">
          MB
        </div>
      </div>
    </div>
  )
}
