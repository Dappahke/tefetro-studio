// src/components/blog/FeaturedArticle.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'

interface Props {
  post: any
}

export function FeaturedArticle({ post }: Props) {
  if (!post) return null

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
      <article className="group relative bg-white rounded-3xl overflow-hidden border border-[#0f2a44]/5 shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative h-64 lg:h-[500px] overflow-hidden">
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).width(800).height(600).url()}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-[#e66b00] text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>
          
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4 text-sm text-[#475569]">
              <span className="text-[#e66b00] font-medium">{post.category?.title}</span>
              <span className="w-1 h-1 bg-[#475569] rounded-full" />
              <span>{post.readTime} min read</span>
              <span className="w-1 h-1 bg-[#475569] rounded-full" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            
            <h2 className="font-bold text-2xl lg:text-3xl text-[#0f172a] mb-4 leading-tight group-hover:text-[#0f2a44] transition-colors">
              {post.title}
            </h2>
            
            <p className="text-[#475569] leading-relaxed mb-8 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.author?.image && (
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-[#eaf3fb]"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">{post.author?.name}</p>
                  <p className="text-xs text-[#475569]">{post.author?.role}</p>
                </div>
              </div>
              
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-[#e66b00] hover:text-[#ff7f00] transition-colors group/link"
              >
                Read Article
                <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}