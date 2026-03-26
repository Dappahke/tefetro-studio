'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Link from 'next/link'

interface Addon {
  id: string
  name: string
  price: number
  type: 'drawing' | 'service'
  description: string | null
}

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: {
    id: string
    title: string
    description: string
    price: number
    category: string
    file_path: string | null
    bedrooms?: number
    bathrooms?: number
    floors?: number
    plinth_area?: number
    length?: number
    width?: number
  }
  addons: Addon[]
  linkedAddons?: string[]
}

export function ProductForm({ mode, product, addons, linkedAddons = [] }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<string[]>(linkedAddons)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.file_path || null)

  // Form state
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'residential',
    bedrooms: product?.bedrooms || '',
    bathrooms: product?.bathrooms || '',
    floors: product?.floors || '1',
    plinth_area: product?.plinth_area || '',
    length: product?.length || '',
    width: product?.width || '',
  })

  // Drag-drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
    },
    maxFiles: 1,
  })

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Upload file if new one selected
      let filePath = product?.file_path
      if (uploadedFile && uploadedFile.size > 0) {
        const formData = new FormData()
        formData.append('file', uploadedFile)
        
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadRes.ok) throw new Error('File upload failed')
        const { path } = await uploadRes.json()
        filePath = path
      }

      // Create/update product
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        floors: Number(formData.floors) || 1,
        plinth_area: formData.plinth_area ? Number(formData.plinth_area) : null,
        length: formData.length ? Number(formData.length) : null,
        width: formData.width ? Number(formData.width) : null,
        file_path: filePath,
        addon_ids: selectedAddons,
      }

      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${product?.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

        const submitForm = new FormData()

        submitForm.append("title", payload.title)
        submitForm.append("description", payload.description || "")
        submitForm.append("price", String(payload.price))
        submitForm.append("category", payload.category)

        if (payload.bedrooms !== null) submitForm.append("bedrooms", String(payload.bedrooms))
        if (payload.bathrooms !== null) submitForm.append("bathrooms", String(payload.bathrooms))
        if (payload.floors !== null) submitForm.append("floors", String(payload.floors))
        if (payload.plinth_area !== null) submitForm.append("plinth_area", String(payload.plinth_area))
        if (payload.length !== null) submitForm.append("length", String(payload.length))
        if (payload.width !== null) submitForm.append("width", String(payload.width))

        submitForm.append("addonIds", JSON.stringify(payload.addon_ids || []))

        // 👇 IMPORTANT: you already uploaded file separately, so DO NOT append file again

        const res = await fetch(url, {
          method,
          body: submitForm, // ✅ no headers
        })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const drawingAddons = addons.filter(a => a.type === 'drawing')
  const serviceAddons = addons.filter(a => a.type === 'service')

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="bg-alert/10 border border-alert/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-alert flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-alert">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
            <h2 className="text-lg font-bold text-deep-700 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="e.g., 4 Bedroom Modern Villa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="Describe the architectural plan..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                    placeholder="50000"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
            <h2 className="text-lg font-bold text-deep-700 mb-4">Specifications</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="3"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Floors</label>
                <input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Plinth Area (m²)</label>
                <input
                  type="number"
                  value={formData.plinth_area}
                  onChange={(e) => setFormData({ ...formData, plinth_area: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="120"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Length (m)</label>
                <input
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="15"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-700 mb-1">Width (m)</label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="w-full px-4 py-2.5 border border-mist/50 rounded-xl focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none"
                  placeholder="12"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Addon Linker */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
            <h2 className="text-lg font-bold text-deep-700 mb-4">Linked Addons</h2>
            <p className="text-sm text-neutral-500 mb-4">Select addons available for this product</p>

            {/* Drawing Addons */}
            {drawingAddons.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-deep-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-tefetra rounded-full"></span>
                  Drawing Enhancements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {drawingAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'border-tefetra bg-tefetra/5'
                          : 'border-mist/50 hover:border-sage/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 w-5 h-5 text-tefetra rounded border-mist focus:ring-tefetra"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-deep-700">{addon.name}</span>
                          <span className="text-sm text-tefetra font-semibold">KES {addon.price.toLocaleString()}</span>
                        </div>
                        {addon.description && (
                          <p className="text-xs text-neutral-500 mt-1">{addon.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Service Addons */}
            {serviceAddons.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-deep-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-sage rounded-full"></span>
                  Professional Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'border-sage bg-sage/5'
                          : 'border-mist/50 hover:border-sage/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 w-5 h-5 text-sage rounded border-mist focus:ring-sage"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-deep-700">{addon.name}</span>
                          <span className="text-sm text-sage font-semibold">KES {addon.price.toLocaleString()}</span>
                        </div>
                        {addon.description && (
                          <p className="text-xs text-neutral-500 mt-1">{addon.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Image Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
            <h2 className="text-lg font-bold text-deep-700 mb-4">Product Image</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-tefetra bg-tefetra/5' : 'border-mist/50 hover:border-sage/50'
              }`}
            >
              <input {...getInputProps()} />
              
              {previewUrl ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewUrl(null)
                      setUploadedFile(null)
                    }}
                    className="absolute top-2 right-2 p-1 bg-alert text-white rounded-full hover:bg-alert-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-deep-700">
                    {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-3"
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
            <Link
              href="/admin/products"
              className="btn-ghost py-3 px-6"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}