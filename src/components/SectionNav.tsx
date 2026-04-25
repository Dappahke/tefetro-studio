// components/SectionNav.tsx
'use client'

import { cn } from '@/lib/utils'

interface SectionNavProps {
  sections: { id: string; label: string; icon: string }[]
  active: string
  onSelect: (id: string) => void
}

export function SectionNav({ sections, active, onSelect }: SectionNavProps) {
  return (
    <div className="flex gap-1 px-6 pb-2 overflow-x-auto scrollbar-hide">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onSelect(section.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
            active === section.id
              ? 'bg-blueprint-50 text-blueprint-700'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
          )}
        >
          <span className="text-base">{section.icon}</span>
          <span>{section.label}</span>
          {active === section.id && (
            <div className="w-1.5 h-1.5 rounded-full bg-blueprint-600 ml-1" />
          )}
        </button>
      ))}
    </div>
  )
}