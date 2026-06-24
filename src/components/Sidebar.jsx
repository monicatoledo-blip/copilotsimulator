const sidebarItems = [
  {
    id: 'activity',
    label: 'Activity',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a1 1 0 011 1v4.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 8V3a1 1 0 011-1z" fill="currentColor"/>
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    badge: '1',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2c4.418 0 8 3.134 8 7s-3.582 7-8 7a9.06 9.06 0 01-2.252-.283L4.2 17.472A.75.75 0 013 16.833V14.1C1.765 12.922 1 11.39 1 9.7 1 5.506 4.809 2 10 2z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'copilot',
    label: 'Copilot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <defs>
          <linearGradient id="copilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B83EB"/>
            <stop offset="100%" stopColor="#6264A7"/>
          </linearGradient>
        </defs>
        <path d="M10 1.5a3.5 3.5 0 013.5 3.5v1.5h-7V5A3.5 3.5 0 0110 1.5zM6 8h8a3 3 0 013 3v2a5 5 0 01-10 0v-2a3 3 0 013-3z" fill="url(#copilotGrad)"/>
        <circle cx="8" cy="12" r="1" fill="white"/>
        <circle cx="12" cy="12" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'meet',
    label: 'Meet',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 .5l2.4-1.6a.5.5 0 01.8.4v9.4a.5.5 0 01-.8.4L15 12.5v-7z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 1v2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-2V1h-1.5v2h-3V1H7zM4.5 8h11v7a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V8z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'calls',
    label: 'Calls',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.6 2.4C4.7 1.3 6.5 1.4 7.5 2.6l1.2 1.5c.8 1 .7 2.4-.2 3.3l-.3.3c-.1.1-.1.3 0 .5l3.6 3.6c.2.2.4.1.5 0l.3-.3c.9-.9 2.3-1 3.3-.2l1.5 1.2c1.2 1 1.3 2.8.2 3.9l-1 1c-1.2 1.2-3 1.5-4.6.7-2.6-1.3-5-3.2-7-5.2s-3.9-4.4-5.2-7c-.8-1.6-.5-3.4.7-4.6l1-1z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'files',
    label: 'Files',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 4.5A2.5 2.5 0 014.5 2h4.586a1.5 1.5 0 011.06.44l5.415 5.414A1.5 1.5 0 0116 8.914V15.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 012 15.5v-11z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'more',
    label: 'More',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <nav className="flex flex-col items-center w-[68px] min-w-[68px] bg-[#2b2b2b] py-2 gap-0.5 select-none">
      {sidebarItems.map((item) => {
        const isActive = item.id === activeView
        const isClickable = item.id === 'chat' || item.id === 'copilot'
        return (
          <button
            key={item.id}
            onClick={() => isClickable && setActiveView(item.id)}
            className={`
              relative flex flex-col items-center justify-center w-12 h-12 rounded-md text-[10px] gap-0.5
              transition-colors duration-150
              ${isActive
                ? 'text-white bg-[#3d3d3d]'
                : 'text-[#999] hover:text-white hover:bg-[#333]'
              }
              ${isClickable ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#6264A7] rounded-r-full" />
            )}
            <span className="w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="leading-tight">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-1.5 min-w-[16px] h-4 bg-[#C4314B] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
