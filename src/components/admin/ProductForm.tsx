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

interface ProductAddonLink {
  addon_id: string
  price_override?: number | null
  document_path?: string | null
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
    elevation_images?: string[] | null
    bedrooms?: number
    bathrooms?: number
    floors?: number
    plinth_area?: number
    length?: number
    width?: number
  }
  addons: Addon[]
  linkedAddons?: ProductAddonLink[]
}

interface FileUpload {
  file: File | null
  preview: string | null
  existingPath?: string | null
}

interface AddonConfig {
  selected: boolean
  priceOverride: number | null
  document: FileUpload
}

export function ProductForm({ mode, product, addons, linkedAddons = [] }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize addon configs from linkedAddons
  const initializeAddonConfigs = (): Record<string, AddonConfig> => {
    const configs: Record<string, AddonConfig> = {}
    
    addons.forEach(addon => {
      const linked = linkedAddons.find(la => la.addon_id === addon.id)
      configs[addon.id] = {
        selected: !!linked,
        priceOverride: linked?.price_override ?? null,
        document: {
          file: null,
          preview: linked?.document_path || null,
          existingPath: linked?.document_path || null
        }
      }
    })
    
    return configs
  }

  const [addonConfigs, setAddonConfigs] = useState<Record<string, AddonConfig>>(initializeAddonConfigs())
  
  // Main drawing PDF
  const [drawingPdf, setDrawingPdf] = useState<FileUpload>({
    file: null,
    preview: product?.file_path || null,
    existingPath: product?.file_path || null
  })

  // Elevation images (max 5 PNGs) — FIXED: Store full Supabase URL
  const [elevations, setElevations] = useState<FileUpload[]>(() => {
    const existing = product?.elevation_images || []
    return Array(5).fill(null).map((_, i) => {
      const path = existing[i]
      // FIX: Construct full Supabase URL for stored paths
      const fullUrl = path && !path.startsWith('http')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${path}`
        : path
      return {
        file: null,
        preview: fullUrl || null,
        existingPath: path || null
      }
    })
  })

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

  // Drawing PDF dropzone
  const onDrawingDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      setDrawingPdf({
        file,
        preview: URL.createObjectURL(file),
        existingPath: null
      })
    }
  }, [])

  const { getRootProps: getDrawingRootProps, getInputProps: getDrawingInputProps, isDragActive: isDrawingDragActive } = useDropzone({
    onDrop: onDrawingDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  // Elevation image dropzone handler
  const onElevationDrop = useCallback((index: number) => (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const newElevations = [...elevations]
      newElevations[index] = {
        file,
        preview: URL.createObjectURL(file),
        existingPath: null
      }
      setElevations(newElevations)
    }
  }, [elevations])

  // Addon document dropzone handler
  const onAddonDocDrop = useCallback((addonId: string) => (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      setAddonConfigs(prev => ({
        ...prev,
        [addonId]: {
          ...prev[addonId],
          document: {
            file,
            preview: URL.createObjectURL(file),
            existingPath: null
          }
        }
      }))
    }
  }, [])

  const toggleAddon = (addonId: string) => {
    setAddonConfigs(prev => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        selected: !prev[addonId].selected
      }
    }))
  }

  const updateAddonPrice = (addonId: string, price: string) => {
    const numPrice = price === '' ? null : Number(price)
    setAddonConfigs(prev => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        priceOverride: numPrice
      }
    }))
  }

  const removeAddonDoc = (addonId: string) => {
    setAddonConfigs(prev => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        document: { file: null, preview: null, existingPath: null }
      }
    }))
  }

  const removeElevation = (index: number) => {
    const newElevations = [...elevations]
    newElevations[index] = { file: null, preview: null, existingPath: null }
    setElevations(newElevations)
  }

  const removeDrawingPdf = () => {
    setDrawingPdf({ file: null, preview: null, existingPath: null })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate main drawing PDF
      if (!drawingPdf.file && !drawingPdf.existingPath) {
        throw new Error('Please upload the main drawing PDF')
      }

      // 1. Upload main drawing PDF
      let drawingPath = drawingPdf.existingPath
      if (drawingPdf.file) {
        const formData = new FormData()
        formData.append('file', drawingPdf.file)
        formData.append('folder', 'drawings')
        
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadRes.ok) throw new Error('Drawing PDF upload failed')
        const { path } = await uploadRes.json()
        drawingPath = path
      }

      // 2. Upload elevation images
      const elevationPaths = await Promise.all(
        elevations.map(async (elevation, index) => {
          if (!elevation.file) return elevation.existingPath || null
          
          const formData = new FormData()
          formData.append('file', elevation.file)
          formData.append('folder', 'elevations')
          
          const uploadRes = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (!uploadRes.ok) throw new Error(`Elevation ${index + 1} upload failed`)
          const { path } = await uploadRes.json()
          return path
        })
      )

      // 3. Upload addon documents and prepare addon data
      const selectedAddonsData: Array<{
        addon_id: string
        price_override: number | null
        document_path: string | null
      }> = []

      for (const [addonId, config] of Object.entries(addonConfigs)) {
        if (!config.selected) continue

        let documentPath: string | null = config.document.existingPath ?? null
        if (config.document.file) {
          const formData = new FormData()
          formData.append('file', config.document.file)
          formData.append('folder', 'addon-documents')
          
          const uploadRes = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (!uploadRes.ok) throw new Error(`Addon document upload failed for ${addonId}`)
          const { path } = await uploadRes.json()
          documentPath = path
        }

        selectedAddonsData.push({
          addon_id: addonId,
          price_override: config.priceOverride,
          document_path: documentPath
        })
      }

      // 4. Prepare payload
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        floors: Number(formData.floors) || 1,
        plinth_area: formData.plinth_area ? Number(formData.plinth_area) : null,
        length: formData.length ? Number(formData.length) : null,
        width: formData.width ? Number(formData.width) : null,
        file_path: drawingPath,
        elevation_images: elevationPaths.filter(Boolean),
        addons: selectedAddonsData,
      }

      // 5. Save to database
      const url = mode === 'create' 
        ? '/api/admin/products' 
        : `/api/admin/products/${product?.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      console.error('Submit error:', err)
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 4 Bedroom Modern Villa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Describe the architectural plan..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="50000"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Specifications</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="3"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                <input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plinth Area (m²)</label>
                <input
                  type="number"
                  value={formData.plinth_area}
                  onChange={(e) => setFormData({ ...formData, plinth_area: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="120"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                <input
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="15"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="12"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Drawing Addons with Price Edit and Document Upload */}
          {drawingAddons.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Drawing Enhancements</h2>
              <p className="text-sm text-gray-500 mb-4">Select addons, customize prices, and upload their PDF documents</p>

              <div className="space-y-4">
                {drawingAddons.map((addon) => {
                  const config = addonConfigs[addon.id]
                  const displayPrice = config.priceOverride ?? addon.price
                  
                  return (
                    <div key={addon.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={config.selected}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{addon.name}</span>
                          </div>
                          
                          {addon.description && (
                            <p className="text-xs text-gray-500 mb-3">{addon.description}</p>
                          )}

                          {/* Price Editor - Always visible but disabled if not selected */}
                          <div className={`mb-3 p-3 bg-gray-50 rounded-lg ${!config.selected ? 'opacity-50' : ''}`}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Price (KES) {config.priceOverride !== null && '(Custom)'}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={displayPrice}
                                onChange={(e) => updateAddonPrice(addon.id, e.target.value)}
                                disabled={!config.selected}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                placeholder={String(addon.price)}
                              />
                              {config.priceOverride !== null && (
                                <button
                                  type="button"
                                  onClick={() => updateAddonPrice(addon.id, String(addon.price))}
                                  disabled={!config.selected}
                                  className="text-xs text-blue-600 hover:text-blue-700 underline disabled:text-gray-400"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Default: KES {addon.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Document Upload - Only when selected */}
                          {config.selected && (
                            <AddonDocumentUpload
                              addonId={addon.id}
                              addonName={addon.name}
                              document={config.document}
                              onDrop={onAddonDocDrop(addon.id)}
                              onRemove={() => removeAddonDoc(addon.id)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Professional Services - Selection Only with Price Edit */}
          {serviceAddons.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Professional Services</h2>
              <p className="text-sm text-gray-500 mb-4">Select professional services and customize prices</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceAddons.map((addon) => {
                  const config = addonConfigs[addon.id]
                  const displayPrice = config.priceOverride ?? addon.price

                  return (
                    <div
                      key={addon.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.selected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <label className="flex items-start gap-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={config.selected}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1 w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{addon.name}</span>
                          {addon.description && (
                            <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                          )}
                        </div>
                      </label>

                      {/* Price Editor */}
                      <div className={`${!config.selected ? 'opacity-50' : ''}`}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price (KES)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={displayPrice}
                            onChange={(e) => updateAddonPrice(addon.id, e.target.value)}
                            disabled={!config.selected}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none disabled:bg-gray-100"
                          />
                          {config.priceOverride !== null && (
                            <button
                              type="button"
                              onClick={() => updateAddonPrice(addon.id, String(addon.price))}
                              disabled={!config.selected}
                              className="text-xs text-green-600 hover:text-green-700 underline whitespace-nowrap disabled:text-gray-400"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Default: KES {addon.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: File Uploads */}
        <div className="space-y-6">
          {/* Main Drawing PDF */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Drawing Document</h2>
            <p className="text-sm text-gray-500 mb-4">Upload the main architectural drawing (PDF)</p>
            
            <div
              {...getDrawingRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDrawingDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getDrawingInputProps()} />
              
              {drawingPdf.preview ? (
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 text-gray-800">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">
                      {drawingPdf.file ? drawingPdf.file.name : drawingPdf.existingPath?.split('/').pop() || 'PDF Document'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeDrawingPdf()
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Remove PDF
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {isDrawingDragActive ? 'Drop PDF here' : 'Click or drag PDF'}
                  </p>
                  <p className="text-xs text-gray-500">PDF format only</p>
                </div>
              )}
            </div>
          </div>

          {/* Elevation Images */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Elevation Views</h2>
            <p className="text-sm text-gray-500 mb-4">Upload up to 5 PNG elevation images</p>
            
            <div className="grid grid-cols-2 gap-3">
              {elevations.map((elevation, index) => (
                <ElevationUpload
                  key={index}
                  index={index}
                  elevation={elevation}
                  onDrop={onElevationDrop(index)}
                  onRemove={() => removeElevation(index)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

// Sub-component for elevation uploads
function ElevationUpload({ 
  index, 
  elevation, 
  onDrop, 
  onRemove 
}: { 
  index: number
  elevation: FileUpload
  onDrop: (acceptedFiles: File[]) => void
  onRemove: () => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`aspect-square border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden relative ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      
      {elevation.preview ? (
        <>
          {/* elevation.preview is now a full URL (either blob: for new uploads or https:// for existing) */}
          <Image
            src={elevation.preview}
            alt={`Elevation ${index + 1}`}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
            Elevation {index + 1}
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-2">
          <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500 text-center">Elevation {index + 1}</span>
          <span className="text-[10px] text-gray-400">PNG/JPG</span>
        </div>
      )}
    </div>
  )
}

// Sub-component for addon document uploads
function AddonDocumentUpload({
  addonId,
  addonName,
  document,
  onDrop,
  onRemove
}: {
  addonId: string
  addonName: string
  document?: FileUpload
  onDrop: (acceptedFiles: File[]) => void
  onRemove: () => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      
      {document?.preview ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-800 font-medium truncate max-w-[150px]">
              {addonName} PDF
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-xs text-red-600 hover:text-red-700 underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">Upload PDF for {addonName}</span>
        </div>
      )}
    </div>
  )
}