import ChatList from './ChatList'
import ChatPane from './ChatPane'

export default function ChatView({ selectedConversation, setSelectedConversation }) {
  return (
    <div className="flex h-full">
      <ChatList
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
      <ChatPane selectedConversation={selectedConversation} />
    </div>
  )
}
