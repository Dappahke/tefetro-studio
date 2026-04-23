'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

const SITE_URL = 'https://tefetro.studio'

interface SocialShareProps {
  slug: string
  title: string
}

export default function SocialShare({
  slug,
  title,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const url = `${SITE_URL}/products/${slug}`

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: title,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      className="w-full rounded-2xl border border-black/5 bg-white px-5 py-4 flex items-center justify-center gap-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          Link Copied
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Plan
        </>
      )}
    </button>
  )
}