// sections/FormSection.tsx
'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FormSectionProps {
  id: string
  title: string
  icon: string
  description: string
  children: ReactNode
  isActive?: boolean
  onActivate?: (id: string) => void
}

export function FormSection({ id, title, icon, description, children, isActive, onActivate }: FormSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isActive])

  return (
    <div ref={ref} id={`section-${id}`} className="scroll-mt-24">
      <div className={cn(
        'bg-white rounded-2xl border transition-all duration-200',
        isActive ? 'border-blueprint-300 shadow-md' : 'border-neutral-200 hover:border-neutral-300'
      )}>
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-blueprint-900">{title}</h2>
              <p className="text-sm text-neutral-500">{description}</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
        </button>

        {/* Content */}
        {isExpanded && <div className="border-t border-neutral-100 p-6">{children}</div>}
      </div>
    </div>
  )
}