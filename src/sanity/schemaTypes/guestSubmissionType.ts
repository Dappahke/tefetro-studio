// src/sanity/schemaTypes/guestSubmissionType.ts - COMPLETE NEW FILE
import { defineField, defineType } from 'sanity'

export const guestSubmissionType = defineType({
  name: 'guestSubmission',
  title: 'Guest Blog Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      options: {
        list: [
          { title: '⏳ New Submission', value: 'pending' },
          { title: '👀 Under Review', value: 'reviewing' },
          { title: '📝 Needs Revision', value: 'revision' },
          { title: '✅ Approved', value: 'approved' },
          { title: '❌ Rejected', value: 'rejected' },
          { title: '🚀 Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    // Author Info
    defineField({
      name: 'fullName',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'profession',
      type: 'string',
      description: 'e.g. "Architect", "Civil Engineer", "Property Developer"',
    }),
    defineField({
      name: 'company',
      type: 'string',
    }),
    defineField({
      name: 'website',
      type: 'url',
      description: 'Portfolio or company website (for backlink)',
    }),
    defineField({
      name: 'authorBio',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(300),
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    // Article Content
    defineField({
      name: 'articleTitle',
      type: 'string',
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Design', value: 'design' },
          { title: 'Construction', value: 'construction' },
          { title: 'Investment', value: 'investment' },
          { title: 'Regulations', value: 'regulations' },
          { title: 'Sustainability', value: 'sustainability' },
          { title: 'Interiors', value: 'interiors' },
          { title: 'Landscaping', value: 'landscaping' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'For preview cards and SEO (50-160 chars)',
      validation: (Rule) => Rule.required().min(50).max(300),
    }),
    defineField({
      name: 'articleContent',
      type: 'text',
      rows: 20,
      description: 'Full article content. Markdown supported.',
      validation: (Rule) => Rule.required().min(500),
    }),
    defineField({
      name: 'wordCount',
      type: 'number',
      description: 'Auto-calculated',
    }),
    // Admin
    defineField({
      name: 'submittedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'reviewedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'adminNotes',
      type: 'text',
      rows: 4,
      description: 'Internal notes for editorial team',
    }),
    defineField({
      name: 'convertedToPost',
      type: 'reference',
      to: { type: 'post' },
      description: 'Link to published post if approved',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'articleTitle',
      author: 'fullName',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({ title, author, status, submittedAt }) {
      const statusMap: Record<string, string> = {
        pending: '⏳',
        reviewing: '👀',
        revision: '📝',
        approved: '✅',
        rejected: '❌',
        published: '🚀',
      }
      return {
        title: `${statusMap[status as string] || '⏳'} ${title}`,
        subtitle: `by ${author} • ${submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Unknown date'}`,
      }
    },
  },
})