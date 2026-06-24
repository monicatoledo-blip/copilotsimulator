import { useState } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import CopilotView from './components/CopilotView'

function App() {
  const [activeView, setActiveView] = useState('chat')
  const [selectedConversation, setSelectedConversation] = useState('salesforce')

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {activeView === 'chat' && (
            <ChatView
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          )}
          {activeView === 'copilot' && <CopilotView />}
        </main>
      </div>
    </div>
  )
}

export default App
