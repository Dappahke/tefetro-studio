'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('text-sm', className)}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home link */}
        <li>
          <Link 
            href="/" 
            className="text-neutral-500 hover:text-deep-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Separator */}
        <li aria-hidden="true" className="text-neutral-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span 
                  aria-current="page"
                  className="font-medium text-deep-700"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href}
                    className="text-neutral-500 hover:text-deep-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-neutral-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}