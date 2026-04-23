// src/components/admin/product-form/SpecsSection.tsx
'use client'

import { ProductFormState } from './types'

interface SpecsSectionProps {
  form: ProductFormState
  errors: Record<string, string>
  updateField: <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => void
}

export function SpecsSection({
  form,
  errors,
  updateField,
}: SpecsSectionProps) {
  const fields = [
    {
      key: 'bedrooms',
      label: 'Bedrooms',
      placeholder: '4',
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms',
      placeholder: '3',
    },
    {
      key: 'floors',
      label: 'Floors',
      placeholder: '2',
    },
    {
      key: 'plinth_area',
      label: 'Plinth Area (sqm)',
      placeholder: '240',
    },
    {
      key: 'length',
      label: 'Length (m)',
      placeholder: '18',
    },
    {
      key: 'width',
      label: 'Width (m)',
      placeholder: '14',
    },
  ] as const

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Building Specifications
      </h2>

      <div className="grid md:grid-cols-3 gap-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              {field.label}
            </label>

            <input
              type="number"
              value={form[field.key]}
              onChange={(e) =>
                updateField(field.key, e.target.value)
              }
              placeholder={field.placeholder}
              className="w-full rounded-xl border px-4 py-3"
            />

            {errors[field.key] && (
              <p className="text-sm text-red-600 mt-2">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 border p-4">
        <p className="text-sm text-slate-600">
          Add accurate dimensions and room counts to improve
          product trust, filtering, and search visibility.
        </p>
      </div>
    </section>
  )
}