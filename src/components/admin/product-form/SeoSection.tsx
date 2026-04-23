// src/components/admin/product-form/SeoSection.tsx

'use client'

import { ProductFormState } from './types'

interface SeoSectionProps {
  form: ProductFormState
  errors: Record<string, string>
  updateField: <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => void
}

function scoreTitle(
  title: string,
  keyword: string
) {
  let score = 0

  if (title.length >= 45 && title.length <= 70)
    score += 35

  if (
    keyword &&
    title
      .toLowerCase()
      .includes(keyword.toLowerCase())
  )
    score += 40

  if (
    title.toLowerCase().includes(
      'tefetro'
    )
  )
    score += 25

  return Math.min(score, 100)
}

function scoreDescription(
  desc: string,
  keyword: string
) {
  let score = 0

  if (
    desc.length >= 120 &&
    desc.length <= 160
  )
    score += 40

  if (
    keyword &&
    desc
      .toLowerCase()
      .includes(keyword.toLowerCase())
  )
    score += 35

  if (
    desc.includes('download') ||
    desc.includes('plan') ||
    desc.includes('floor')
  )
    score += 25

  return Math.min(score, 100)
}

function scoreSlug(slug: string) {
  let score = 0

  if (slug.length >= 8) score += 30
  if (slug.includes('-')) score += 30
  if (!slug.includes('_')) score += 20
  if (!slug.includes(' ')) score += 20

  return Math.min(score, 100)
}

export function SeoSection({
  form,
  errors,
  updateField,
}: SeoSectionProps) {
  const keyword =
    (form as any).focusKeyword || ''

  const titleScore = scoreTitle(
    form.metaTitle,
    keyword
  )

  const descScore =
    scoreDescription(
      form.metaDescription,
      keyword
    )

  const slugScore = scoreSlug(
    form.slug
  )

  function generateSeo() {
    const autoKeyword =
      `${form.bedrooms || ''} bedroom ${
        form.subcategory
      } plan kenya`.trim()

    updateField(
      'metaTitle',
      `${form.title} Plan Kenya | Tefetro Studios` as any
    )

    updateField(
      'metaDescription',
      `Buy ${form.title.toLowerCase()} with floor plans, elevations, dimensions and instant download from Tefetro Studios.` as any
    )

    updateField(
      'slug',
      form.slug || autoKeyword
        .toLowerCase()
        .replace(/\s+/g, '-')
    )

    ;(form as any).focusKeyword =
      autoKeyword
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            SEO Control Center
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Optimize this product for Google, Bing, social media and AI search.
          </p>
        </div>

        <button
          type="button"
          onClick={generateSeo}
          className="px-4 py-2 rounded-xl bg-[#0F4C5C] text-white hover:opacity-90"
        >
          Auto Generate SEO
        </button>
      </div>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Focus Keyword
          </label>

          <input
            type="text"
            defaultValue={
              (form as any).focusKeyword || ''
            }
            onChange={(e) =>
              ((form as any).focusKeyword =
                e.target.value)
            }
            placeholder="4 bedroom maisonette plan kenya"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Secondary Keywords
          </label>

          <input
            type="text"
            placeholder="house plan kenya, modern maisonette design"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>
      </div>

      {/* Meta Title */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-600">
            Meta Title
          </label>

          <span className="text-xs font-semibold text-slate-500">
            Score {titleScore}/100
          </span>
        </div>

        <input
          type="text"
          value={form.metaTitle}
          onChange={(e) =>
            updateField(
              'metaTitle',
              e.target.value
            )
          }
          className="w-full rounded-xl border px-4 py-3"
        />

        <p className="text-xs text-slate-500 mt-2">
          Ideal length: 50–70 characters
        </p>

        {errors.metaTitle && (
          <p className="text-sm text-red-600 mt-2">
            {errors.metaTitle}
          </p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-600">
            Meta Description
          </label>

          <span className="text-xs font-semibold text-slate-500">
            Score {descScore}/100
          </span>
        </div>

        <textarea
          rows={4}
          value={form.metaDescription}
          onChange={(e) =>
            updateField(
              'metaDescription',
              e.target.value
            )
          }
          className="w-full rounded-xl border px-4 py-3"
        />

        <p className="text-xs text-slate-500 mt-2">
          Ideal length: 120–160 characters
        </p>

        {errors.metaDescription && (
          <p className="text-sm text-red-600 mt-2">
            {errors.metaDescription}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-600">
            URL Slug
          </label>

          <span className="text-xs font-semibold text-slate-500">
            Score {slugScore}/100
          </span>
        </div>

        <input
          type="text"
          value={form.slug}
          onChange={(e) =>
            updateField(
              'slug',
              e.target.value
            )
          }
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      {/* Indexing */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="rounded-xl border p-4 flex gap-3">
          <input
            type="checkbox"
            defaultChecked
          />
          <span className="text-sm">
            Index this page
          </span>
        </label>

        <label className="rounded-xl border p-4 flex gap-3">
          <input
            type="checkbox"
            defaultChecked
          />
          <span className="text-sm">
            Follow page links
          </span>
        </label>
      </div>

      {/* Search Preview */}
      <div className="rounded-xl border bg-slate-50 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
          Google Search Preview
        </p>

        <p className="text-blue-700 text-sm break-all">
          https://tefetro.studio/products/
          {form.slug || 'your-product-slug'}
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mt-1">
          {form.metaTitle ||
            form.title ||
            'Product Title'}
        </h3>

        <p className="text-sm text-slate-600 mt-1">
          {form.metaDescription ||
            form.description ||
            'Description preview will appear here.'}
        </p>
      </div>
    </section>
  )
}