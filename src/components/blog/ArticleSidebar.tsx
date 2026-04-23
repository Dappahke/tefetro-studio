// src/components/blog/ArticleSidebar.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  post: any
}

export function ArticleSidebar({
  post,
}: Props) {
  const author = post?.author
  const tags = post?.tags || []

  const authorSlug =
    author?.slug || ''

  const authorName =
    typeof author?.name ===
    'string'
      ? author.name
      : 'Author'

  const authorRole =
    typeof author?.role ===
    'string'
      ? author.role
      : ''

  const authorBio =
    typeof author?.bio ===
    'string'
      ? author.bio
      : ''

  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      {/* Author Card */}
      {author && (
        <div className="rounded-2xl border border-[#0f2a44]/5 bg-[#eaf3fb] p-6">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#475569]">
            About the Author
          </h4>

          <div className="mb-4 flex items-center gap-4">
            {author.image && (
              <Image
                src={urlFor(
                  author.image
                )
                  .width(120)
                  .height(120)
                  .url()}
                alt={
                  authorName
                }
                width={64}
                height={64}
                className="rounded-full border-2 border-white object-cover"
              />
            )}

            <div>
              <p className="font-semibold text-[#0f172a]">
                {authorName}
              </p>

              {authorRole && (
                <p className="text-sm text-[#475569]">
                  {authorRole}
                </p>
              )}
            </div>
          </div>

          {authorBio && (
            <p className="mb-4 text-sm leading-relaxed text-[#475569]">
              {authorBio}
            </p>
          )}

          {authorSlug && (
            <Link
              href={`/authors/${authorSlug}`}
              className="text-sm font-medium text-[#e66b00] transition-colors hover:text-[#ff7f00]"
            >
              View all articles →
            </Link>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-2xl border border-[#0f2a44]/5 bg-white p-6">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#475569]">
            Topics
          </h4>

          <div className="flex flex-wrap gap-2">
            {tags.map(
              (
                tag: any,
                index: number
              ) => {
                const tagSlug =
                  typeof tag?.slug ===
                  'string'
                    ? tag.slug
                    : ''

                const tagTitle =
                  typeof tag?.title ===
                  'string'
                    ? tag.title
                    : 'Topic'

                return (
                  <Link
                    key={
                      tagSlug ||
                      index
                    }
                    href={`/blog/tag/${tagSlug}`}
                    className="rounded-full bg-[#eaf3fb] px-3 py-1.5 text-sm text-[#0f2a44] transition-colors hover:bg-[#e66b00] hover:text-white"
                  >
                    {tagTitle}
                  </Link>
                )
              }
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] p-6 text-white">
        <h4 className="mb-2 text-lg font-bold">
          Need a Custom Plan?
        </h4>

        <p className="mb-4 text-sm text-white/70">
          Get architectural
          drawings tailored
          to your needs and
          budget.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-[#e66b00] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ff7f00]"
        >
          Get Quote

          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </aside>
  )
}