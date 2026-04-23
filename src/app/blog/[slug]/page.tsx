// src/app/blog/[slug]/page.tsx (UPDATED FIXED)
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { ArticleHeader } from '@/components/blog/ArticleHeader'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { ArticleSidebar } from '@/components/blog/ArticleSidebar'
import { RelatedArticles } from '@/components/blog/RelatedArticles'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { generateArticleSchema } from '@/lib/schema'

interface Props {
  params: { slug: string }
}

const ARTICLE_QUERY = `
  *[_type == "post" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    mainImage,
    publishedAt,
    modifiedAt,
    readTime,
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    ogImage,
    noIndex,
    isGuestPost,
    guestAuthor,
    "category": categories[0]->{
      title,
      "slug": slug.current
    },
    "author": author->{
      name,
      "slug": slug.current,
      image,
      role,
      bio,
      socialLinks
    },
    "tags": tags[]->{
      title,
      "slug": slug.current
    },
    "related": *[
      _type == "post" &&
      categories[0]._ref == ^.categories[0]._ref &&
      _id != ^._id &&
      status == "published"
    ] | order(publishedAt desc)[0..2] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      readTime
    }
  }
`

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const post = await client.fetch(
    ARTICLE_QUERY,
    { slug: params.slug }
  )

  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  const ogImageUrl = post.ogImage
    ? urlFor(post.ogImage)
        .width(1200)
        .height(630)
        .url()
    : post.mainImage
    ? urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .url()
    : null

  const authorName = post.isGuestPost
    ? post.guestAuthor?.fullName
    : post.author?.name

  return {
    title:
      post.metaTitle || post.title,
    description:
      post.metaDescription ||
      post.excerpt,
    keywords:
      post.keywords || [],
    authors: authorName
      ? [{ name: authorName }]
      : [],
    robots: post.noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title:
        post.metaTitle ||
        post.title,
      description:
        post.metaDescription ||
        post.excerpt,
      type: 'article',
      url: `https://tefetro.studio/blog/${params.slug}`,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      publishedTime:
        post.publishedAt,
      modifiedTime:
        post.modifiedAt ||
        post.publishedAt,
      authors: authorName
        ? [authorName]
        : [],
      section:
        post.category?.title,
    },
    twitter: {
      card:
        'summary_large_image',
      title:
        post.metaTitle ||
        post.title,
      description:
        post.metaDescription ||
        post.excerpt,
      images: ogImageUrl
        ? [ogImageUrl]
        : [],
    },
    alternates: {
      canonical:
        post.canonicalUrl ||
        `https://tefetro.studio/blog/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const slugs =
    await client.fetch(`
      *[_type == "post" && status == "published"].slug.current
    `)

  return slugs.map(
    (slug: string) => ({
      slug,
    })
  )
}

export default async function ArticlePage({
  params,
}: Props) {
  const post = await client.fetch(
    ARTICLE_QUERY,
    { slug: params.slug }
  )

  if (!post) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateArticleSchema(
              post
            )
          ),
        }}
      />

      <ReadingProgress />

      <article className="min-h-screen bg-white">
        <ArticleHeader
          post={post}
        />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <ArticleContent
              content={
                post.body || []
              }
            />

            <ArticleSidebar
              post={post}
            />
          </div>
        </div>

        <ShareButtons
          title={post.title}
          url={`https://tefetro.studio/blog/${params.slug}`}
        />

        <RelatedArticles
          posts={
            post.related ||
            []
          }
        />
      </article>
    </>
  )
}