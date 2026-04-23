// src/components/blog/Breadcrumb.tsx
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface Props {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://tefetrostudios.com${item.href}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[#475569] flex-wrap">
          <li>
            <Link href="/" className="hover:text-[#e66b00] transition-colors">Home</Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#475569]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {index === items.length - 1 ? (
                <span className="text-[#0f172a] font-medium" aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-[#e66b00] transition-colors">{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}