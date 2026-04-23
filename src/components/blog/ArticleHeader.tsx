// src/components/blog/ArticleHeader.tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/blog/Breadcrumb'

interface Props {
  post: any
}

export function ArticleHeader({
  post,
}: Props) {
  const category =
    post?.category

  const author =
    post?.author

  const categoryTitle =
    category?.title ||
    'Blog'

  const categorySlug =
    category?.slug || ''

  return (
    <header className="border-b border-[#0f2a44]/5 bg-[#eaf3fb]">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
        <Breadcrumb
          items={[
            {
              label: 'Blog',
              href: '/blog',
            },
            {
              label:
                categoryTitle,
              href: `/blog?category=${categorySlug}`,
            },
            {
              label:
                post.title,
              href: '#',
            },
          ]}
        />

        <div className="mt-8 max-w-4xl">
          {/* Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#e66b00] px-3 py-1 text-sm font-medium text-white">
              {categoryTitle}
            </span>

            {post.readTime && (
              <span className="text-sm text-[#475569]">
                {post.readTime}{' '}
                min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-[#0f172a] lg:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-[#475569] lg:text-xl">
              {post.excerpt}
            </p>
          )}

          {/* Author + Date */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-4">
                {author.image && (
                  <Image
                    src={urlFor(
                      author.image
                    )
                      .width(120)
                      .height(120)
                      .url()}
                    alt={
                      author.name ||
                      'Author'
                    }
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-white object-cover shadow-md"
                  />
                )}

                <div>
                  <p className="font-semibold text-[#0f172a]">
                    {author.name}
                  </p>

                  {author.role && (
                    <p className="text-sm text-[#475569]">
                      {author.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#475569]">
              {post.publishedAt && (
                <time
                  dateTime={
                    post.publishedAt
                  }
                >
                  {formatDate(
                    post.publishedAt
                  )}
                </time>
              )}

              {post.modifiedAt &&
                post.modifiedAt !==
                  post.publishedAt && (
                  <>
                    <span>
                      •
                    </span>

                    <span>
                      Updated{' '}
                      {formatDate(
                        post.modifiedAt
                      )}
                    </span>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.mainImage && (
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={urlFor(
                post.mainImage
              )
                .width(1600)
                .height(686)
                .url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}
    </header>
  )
}