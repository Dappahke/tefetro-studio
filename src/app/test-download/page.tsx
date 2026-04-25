// app/test-download/page.tsx
'use client'

import { useState } from 'react'

export default function TestDownloadPage() {
  const [loading, setLoading] = useState(false)

  const generateDirectToken = async () => {
    setLoading(true)
    
    // Create a token manually for testing
    const orderId = '67932a36-247d-40ec-8873-f8d001079249'
    const expiresAt = Date.now() + 5 * 60 * 1000
    const signature = await generateSignature(orderId, expiresAt)
    const token = `${orderId}:${expiresAt}:${signature}`
    
    window.location.href = `/download?token=${token}`
  }

  const generateSignature = async (orderId: string, expiresAt: number) => {
    // This is a simplified version - in production, you'd call an API
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, expiresAt })
    })
    const data = await response.json()
    return data.signature
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blueprint-900 mb-4">Test Download</h1>
        <p className="text-neutral-600 mb-6">
          Testing order with addons: boq, interior, landscape
        </p>
        
        <button
          onClick={generateDirectToken}
          disabled={loading}
          className="w-full bg-blueprint-600 text-white py-3 rounded-xl font-semibold hover:bg-blueprint-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Go to Download Page'}
        </button>
      </div>
    </div>
  )
}