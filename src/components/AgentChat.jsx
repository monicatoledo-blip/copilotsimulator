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
      <div className="bg-white border-b border-[#e5e5e5] px-5 py-3 h-[48px] flex items-center">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
            style={{ backgroundColor: agent.color }}
          >
            {agent.abbr}
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-[#242424] leading-tight">{agent.name}</h3>
          </div>
          <span className="text-[11px] text-[#2D9F4F] flex items-center gap-1 ml-2">
            <span className="w-1.5 h-1.5 bg-[#2D9F4F] rounded-full" />
            {agent.status}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold mb-3"
              style={{ backgroundColor: agent.color }}
            >
              {agent.abbr}
            </div>
            <p className="text-[13px] text-[#616161] mb-4">Ask {agent.name} a question</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
            {msg.sender === 'user' ? (
              <div className="max-w-[80%]">
                <div className="flex items-center justify-end gap-2 mb-0.5">
                  <span className="text-[12px] text-[#616161]">You · {msg.time}</span>
                  <div className="w-6 h-6 rounded-full bg-[#7B83EB] flex items-center justify-center text-white text-[9px] font-semibold">
                    MB
                  </div>
                </div>
                <div className="bg-[#E8EBFA] rounded-lg rounded-tr-sm px-3.5 py-2">
                  <p className="text-[13px] text-[#242424] leading-[1.5]">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.abbr}
                  </div>
                  <span className="text-[12px] text-[#616161]">
                    <span className="font-semibold text-[#242424]">{agent.name}</span> · {msg.time}
                  </span>
                </div>
                <div className="ml-8">
                  <div className="bg-white rounded-lg rounded-tl-sm px-3.5 py-2 border border-[#e5e5e5]">
                    <p className="text-[13px] text-[#242424] leading-[1.5]"
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
      <div className="px-4 pb-3 pt-1">
        <div className="bg-white border border-[#d1d1d1] rounded-lg overflow-hidden focus-within:border-[#6264A7]">
          <div className="px-3 py-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} a question`}
              className="w-full text-[13px] text-[#242424] placeholder-[#999] outline-none message-input"
              disabled={isTyping}
            />
          </div>
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-0">
              <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l5-5a2.83 2.83 0 114 4l-5 5a1.41 1.41 0 01-2-2l5-5"/>
                </svg>
              </button>
              <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="6" cy="7" r="0.8" fill="currentColor"/>
                  <circle cx="10" cy="7" r="0.8" fill="currentColor"/>
                  <path d="M5.5 10a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="p-1.5 text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="p-1.5 text-[#6264A7] hover:bg-[#E8EBFA] rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.5 2l12 6-12 6V9.5L9 8 2.5 6.5V2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Suggested prompts */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {agent.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[12px] text-[#6264A7] bg-[#E8EBFA] hover:bg-[#D5D9F5] px-3 py-1.5 rounded-lg transition-colors text-left"
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
