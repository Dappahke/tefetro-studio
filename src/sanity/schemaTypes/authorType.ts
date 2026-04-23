// src/sanity/schemaTypes/authorType.ts (Enhanced with SEO + Social)
import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'e.g. "Lead Architect", "Construction Expert"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
      description: 'Author bio for profile pages and article footers',
    }),
    defineField({
      name: 'isGuestContributor',
      type: 'boolean',
      initialValue: false,
      description: 'External contributor (not Tefetro team member)',
    }),
    defineField({
      name: 'verified',
      type: 'boolean',
      initialValue: false,
      description: 'Show verified badge on articles',
    }),
    // Social Links for Schema.org
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Website', value: 'website' },
                ],
              },
            }),
            defineField({ name: 'url', type: 'url', validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
    // SEO
    defineField({
      name: 'metaDescription',
      type: 'text',
      rows: 2,
      description: 'SEO description for author profile page',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})