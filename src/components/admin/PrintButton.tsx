// src/components/admin/PrintButton.tsx
'use client'

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button 
      type="button"
      onClick={() => window.print()}
      className="w-full px-4 py-3 bg-canvas text-deep-700 rounded-xl font-medium hover:bg-mist/50 transition-colors flex items-center justify-center gap-2"
    >
      <Printer size={18} />
      Print Order
    </button>
  )
}