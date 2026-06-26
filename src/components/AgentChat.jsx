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

  useEffect(() => {
    setMessages([])
    setInputValue('')
    setIsTyping(false)
  }, [selectedAgent])

  const handleSend = (text) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    const beat = matchBeat(messageText)

    if (beat.id === 'reset') {
      setMessages([])
      setInputValue('')
      return
    }

    const userMsg = { sender: 'user', text: messageText, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

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

  if (!agent) return <div className="flex-1 bg-[#fafafa]" />

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Agent header */}
      <div className="bg-white border-b border-[#e0e0e0] px-6 h-[52px] flex items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
            style={{ backgroundColor: agent.color }}
          >
            {agent.abbr}
          </div>
          <h3 className="font-semibold text-[15px] text-[#242424]">{agent.name}</h3>
          <span className="text-[12px] text-[#2D9F4F] flex items-center gap-1.5 ml-2">
            <span className="w-1.5 h-1.5 bg-[#2D9F4F] rounded-full" />
            {agent.status}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#fafafa]">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4"
              style={{ backgroundColor: agent.color }}
            >
              {agent.abbr}
            </div>
            <p className="text-[14px] text-[#616161]">Ask {agent.name} a question</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-5 ${msg.sender === 'user' ? 'flex justify-end' : ''}`}>
            {msg.sender === 'user' ? (
              <div className="max-w-[75%]">
                <div className="flex items-center justify-end gap-2.5 mb-1">
                  <span className="text-[12px] text-[#616161]">You · {msg.time}</span>
                  <div className="w-7 h-7 rounded-full bg-[#7B83EB] flex items-center justify-center text-white text-[9px] font-semibold">
                    MB
                  </div>
                </div>
                <div className="bg-[#E8EBFA] rounded-xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-[14px] text-[#242424] leading-[1.6]">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.abbr}
                  </div>
                  <span className="text-[12px] text-[#616161]">
                    <span className="font-semibold text-[#242424]">{agent.name}</span> · {msg.time}
                  </span>
                </div>
                <div className="ml-[38px]">
                  <div className="bg-white rounded-xl rounded-tl-sm px-4 py-2.5 border border-[#e0e0e0] shadow-sm">
                    <p className="text-[14px] text-[#242424] leading-[1.6]"
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
      <div className="px-6 pb-4 pt-2 bg-[#fafafa]">
        <div className="bg-white border border-[#c8c8c8] rounded-lg overflow-hidden focus-within:border-[#6264A7] shadow-sm">
          <div className="px-4 py-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} a question`}
              className="w-full text-[14px] text-[#242424] placeholder-[#999] outline-none message-input"
              disabled={isTyping}
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-0.5">
              <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5l5.5-5.5a3 3 0 114.2 4.2l-5.5 5.5a1.5 1.5 0 01-2.1-2.1l5.5-5.5"/>
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="8" r="0.8" fill="currentColor"/>
                  <circle cx="11" cy="8" r="0.8" fill="currentColor"/>
                  <path d="M6 11a3 3 0 006 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="w-8 h-8 flex items-center justify-center text-[#6264A7] hover:bg-[#E8EBFA] rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <path d="M3 3l13 6.5-13 6.5V10.5L10 9.5 3 8.5V3z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Suggested prompts */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {agent.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[13px] text-[#6264A7] bg-[#E8EBFA] hover:bg-[#D5D9F5] px-4 py-2 rounded-lg transition-colors text-left"
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
