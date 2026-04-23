// src/components/blog/RelatedArticles.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'

interface Props {
  posts: any[]
}

export function RelatedArticles({
  posts,
}: Props) {
  if (
    !posts ||
    posts.length === 0
  ) {
    return null
  }

  return (
    <section className="bg-[#eaf3fb] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-10 text-2xl font-bold text-[#0f172a]">
          Continue Reading
        </h3>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map(
            (post: any) => {
              const slug =
                post?.slug || ''

              return (
                <Link
                  key={
                    post._id
                  }
                  href={`/blog/${slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#0f2a44]/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(
                          post.mainImage
                        )
                          .width(700)
                          .height(500)
                          .url()}
                        alt={
                          post.title
                        }
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                      {post.publishedAt && (
                        <span>
                          {formatDate(
                            post.publishedAt
                          )}
                        </span>
                      )}

                      {post.readTime && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[#475569]" />

                          <span>
                            {
                              post.readTime
                            }{' '}
                            min read
                          </span>
                        </>
                      )}
                    </div>

                    <h4 className="line-clamp-2 text-lg font-bold leading-snug text-[#0f172a] transition-colors group-hover:text-[#0f2a44]">
                      {
                        post.title
                      }
                    </h4>
                  </div>
                </Link>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}