const sidebarItems = [
  {
    id: 'activity',
    label: 'Activity',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.857 17.082a24 24 0 0 0-.536-3.284M14.857 17.082a24 24 0 0 1-.536 3.284m.536-3.284h3.072m-3.072 0H6.857m7.464-3.284A23.92 23.92 0 0 0 12 3.89a23.92 23.92 0 0 0-2.321 9.908m4.642 0H9.679m4.642 0a24 24 0 0 1 .536 3.284M9.679 13.798a24 24 0 0 0-.536 3.284m0 0a24 24 0 0 1-.536 3.284M9.143 17.082H6.071"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    ),
    // Real Teams: bell icon
    iconReal: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a6 6 0 0 1 6 6v3.586l1.707 1.707A1 1 0 0 1 19 15.707V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-.293a1 1 0 0 1 .293-.707L7 13.586V9a6 6 0 0 1 5-5.917V3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M10 19a2 2 0 1 0 4 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    badge: '5',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 12c0 4.418-3.582 8-8 8a8.07 8.07 0 0 1-3.033-.59L4.5 20.5l1.09-4.467A7.96 7.96 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'copilot',
    label: 'Copilot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.4 8.2L21 9L16.2 13.4L17.6 20L12 16.8L6.4 20L7.8 13.4L3 9L9.6 8.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'meet',
    label: 'Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'calls',
    label: 'Calls',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'onedrive',
    label: 'OneDrive',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 18H7a5 5 0 0 1-.854-9.93A7 7 0 0 1 19.83 10.2 4 4 0 0 1 18 18z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'more',
    label: '',
    isSpacer: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'apps',
    label: 'Apps',
    isBottom: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
]

export default function Sidebar({ activeView, setActiveView }) {
  const topItems = sidebarItems.filter(i => !i.isBottom && !i.isSpacer)
  const bottomItems = sidebarItems.filter(i => i.isBottom || i.isSpacer)

  return (
    <nav className="flex flex-col items-center w-[58px] min-w-[58px] bg-[#292929] py-1 select-none">
      {/* Top items */}
      <div className="flex flex-col items-center gap-0.5 flex-1">
        {topItems.map((item) => {
          const isActive = item.id === activeView
          const isClickable = item.id === 'chat' || item.id === 'copilot'
          return (
            <button
              key={item.id}
              onClick={() => isClickable && setActiveView(item.id)}
              className={`
                relative flex flex-col items-center justify-center w-[44px] h-[44px] rounded-md text-[10px]
                transition-colors duration-100
                ${isActive
                  ? 'text-white'
                  : 'text-[#999] hover:text-white hover:bg-[#3d3d3d]'
                }
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-[#7B83EB] rounded-r-full" />
              )}
              <span className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="leading-none mt-[2px] text-[10px]">{item.label}</span>
              {item.badge && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#C4314B] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom items */}
      <div className="flex flex-col items-center gap-0.5 pb-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="relative flex flex-col items-center justify-center w-[44px] h-[44px] rounded-md text-[10px] text-[#999] hover:text-white hover:bg-[#3d3d3d] transition-colors duration-100 cursor-default"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>
            {item.label && <span className="leading-none mt-[2px] text-[10px]">{item.label}</span>}
          </button>
        ))}
      </div>
    </nav>
  )
}
