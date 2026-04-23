// src/components/admin/product-form/ProductForm.tsx

'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ProductFormProps,
  ProductFormState,
} from './types'

import {
  buildInitialState,
  buildPayload,
  makeSlug,
  validateProductForm,
} from './helpers'

import { CATEGORY_MAP } from './constants'

import { BasicInfoSection } from './BasicInfoSection'
import { SpecsSection } from './SpecsSection'
import { SeoSection } from './SeoSection'
import { SubmitBar } from './SubmitBar'
import { DrawingUploadSection } from './DrawingUploadSection'
import { ElevationUploadSection } from './ElevationUploadSection'
import { AddonsSection } from './AddonsSection'
import { ServicesSection } from './ServicesSection'
import { PricingSection } from './PricingSection'

export function ProductForm({
  mode,
  product,
  addons,
  linkedAddons = [],
}: ProductFormProps) {
  const router = useRouter()

  const [form, setForm] =
    useState<ProductFormState>(
      buildInitialState(product)
    )

  const [errors, setErrors] =
    useState<Record<
      string,
      string
    >>({})

  const [submitting, setSubmitting] =
    useState(false)

  const [drawingFile, setDrawingFile] =
    useState<File | null>(null)

  const [elevationFiles, setElevationFiles] =
    useState<File[]>([])

  const [selectedAddons, setSelectedAddons] =
    useState<string[]>(
      linkedAddons.map(
        (item) =>
          item.addon_id
      )
    )

  const [priceOverrides, setPriceOverrides] =
    useState<Record<
      string,
      string
    >>({})

  const [documentFiles, setDocumentFiles] =
    useState<Record<
      string,
      File | null
    >>({})

  const existingDocuments =
    linkedAddons.reduce(
      (acc, item) => {
        if (
          item.document_path
        ) {
          acc[
            item.addon_id
          ] =
            item.document_path
        }
        return acc
      },
      {} as Record<
        string,
        string
      >
    )

  const subcategories =
    useMemo(() => {
      return (
        CATEGORY_MAP[
          form.category
        ] || []
      )
    }, [
      form.category,
    ])

  function updateField<
    K extends keyof ProductFormState
  >(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => {
      const next = {
        ...prev,
        [key]: value,
      }

      if (
        key === 'title'
      ) {
        const generated =
          makeSlug(
            String(
              value
            )
          )

        if (
          !prev.slug ||
          prev.slug ===
            makeSlug(
              prev.title
            )
        ) {
          next.slug =
            generated
        }
      }

      if (
        key ===
        'category'
      ) {
        next.subcategory =
          CATEGORY_MAP[
            value as keyof typeof CATEGORY_MAP
          ]?.[0] ||
          ''
      }

      return next
    })

    setErrors(
      (prev) => ({
        ...prev,
        [key]: '',
      })
    )
  }

  function toggleAddon(
    addonId: string
  ) {
    setSelectedAddons(
      (prev) =>
        prev.includes(
          addonId
        )
          ? prev.filter(
              (
                id
              ) =>
                id !==
                addonId
            )
          : [
              ...prev,
              addonId,
            ]
    )
  }

  function updateAddonPrice(
    addonId: string,
    value: string
  ) {
    setPriceOverrides(
      (prev) => ({
        ...prev,
        [addonId]:
          value,
      })
    )
  }

  function updateDocumentFile(
    addonId: string,
    file: File | null
  ) {
    setDocumentFiles(
      (prev) => ({
        ...prev,
        [addonId]:
          file,
      })
    )
  }

  async function uploadFile(
    file: File,
    folder: string
  ) {
    const data =
      new FormData()

    data.append(
      'file',
      file
    )
    data.append(
      'folder',
      folder
    )

    const res =
      await fetch(
        '/api/admin/upload',
        {
          method:
            'POST',
          body: data,
        }
      )

    if (!res.ok)
      throw new Error(
        'Upload failed'
      )

    const json =
      await res.json()

    return json.path as string
  }

  async function onSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const validation =
      validateProductForm(
        form
      )

    if (
      Object.keys(
        validation
      ).length > 0
    ) {
      setErrors(
        validation
      )
      return
    }

    try {
      setSubmitting(
        true
      )

      let drawingPath =
        product?.file_path ||
        null

      if (
        drawingFile
      ) {
        drawingPath =
          await uploadFile(
            drawingFile,
            'drawings'
          )
      }

      let elevationPaths =
        product?.elevation_images ||
        []

      if (
        elevationFiles.length >
        0
      ) {
        elevationPaths =
          await Promise.all(
            elevationFiles.map(
              (
                file
              ) =>
                uploadFile(
                  file,
                  'elevations'
                )
            )
          )
      }

      const addonDocuments:
        Record<
          string,
          string
        > = {}

      for (const addonId of selectedAddons) {
        if (
          documentFiles[
            addonId
          ]
        ) {
          addonDocuments[
            addonId
          ] =
            await uploadFile(
              documentFiles[
                addonId
              ]!,
              'addons'
            )
        } else if (
          existingDocuments[
            addonId
          ]
        ) {
          addonDocuments[
            addonId
          ] =
            existingDocuments[
              addonId
            ]
        }
      }

      const payload = {
        ...buildPayload(
          form
        ),
        file_path:
          drawingPath,
        elevation_images:
          elevationPaths,
        selectedAddons,
        priceOverrides,
        addonDocuments,
      }

      const endpoint =
        mode ===
        'create'
          ? '/api/admin/products'
          : `/api/admin/products/${product?.id}`

      const method =
        mode ===
        'create'
          ? 'POST'
          : 'PATCH'

      const res =
        await fetch(
          endpoint,
          {
            method,
            headers:
              {
                'Content-Type':
                  'application/json',
              },
            body: JSON.stringify(
              payload
            ),
          }
        )

      if (!res.ok)
        throw new Error(
          'Save failed'
        )

      router.push(
        '/admin/products'
      )

      router.refresh()
    } catch (error) {
      console.error(
        error
      )

      alert(
        'Unable to save product.'
      )
    } finally {
      setSubmitting(
        false
      )
    }
  }

  return (
      <form
        id="product-form"
        onSubmit={onSubmit}
        className="space-y-6"
      >
      <BasicInfoSection
        form={form}
        errors={
          errors
        }
        updateField={
          updateField
        }
      />

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Classification
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={
              form.category
            }
            onChange={(
              e
            ) =>
              updateField(
                'category',
                e.target
                  .value as any
              )
            }
            className="rounded-xl border px-4 py-3"
          >
            {Object.keys(
              CATEGORY_MAP
            ).map(
              (
                item
              ) => (
                <option
                  key={
                    item
                  }
                >
                  {
                    item
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              form.subcategory
            }
            onChange={(
              e
            ) =>
              updateField(
                'subcategory',
                e.target
                  .value
              )
            }
            className="rounded-xl border px-4 py-3"
          >
            {subcategories.map(
              (
                item
              ) => (
                <option
                  key={
                    item
                  }
                >
                  {
                    item
                  }
                </option>
              )
            )}
          </select>
        </div>
      </section>

      <PricingSection
        form={form}
        updateField={
          updateField
        }
      />

      <SpecsSection
        form={form}
        errors={
          errors
        }
        updateField={
          updateField
        }
      />

      <DrawingUploadSection
        file={
          drawingFile
        }
        existingFile={
          product?.file_path
        }
        onFileSelect={
          setDrawingFile
        }
      />

      <ElevationUploadSection
        files={
          elevationFiles
        }
        existingImages={
          product?.elevation_images ||
          []
        }
        onFilesChange={
          setElevationFiles
        }
      />

      <AddonsSection
        addons={addons}
        selected={
          selectedAddons
        }
        linkedAddons={
          linkedAddons
        }
        priceOverrides={
          priceOverrides
        }
        documentFiles={
          documentFiles
        }
        existingDocuments={
          existingDocuments
        }
        onToggle={
          toggleAddon
        }
        onPriceChange={
          updateAddonPrice
        }
        onDocumentChange={
          updateDocumentFile
        }
      />

      <ServicesSection
        addons={addons}
        selected={
          selectedAddons
        }
        linkedAddons={
          linkedAddons
        }
        onToggle={
          toggleAddon
        }
      />

      <SeoSection
        form={form}
        errors={
          errors
        }
        updateField={
          updateField
        }
      />

      <SubmitBar
        mode={mode}
        submitting={
          submitting
        }
      />
    </form>
  )
}