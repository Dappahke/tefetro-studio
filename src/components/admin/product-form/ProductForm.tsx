'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Image as ImageIcon,
  FileText,
  Package,
  Ruler,
  Settings,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { ProductFormProps, ProductFormState } from './types'

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
import { DrawingUploadSection } from './DrawingUploadSection'
import { ElevationUploadSection } from './ElevationUploadSection'
import { AddonsSection } from './AddonsSection'
import { ServicesSection } from './ServicesSection'
import { PricingSection } from './PricingSection'

import { cn } from '@/lib/utils'

const supabase = createClient()

export function ProductForm({
  mode,
  product,
  addons,
  linkedAddons = [],
}: ProductFormProps) {
  const router = useRouter()

  const [activeSection, setActiveSection] = useState('basic')
  const [showPreview, setShowPreview] = useState(false)

  const [form, setForm] = useState<ProductFormState>(
    buildInitialState(product)
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const [drawingFile, setDrawingFile] = useState<File | null>(null)
  const [elevationFiles, setElevationFiles] = useState<File[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    linkedAddons.map((item) => item.addon_id)
  )

  const [priceOverrides, setPriceOverrides] = useState<Record<string, string>>(
    {}
  )

  const [documentFiles, setDocumentFiles] = useState<
    Record<string, File | null>
  >({})

  const existingDocuments = linkedAddons.reduce(
    (acc, item) => {
      if (item.document_path) {
        acc[item.addon_id] = item.document_path
      }
      return acc
    },
    {} as Record<string, string>
  )

  const subcategories = useMemo(() => {
    return CATEGORY_MAP[form.category] || []
  }, [form.category])

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: FileText },
    { id: 'specs', label: 'Specifications', icon: Ruler },
    { id: 'drawings', label: 'Drawings', icon: ImageIcon },
    { id: 'elevations', label: 'Elevations', icon: ImageIcon },
    { id: 'addons', label: 'Add-ons', icon: Package },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
  ]

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }

      if (key === 'title') {
        const generated = makeSlug(String(value))

        if (!prev.slug || prev.slug === makeSlug(prev.title)) {
          next.slug = generated
        }
      }

      if (key === 'category') {
        next.subcategory =
          CATEGORY_MAP[value as keyof typeof CATEGORY_MAP]?.[0] || ''
      }

      return next
    })

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }))
  }

  function toggleAddon(addonId: string) {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    )
  }

  function updateAddonPrice(addonId: string, value: string) {
    setPriceOverrides((prev) => ({
      ...prev,
      [addonId]: value,
    }))
  }

  function updateDocumentFile(addonId: string, file: File | null) {
    setDocumentFiles((prev) => ({
      ...prev,
      [addonId]: file,
    }))
  }

  async function uploadFile(file: File, folder: string) {
    // Step 1: request signed upload token
    const res = await fetch('/api/admin/create-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        folder,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to prepare upload')
    }

    // Step 2: direct upload to Supabase
    const { error } = await supabase.storage
      .from('drawings')
      .uploadToSignedUrl(data.path, data.token, file)

    if (error) {
      throw new Error(error.message)
    }

    return data.path as string
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validation = validateProductForm(form)

    if (Object.keys(validation).length > 0) {
      setErrors(validation)

      const firstError = Object.keys(validation)[0]
      const section = getSectionForField(firstError)

      if (section) setActiveSection(section)

      return
    }

    try {
      setSubmitting(true)

      // Main drawing
      let drawingPath = product?.file_path || null

      if (drawingFile) {
        drawingPath = await uploadFile(drawingFile, 'drawings')
      }

      // Elevations
      let elevationPaths = product?.elevation_images || []

      if (elevationFiles.length > 0) {
        elevationPaths = await Promise.all(
          elevationFiles.map((file) =>
            uploadFile(file, 'elevations')
          )
        )
      }

      // Addons
      const addonsData = []

      for (const addonId of selectedAddons) {
        let documentPath = null

        if (documentFiles[addonId]) {
          documentPath = await uploadFile(
            documentFiles[addonId]!,
            'addons'
          )
        } else if (existingDocuments[addonId]) {
          documentPath = existingDocuments[addonId]
        }

        addonsData.push({
          addon_id: addonId,
          price_override: priceOverrides[addonId]
            ? Number(priceOverrides[addonId])
            : null,
          document_path: documentPath,
        })
      }

      const payload = {
        ...buildPayload(form),
        file_path: drawingPath,
        elevation_images: elevationPaths,
        addons: addonsData,
      }

      const endpoint =
        mode === 'create'
          ? '/api/admin/products'
          : `/api/admin/products/${product?.id}`

      const method = mode === 'create' ? 'POST' : 'PATCH'

      const saveRes = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await saveRes.json()

      if (!saveRes.ok) {
        throw new Error(responseData.error || 'Save failed')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Unable to save product.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  function getSectionForField(field: string): string | null {
    const fieldMap: Record<string, string> = {
      title: 'basic',
      description: 'basic',
      category: 'basic',
      subcategory: 'basic',
      slug: 'seo',
      meta_title: 'seo',
      meta_description: 'seo',
      price: 'pricing',
      bedrooms: 'specs',
      bathrooms: 'specs',
      floors: 'specs',
      plinth_area: 'specs',
    }

    return fieldMap[field] || null
  }

  function scrollToSection(sectionId: string) {
    setActiveSection(sectionId)

    const element = document.getElementById(
      `section-${sectionId}`
    )

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blueprint-50 to-white border-b border-neutral-200">
              <h3 className="font-semibold text-blueprint-900">
                Navigation
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Jump to any section
              </p>
            </div>

            <nav className="p-2 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive =
                  activeSection === section.id

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      scrollToSection(section.id)
                    }
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                      isActive
                        ? 'bg-blueprint-50 text-blueprint-700 border-l-4 border-blueprint-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        isActive
                          ? 'text-blueprint-600'
                          : 'text-neutral-400'
                      )}
                    />

                    <span>{section.label}</span>

                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blueprint-600" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blueprint-900">
                  {mode === 'create'
                    ? 'Create New Product'
                    : 'Edit Product'}
                </h1>

                <p className="text-sm text-neutral-500 mt-1">
                  {mode === 'create'
                    ? 'Add a new architectural plan to your catalog'
                    : 'Update product details, specifications, and add-ons'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowPreview(!showPreview)
                  }
                  className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  {showPreview ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blueprint-600 text-white rounded-xl font-semibold hover:bg-blueprint-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div id="section-basic">
            <BasicInfoSection
              form={form}
              errors={errors}
              updateField={updateField}
            />
          </div>

          <div id="section-pricing">
            <PricingSection
              form={form}
              updateField={updateField}
            />
          </div>

          <div id="section-specs">
            <SpecsSection
              form={form}
              errors={errors}
              updateField={updateField}
            />
          </div>

          <div id="section-drawings">
            <DrawingUploadSection
              file={drawingFile}
              existingFile={product?.file_path}
              onFileSelect={setDrawingFile}
            />
          </div>

          <div id="section-elevations">
            <ElevationUploadSection
              files={elevationFiles}
              existingImages={
                product?.elevation_images || []
              }
              onFilesChange={setElevationFiles}
            />
          </div>

          <div id="section-addons">
            <AddonsSection
              addons={addons.filter(
                (a) => a.type === 'drawing'
              )}
              selected={selectedAddons}
              linkedAddons={linkedAddons}
              priceOverrides={priceOverrides}
              documentFiles={documentFiles}
              existingDocuments={existingDocuments}
              onToggle={toggleAddon}
              onPriceChange={updateAddonPrice}
              onDocumentChange={updateDocumentFile}
            />
          </div>

          <div id="section-services">
            <ServicesSection
              addons={addons.filter(
                (a) => a.type === 'service'
              )}
              selected={selectedAddons}
              linkedAddons={linkedAddons}
              onToggle={toggleAddon}
            />
          </div>

          <div id="section-seo">
            <SeoSection
              form={form}
              errors={errors}
              updateField={updateField}
            />
          </div>
        </div>
      </div>
    </form>
  )
}