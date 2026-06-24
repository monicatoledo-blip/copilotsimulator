import { useState, useRef, useEffect } from 'react'
import { agents } from '../data/agents'
import { matchBeat } from '../data/demoBeats'
import TypingIndicator from './TypingIndicator'
import DemoResponseCard from './DemoResponseCard'

export default function AgentChat({ selectedAgent }) {
  const agent = agents.find(a => a.id === selectedAgent)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Reset messages when agent changes
  useEffect(() => {
    setMessages([])
    setInputValue('')
    setIsTyping(false)
  }, [selectedAgent])

  const handleSend = (text) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    const beat = matchBeat(messageText)

    // Handle reset
    if (beat.id === 'reset') {
      setMessages([])
      setInputValue('')
      return
    }

    // Add user message
    const userMsg = { sender: 'user', text: messageText, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Show typing indicator then response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const botMsg = {
        sender: 'bot',
        text: beat.response.text,
        card: beat.response.card,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
    }, 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!agent) return <div className="flex-1 bg-[#f5f5f5]" />

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f5]">
      {/* Agent header */}
      <div className="bg-white border-b border-[#e5e5e5] px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: agent.color }}
          >
            {agent.abbr}
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#242424]">{agent.name}</h3>
            <p className="text-xs text-[#616161]">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 ml-[52px]">
          <span className="text-xs text-[#6264A7] bg-[#E8EBFA] px-2 py-0.5 rounded font-medium">{agent.mention}</span>
          <span className="text-xs text-[#2D9F4F] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2D9F4F] rounded-full" />
            {agent.status}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4"
              style={{ backgroundColor: agent.color }}
            >
              {agent.abbr}
            </div>
            <p className="text-sm text-[#616161] mb-6">Ask {agent.name} a question</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
            {msg.sender === 'user' ? (
              <div className="max-w-[80%]">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs text-[#616161]">You · {msg.time}</span>
                  <div className="w-6 h-6 rounded-full bg-[#6264A7] flex items-center justify-center text-white text-[9px] font-semibold">
                    MB
                  </div>
                </div>
                <div className="bg-[#E8EBFA] rounded-lg rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm text-[#242424] leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.abbr}
                  </div>
                  <span className="text-xs text-[#616161]">
                    <span className="font-semibold text-[#242424]">{agent.name}</span> · {msg.time}
                  </span>
                </div>
                <div className="ml-8">
                  <div className="bg-white rounded-lg rounded-tl-sm px-4 py-2.5 border border-[#e5e5e5] shadow-sm">
                    <p className="text-sm text-[#242424] leading-relaxed"
                       dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  </div>
                  {msg.card && <DemoResponseCard card={msg.card} />}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator agentName={agent.name} agentColor={agent.color} agentAbbr={agent.abbr} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-4">
        <div className="flex items-center bg-white border border-[#e5e5e5] rounded-md px-3 py-2 focus-within:border-[#6264A7]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${agent.name} a question`}
            className="flex-1 text-sm text-[#242424] placeholder-[#999] outline-none message-input"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="p-1.5 text-[#6264A7] hover:bg-[#E8EBFA] rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1l14 7-14 7V9l10-1-10-1V1z"/>
            </svg>
          </button>
        </div>

        {/* Suggested prompts */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {agent.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-xs text-[#6264A7] bg-[#E8EBFA] hover:bg-[#D5D9F5] px-3 py-2 rounded-lg transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
