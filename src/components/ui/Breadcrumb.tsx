// src/components/ui/Breadcrumb.tsx

'use client'

import Link from 'next/link'
import Script from 'next/script'
import { Home, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({
  items,
  className,
}: BreadcrumbProps) {
  const siteUrl =
    process.env
      .NEXT_PUBLIC_SITE_URL ||
    'https://tefetro.studio'

  const allItems = [
    {
      label: 'Home',
      href: '/',
    },
    ...items,
  ]

  /* -------------------------------- */
  /* SEO JSON-LD Schema              */
  /* Google recommends BreadcrumbList */
  /* -------------------------------- */
  const schema = {
    '@context':
      'https://schema.org',
    '@type':
      'BreadcrumbList',
    itemListElement:
      allItems.map(
        (
          item,
          index
        ) => ({
          '@type':
            'ListItem',
          position:
            index + 1,
          name:
            item.label,
          item: `${siteUrl}${item.href}`,
        })
      ),
  }

  return (
    <>
      {/* Structured Data */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema
            ),
        }}
      />

      {/* Visual Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className={cn(
          'w-full',
          className
        )}
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-sm md:text-[15px]">
          {allItems.map(
            (
              item,
              index
            ) => {
              const isLast =
                index ===
                allItems.length -
                  1

              const isHome =
                index === 0

              return (
                <li
                  key={`${item.href}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  {/* Item */}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-900 max-w-[220px] truncate"
                    >
                      {isHome ? (
                        <Home className="w-4 h-4" />
                      ) : null}

                      {
                        item.label
                      }
                    </span>
                  ) : (
                    <Link
                      href={
                        item.href
                      }
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-slate-500 hover:text-[#0F4C5C] hover:bg-slate-50 transition-all duration-200'
                      )}
                    >
                      {isHome ? (
                        <Home className="w-4 h-4" />
                      ) : null}

                      <span className="truncate max-w-[140px]">
                        {
                          item.label
                        }
                      </span>
                    </Link>
                  )}

                  {/* Separator */}
                  {!isLast && (
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                </li>
              )
            }
          )}
        </ol>
      </nav>
    </>
  )
}