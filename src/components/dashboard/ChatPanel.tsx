'use client'

import { useState } from 'react'

export default function ChatPanel({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<string[]>([])
  const [text, setText] = useState('')

  const sendMessage = () => {
    if (!text) return
    setMessages([...messages, text])
    setText('')
  }

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            {msg}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}