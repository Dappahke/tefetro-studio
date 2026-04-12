'use client'
import { useState } from 'react'

export default function RevisionPanel({ projectId }: { projectId: string }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    console.log('Revision for:', projectId, text)
    setText('')
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4">Request Revision</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded mb-3"
        placeholder="Describe your changes..."
      />

      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>
    </div>
  )
}