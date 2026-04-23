// src/components/blog/ArticleContent.tsx
// NO EXTERNAL DEPENDENCIES - Pure React portable text renderer

'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface PortableTextBlock {
  _key: string
  _type: string
  children?: PortableTextSpan[]
  markDefs?: MarkDef[]
  style?: string
  level?: number
  listItem?: string
  asset?: any
  alt?: string
  caption?: string
  code?: string
  language?: string
  href?: string
}

interface PortableTextSpan {
  _key: string
  _type: string
  text: string
  marks?: string[]
}

interface MarkDef {
  _key: string
  _type: string
  href?: string
}

interface Props {
  content: PortableTextBlock[] | null | undefined
}

function renderSpan(span: PortableTextSpan, markDefs: MarkDef[] = []): React.ReactNode {
  let children: React.ReactNode = span.text

  // Apply marks
  if (span.marks && span.marks.length > 0) {
    span.marks.forEach((mark) => {
      if (mark === 'strong') {
        children = <strong key={mark} className="font-semibold text-[#0f172a]">{children}</strong>
      } else if (mark === 'em') {
        children = <em key={mark} className="italic">{children}</em>
      } else if (mark === 'underline') {
        children = <u key={mark}>{children}</u>
      } else if (mark === 'code') {
        children = <code key={mark} className="bg-[#0f172a]/5 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
      } else {
        // Link marks reference markDefs by _key
        const markDef = markDefs.find((def) => def._key === mark)
        if (markDef && markDef._type === 'link' && markDef.href) {
          children = (
            <a
              key={mark}
              href={markDef.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e66b00] hover:text-[#ff7f00] underline decoration-2 underline-offset-2 transition-colors"
            >
              {children}
            </a>
          )
        }
      }
    })
  }

  return children
}

function renderBlock(block: PortableTextBlock): React.ReactNode {
  const { _type, _key } = block

  switch (_type) {
    case 'block': {
      const style = block.style || 'normal'
      const children = block.children || []
      const markDefs = block.markDefs || []

      const renderedChildren = children.map((child) => renderSpan(child, markDefs))

      if (style === 'h1') {
        return (
          <h1 key={_key} className="font-bold text-3xl lg:text-4xl text-[#0f172a] mt-12 mb-6 scroll-mt-24">
            {renderedChildren}
          </h1>
        )
      }

      if (style === 'h2') {
        return (
          <h2 key={_key} className="font-bold text-2xl lg:text-3xl text-[#0f172a] mt-12 mb-6 scroll-mt-24">
            {renderedChildren}
          </h2>
        )
      }

      if (style === 'h3') {
        return (
          <h3 key={_key} className="font-bold text-xl lg:text-2xl text-[#0f172a] mt-10 mb-4 scroll-mt-24">
            {renderedChildren}
          </h3>
        )
      }

      if (style === 'h4') {
        return (
          <h4 key={_key} className="font-semibold text-lg text-[#0f172a] mt-8 mb-3">
            {renderedChildren}
          </h4>
        )
      }

      if (style === 'blockquote') {
        return (
          <blockquote key={_key} className="border-l-4 border-[#e66b00] pl-6 py-2 my-8 bg-[#eaf3fb] rounded-r-xl">
            <p className="text-[#0f172a] font-medium italic text-lg">{renderedChildren}</p>
          </blockquote>
        )
      }

      // Normal paragraph
      return (
        <p key={_key} className="text-[#475569] leading-relaxed mb-6 text-lg">
          {renderedChildren}
        </p>
      )
    }

    case 'image': {
      if (!block.asset) return null
      return (
        <figure key={_key} className="my-8">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={urlFor(block.asset).width(800).height(450).url()}
              alt={block.alt || ''}
              fill
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-[#475569] italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'code': {
      return (
        <pre key={_key} className="bg-[#0f172a] text-white p-4 rounded-xl overflow-x-auto my-6 text-sm">
          <code>{block.code}</code>
        </pre>
      )
    }

    default:
      return null
  }
}

export function ArticleContent({ content }: Props) {
  if (!content || !Array.isArray(content)) {
    return (
      <div className="text-[#475569] italic">
        No content available.
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block) => renderBlock(block))}
    </div>
  )
}