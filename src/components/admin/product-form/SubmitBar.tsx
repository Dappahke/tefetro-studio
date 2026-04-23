'use client'

import { ProductFormMode } from './types'

interface SubmitBarProps {
  mode: ProductFormMode
  submitting: boolean
}

export function SubmitBar({
  mode,
  submitting,
}: SubmitBarProps) {
  const isCreate = mode === 'create'

  const buttonText = submitting
    ? isCreate
      ? 'Creating Product...'
      : 'Saving Changes...'
    : isCreate
    ? 'Create Product'
    : 'Save Changes'

  function handleSubmit() {
    const form =
      document.getElementById(
        'product-form'
      ) as HTMLFormElement | null

    if (form) {
      form.requestSubmit()
    }
  }

  return (
    <section className="sticky bottom-4 z-30 pt-4">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Product Manager
            </p>

            <h3 className="font-bold text-slate-800 text-lg">
              {isCreate
                ? 'Ready to Publish'
                : 'Ready to Update'}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-[#0F4C5C] text-white font-semibold hover:bg-[#123d49] disabled:opacity-60 min-w-[220px]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  )
}