// src/lib/schema.ts
import { urlFor } from '@/sanity/lib/image'

export function generateBlogListingSchema(
  posts: any[],
  featured: any
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',

    name: 'Tefetro Studios Blog',

    description:
      'Architectural insights, house plans and construction guidance from Tefetro Studios.',

    url: 'https://tefetro.studio/blog',

    publisher: {
      '@type': 'Organization',
      name: 'Tefetro Studios',

      logo: {
        '@type': 'ImageObject',
        url:
          'https://tefetro.studio/images/tefetro-logo.png',
      },
    },

    blogPost: (posts || []).map(
      (post) => ({
        '@type':
          'BlogPosting',

        headline:
          post.title,

        description:
          post.excerpt,

        url: `https://tefetro.studio/blog/${
          post.slug?.current ||
          post.slug
        }`,

        datePublished:
          post.publishedAt,

        author: {
          '@type':
            'Person',
          name:
            post.author
              ?.name ||
            'Tefetro Studios',
        },
      })
    ),
  }
}

export function generateArticleSchema(
  post: any
) {
  const isGuest =
    post.isGuestPost &&
    post.guestAuthor

  const author =
    isGuest
      ? {
          '@type':
            'Person',

          name: post
            .guestAuthor
            ?.fullName,

          jobTitle:
            post
              .guestAuthor
              ?.profession,

          description:
            post
              .guestAuthor
              ?.bio,

          url: post
            .guestAuthor
            ?.website,
        }
      : {
          '@type':
            'Person',

          name:
            post.author
              ?.name,

          url: `https://tefetro.studio/authors/${
            post.author
              ?.slug ||
            ''
          }`,

          jobTitle:
            post.author
              ?.role,

          worksFor: {
            '@type':
              'Organization',
            name:
              'Tefetro Studios',
          },
        }

  const imageUrl =
    post.mainImage
      ? urlFor(
          post.mainImage
        )
          .width(1200)
          .height(630)
          .url()
      : undefined

  return {
    '@context':
      'https://schema.org',

    '@type':
      'BlogPosting',

    headline:
      post.title,

    description:
      post.excerpt,

    image:
      imageUrl,

    datePublished:
      post.publishedAt,

    dateModified:
      post.modifiedAt ||
      post.publishedAt,

    author,

    publisher: {
      '@type':
        'Organization',

      name:
        'Tefetro Studios',

      logo: {
        '@type':
          'ImageObject',

        url:
          'https://tefetro.studio/images/tefetro-logo.png',

        width: 600,
        height: 60,
      },
    },

    mainEntityOfPage:
      {
        '@type':
          'WebPage',

        '@id': `https://tefetro.studio/blog/${
          post.slug ||
          post.slug
            ?.current ||
          ''
        }`,
      },

    articleSection:
      post.category
        ?.title,

    keywords:
      Array.isArray(
        post.keywords
      )
        ? post.keywords.join(
            ', '
          )
        : post.keywords,

    wordCount:
      post.wordCount,
  }
}