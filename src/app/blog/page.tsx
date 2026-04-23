// src/app/blog/page.tsx (FIXED - uses your actual client)
import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { BlogHero } from '@/components/blog/BlogHero'
import { FeaturedArticle } from '@/components/blog/FeaturedArticle'
import { ArticleGrid } from '@/components/blog/ArticleGrid'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { NewsletterCTA } from '@/components/blog/NewsletterCTA'
import { GuestBlogBanner } from '@/components/blog/GuestBlogBanner'
import { generateBlogListingSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Tefetro Studios Blog | Architectural Insights & Construction Excellence',
  description: 'Expert architectural insights, construction guides, and property investment strategies from Kenya\'s leading PropTech platform.',
  keywords: ['architectural plans Kenya', 'house designs Nairobi', 'construction blog', 'building plans', 'PropTech Kenya'],
  openGraph: {
    title: 'Tefetro Studios Blog | Architectural Insights',
    description: 'Expert architectural insights from Kenya\'s premier digital architecture platform.',
    type: 'website',
    url: 'https://tefetro.studio/blog',
    images: [{ url: 'https://tefetro.studio/og-blog.jpg', width: 1200, height: 630 }],
    siteName: 'Tefetro Studios',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tefetro Studios Blog',
    description: 'Architectural excellence meets digital innovation.',
    images: ['https://tefetro.studio/og-blog.jpg'],
  },
  alternates: { canonical: 'https://tefetro.studio/blog' },
  robots: { index: true, follow: true },
}

const BLOG_QUERY = `
  {
    "featured": *[_type == "post" && featured == true && status == "published"] | order(publishedAt desc)[0] {
      _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, readTime,
      "category": categories[0]->{title, "slug": slug.current},
      "author": author->{name, "slug": slug.current, image, role}
    },
    "posts": *[_type == "post" && status == "published" && featured != true] | order(publishedAt desc)[0..8] {
      _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, readTime,
      "category": categories[0]->{title, "slug": slug.current},
      "author": author->{name, image, role}
    },
    "categories": *[_type == "category"] | order(title asc) {
      _id, title, "slug": slug.current, description
    }
  }
`

export default async function BlogPage() {
  const data = await client.fetch(BLOG_QUERY)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogListingSchema(data.posts, data.featured))
        }}
      />
      <main className="min-h-screen bg-white">
        <BlogHero />
        <CategoryFilter categories={data.categories} />
        {data.featured && <FeaturedArticle post={data.featured} />}
        <ArticleGrid posts={data.posts} />
        <GuestBlogBanner />
        <NewsletterCTA />
      </main>
    </>
  )
}