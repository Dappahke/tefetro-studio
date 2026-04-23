// src/sanity/schemaTypes/postType.ts - COMPLETE FIXED VERSION
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',        // This MUST match 'post' in structure.ts
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().max(60).warning('SEO: Keep under 60 chars for optimal display'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160).warning('SEO: Keep under 160 chars for meta descriptions'),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modifiedAt',
      type: 'datetime',
      description: 'When article was last updated',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as featured article for homepage display',
    }),
    defineField({
      name: 'readTime',
      type: 'number',
      description: 'Estimated read time in minutes (auto-calculated if empty)',
    }),
    // SEO Fields
    defineField({
      name: 'metaTitle',
      type: 'string',
      title: 'SEO Title',
      description: 'Override the default title tag (max 60 chars)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      title: 'SEO Description',
      rows: 2,
      description: 'Override the default meta description (max 160 chars)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'SEO keywords for the article',
    }),
    defineField({
      name: 'canonicalUrl',
      type: 'url',
      title: 'Canonical URL',
      description: 'Override canonical if this is a republished article',
    }),
    defineField({
      name: 'ogImage',
      type: 'image',
      title: 'Social Share Image',
      description: '1200x630px recommended for Open Graph/Twitter Cards',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'noIndex',
      type: 'boolean',
      title: 'No Index',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
    // Content
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    // Guest Post Fields
    defineField({
      name: 'isGuestPost',
      type: 'boolean',
      initialValue: false,
      description: 'This is a guest contribution',
    }),
    defineField({
      name: 'guestAuthor',
      type: 'object',
      hidden: ({ parent }) => !parent?.isGuestPost,
      fields: [
        defineField({ name: 'fullName', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'email', type: 'string', validation: (Rule) => Rule.required().email() }),
        defineField({ name: 'profession', type: 'string' }),
        defineField({ name: 'company', type: 'string' }),
        defineField({ name: 'website', type: 'url' }),
        defineField({ name: 'bio', type: 'text', rows: 3 }),
        defineField({ name: 'headshot', type: 'image', options: { hotspot: true } }),
      ],
    }),
    // Status
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Review', value: 'pending' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
      featured: 'featured',
    },
    prepare({ title, author, media, status, featured }) {
      const statusEmoji = {
        draft: '📝',
        pending: '⏳',
        published: '✅',
        archived: '📦',
      }[status as string] || '📝'
      
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${statusEmoji} ${status} • by ${author || 'Unknown'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})