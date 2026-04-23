// src/components/admin/product-form/BasicInfoSection.tsx
'use client'
import { ProductFormState } from './types'

interface BasicInfoSectionProps {
  form: ProductFormState
  errors: Record<string, string>
  updateField: <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => void
}

export function BasicInfoSection({
  form,
  errors,
  updateField,
}: BasicInfoSectionProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Basic Information
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Product Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              updateField('title', e.target.value)
            }
            placeholder="4 Bedroom Modern Maisonette"
            className="w-full rounded-xl border px-4 py-3"
          />

          {errors.title && (
            <p className="text-sm text-red-600 mt-2">
              {errors.title}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            SEO Slug
          </label>

          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              updateField('slug', e.target.value)
            }
            placeholder="4-bedroom-modern-maisonette"
            className="w-full rounded-xl border px-4 py-3"
          />

          <p className="text-xs text-slate-500 mt-2">
            tefetro.studio/products/{form.slug || 'your-slug'}
          </p>

          {errors.slug && (
            <p className="text-sm text-red-600 mt-2">
              {errors.slug}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Price (KES)
          </label>

          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              updateField('price', e.target.value)
            }
            placeholder="50000"
            className="w-full rounded-xl border px-4 py-3"
          />

          {errors.price && (
            <p className="text-sm text-red-600 mt-2">
              {errors.price}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-3 rounded-xl border px-4 py-3 w-full">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                updateField('featured', e.target.checked)
              }
            />

            <span className="text-sm font-medium text-slate-700">
              Featured Product
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Description
          </label>

          <textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              updateField('description', e.target.value)
            }
            placeholder="Professional architectural drawing package with floor plans, elevations and dimensions."
            className="w-full rounded-xl border px-4 py-3"
          />

          {errors.description && (
            <p className="text-sm text-red-600 mt-2">
              {errors.description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}