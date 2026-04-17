'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, User, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

interface ChatPanelProps {
  projectId?: string
  projectName?: string
  initialMessages?: Message[]
}

export default function ChatPanel({ projectId, projectName, initialMessages = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages([...messages, newMessage])
    setText('')

    // Simulate admin response (replace with actual API call)
    setTimeout(() => {
      const adminResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. Our team will get back to you shortly.",
        sender: 'admin',
        timestamp: new Date(),
        status: 'read'
      }
      setMessages(prev => [...prev, adminResponse])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-2xl border border-[#0F4C5C]/10 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-[#0F4C5C]/10 bg-gradient-to-r from-[#0F4C5C]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F4C5C]/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-[#0F4C5C]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F4C5C]">Project Chat</h3>
              {projectName && (
                <p className="text-xs text-[#1E1E1E]/50">{projectName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-[#1E1E1E]/60">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#0F4C5C]" />
            </div>
            <p className="text-[#0F4C5C] font-medium mb-2">No messages yet</p>
            <p className="text-sm text-[#1E1E1E]/50">Start a conversation with our team</p>
          </div>
        ) : (
          <>
            {/* Group messages by date */}
            {Array.from(new Set(messages.map(m => formatDate(m.timestamp)))).map(date => (
              <div key={date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs px-3 py-1 bg-white rounded-full text-[#1E1E1E]/50 border border-[#0F4C5C]/10">
                    {date}
                  </span>
                </div>
                {messages.filter(m => formatDate(m.timestamp) === date).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-[#F28C00] text-white'
                          : 'bg-white border border-[#0F4C5C]/10 text-[#1E1E1E]'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        message.sender === 'user' ? 'text-white/70' : 'text-[#1E1E1E]/40'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && message.status === 'read' && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#0F4C5C]/10 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#0F4C5C]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#0F4C5C]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#0F4C5C]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#0F4C5C]/10 bg-white">
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-[#0F4C5C]/20 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#F28C00] transition-colors"
            placeholder="Type your message..."
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="px-4 py-2 bg-[#F28C00] text-white rounded-xl hover:bg-[#F28C00]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contact Options */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#0F4C5C]/5">
          <Link href="mailto:support@tefetra.studio" className="flex items-center gap-2 text-xs text-[#1E1E1E]/50 hover:text-[#0F4C5C] transition-colors">
            <Mail className="w-3 h-3" />
            Email Support
          </Link>
          <Link href="tel:+254700000000" className="flex items-center gap-2 text-xs text-[#1E1E1E]/50 hover:text-[#0F4C5C] transition-colors">
            <Phone className="w-3 h-3" />
            Call Us
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#1E1E1E]/50">
            <User className="w-3 h-3" />
            Response within 24h
          </div>
        </div>
      </div>
    </div>
  )
}