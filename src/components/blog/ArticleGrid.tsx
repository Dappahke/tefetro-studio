// src/components/blog/ArticleGrid.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  mainImage: any
  publishedAt: string
  readTime: number
  category: { title: string; slug: { current: string } }
  author: { name: string; image: any; role: string }
}

interface Props {
  posts: Post[]
}

export function ArticleGrid({ posts }: Props) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  
  const filteredPosts = category
    ? posts.filter(post => post.category?.slug?.current === category)
    : posts

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
      <div className="flex items-center justify-between mb-10">
        <h3 className="font-bold text-2xl text-[#0f172a]">Latest Articles</h3>
        <div className="flex items-center gap-2 text-sm text-[#475569]">
          <span>Showing</span>
          <span className="font-semibold text-[#0f172a]">{filteredPosts.length}</span>
          <span>articles</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="group bg-white rounded-2xl overflow-hidden border border-[#0f2a44]/5 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-500"
          >
            <div className="relative h-56 overflow-hidden">
              {post.mainImage && (
                <Image
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#0f2a44] text-xs font-semibold rounded-full">
                  {post.category?.title}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 text-xs text-[#475569]">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="w-1 h-1 bg-[#475569] rounded-full" />
                <span>{post.readTime} min read</span>
              </div>
              
              <h4 className="font-bold text-lg text-[#0f172a] mb-3 leading-snug group-hover:text-[#0f2a44] transition-colors line-clamp-2">
                {post.title}
              </h4>
              
              <p className="text-sm text-[#475569] leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-[#0f2a44]/5">
                {post.author?.image && (
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-xs font-medium text-[#0f172a]">{post.author?.name}</p>
                  <p className="text-[10px] text-[#475569]">{post.author?.role}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#475569] text-lg">No articles found in this category.</p>
          <Link href="/blog" className="inline-block mt-4 text-[#e66b00] hover:text-[#ff7f00] font-medium">
            View all articles
          </Link>
        </div>
      )}
    </section>
  )
}