// src/components/admin/product-form/AddonsSection.tsx

'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Addon, LinkedAddon } from './types'

interface AddonsSectionProps {
  addons: Addon[]
  selected: string[]
  linkedAddons?: LinkedAddon[]
  priceOverrides: Record<string, string>
  documentFiles: Record<string, File | null>
  existingDocuments?: Record<string, string>

  onToggle: (addonId: string) => void
  onPriceChange: (
    addonId: string,
    value: string
  ) => void

  onDocumentChange: (
    addonId: string,
    file: File | null
  ) => void
}

function formatKES(value: number) {
  return `KES ${Number(value || 0).toLocaleString()}`
}

function getBadge(name: string) {
  const lower = name.toLowerCase()

  if (lower.includes('bill')) {
    return {
      text: 'Most Popular',
      icon: '📊',
      style:
        'bg-blue-100 text-blue-700',
    }
  }

  if (lower.includes('interior')) {
    return {
      text: 'Premium',
      icon: '✨',
      style:
        'bg-purple-100 text-purple-700',
    }
  }

  if (lower.includes('landscape')) {
    return {
      text: 'Villa Upgrade',
      icon: '🌿',
      style:
        'bg-green-100 text-green-700',
    }
  }

  if (lower.includes('structural')) {
    return {
      text: 'Engineering',
      icon: '🏗️',
      style:
        'bg-orange-100 text-orange-700',
    }
  }

  return {
    text: 'Upgrade',
    icon: '➕',
    style:
      'bg-slate-100 text-slate-700',
  }
}

function AddonPdfUploader({
  addonId,
  file,
  existingFile,
  onDocumentChange,
}: {
  addonId: string
  file: File | null
  existingFile?: string
  onDocumentChange: (
    addonId: string,
    file: File | null
  ) => void
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        acceptedFiles &&
        acceptedFiles.length > 0
      ) {
        onDocumentChange(
          addonId,
          acceptedFiles[0]
        )
      }
    },
    [
      addonId,
      onDocumentChange,
    ]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf':
        ['.pdf'],
    },
  })

  return (
    <div className="mt-5">
      <label className="block text-xs font-medium text-slate-500 mb-2">
        Add-on PDF Deliverable
      </label>

      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input
          {...getInputProps()}
        />

        <p className="text-sm font-medium text-slate-700">
          {isDragActive
            ? 'Drop PDF here'
            : 'Upload PDF or drag file'}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          BOQ, Interior Pack, Structural Notes etc.
        </p>
      </div>

      {file && (
        <div className="mt-3 rounded-xl border bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-700">
            New File
          </p>

          <p className="text-sm text-slate-600 truncate mt-1">
            {file.name}
          </p>
        </div>
      )}

      {!file &&
        existingFile && (
          <div className="mt-3 rounded-xl border bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">
              Existing File
            </p>

            <p className="text-sm text-slate-600 truncate mt-1">
              {existingFile}
            </p>
          </div>
        )}
    </div>
  )
}

export function AddonsSection({
  addons,
  selected,
  linkedAddons = [],
  priceOverrides,
  documentFiles,
  existingDocuments = {},
  onToggle,
  onPriceChange,
  onDocumentChange,
}: AddonsSectionProps) {
  const drawingAddons =
    addons.filter(
      (addon) =>
        addon.type ===
        'drawing'
    )

  const selectedItems =
    drawingAddons.filter(
      (addon) =>
        selected.includes(
          addon.id
        )
    )

  const total =
    selectedItems.reduce(
      (
        sum,
        addon
      ) => {
        const override =
          Number(
            priceOverrides[
              addon.id
            ]
          )

        const price =
          override > 0
            ? override
            : Number(
                addon.price
              )

        return (
          sum + price
        )
      },
      0
    )

  if (
    drawingAddons.length ===
    0
  ) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Drawing Add-ons
        </h2>

        <p className="text-sm text-slate-500 mt-3">
          No drawing add-ons available.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Drawing Add-ons
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Attach premium downloadable upgrades to this product.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <p className="text-xs text-slate-500">
            Selected Total
          </p>

          <p className="font-semibold text-slate-800">
            {formatKES(
              total
            )}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {drawingAddons.map(
          (addon) => {
            const linked =
              linkedAddons.some(
                (
                  item
                ) =>
                  item.addon_id ===
                  addon.id
              )

            const isSelected =
              selected.includes(
                addon.id
              ) || linked

            const badge =
              getBadge(
                addon.name
              )

            const override =
              Number(
                priceOverrides[
                  addon.id
                ]
              )

            const displayPrice =
              override > 0
                ? override
                : Number(
                    addon.price
                  )

            return (
              <div
                key={
                  addon.id
                }
                className={`rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-[#0F4C5C] bg-[#f4fafb]'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${badge.style}`}
                    >
                      <span>
                        {
                          badge.icon
                        }
                      </span>
                      {
                        badge.text
                      }
                    </span>

                    <h3 className="font-semibold text-slate-800 mt-3">
                      {
                        addon.name
                      }
                    </h3>

                    {addon.description && (
                      <p className="text-sm text-slate-500 mt-2">
                        {
                          addon.description
                        }
                      </p>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      isSelected
                    }
                    onChange={() =>
                      onToggle(
                        addon.id
                      )
                    }
                    className="mt-1 h-5 w-5"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Selling Price
                    </p>

                    <p className="font-bold text-lg text-slate-800">
                      {formatKES(
                        displayPrice
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onToggle(
                        addon.id
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      isSelected
                        ? 'bg-[#0F4C5C] text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected
                      ? 'Included'
                      : 'Add'}
                  </button>
                </div>

                <div className="mt-5">
                  <label className="block text-xs text-slate-500 mb-2">
                    Price Override (KES)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      priceOverrides[
                        addon.id
                      ] || ''
                    }
                    onChange={(e) =>
                      onPriceChange(
                        addon.id,
                        e.target
                          .value
                      )
                    }
                    placeholder={String(
                      addon.price
                    )}
                    className="w-full rounded-xl border px-4 py-2"
                  />
                </div>

                {isSelected && (
                  <AddonPdfUploader
                    addonId={
                      addon.id
                    }
                    file={
                      documentFiles[
                        addon.id
                      ] || null
                    }
                    existingFile={
                      existingDocuments[
                        addon.id
                      ]
                    }
                    onDocumentChange={
                      onDocumentChange
                    }
                  />
                )}
              </div>
            )
          }
        )}
      </div>
    </section>
  )
}