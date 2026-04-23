// src/components/admin/product-form/ElevationUploadSection.tsx

'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { MAX_ELEVATION_IMAGES } from './constants'

interface ElevationUploadSectionProps {
  files: File[]
  existingImages?: string[]
  uploading?: boolean
  onFilesChange: (files: File[]) => void
}

export function ElevationUploadSection({
  files,
  existingImages = [],
  uploading = false,
  onFilesChange,
}: ElevationUploadSectionProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const next = [...files, ...acceptedFiles].slice(
        0,
        MAX_ELEVATION_IMAGES
      )

      onFilesChange(next)
    },
    [files, onFilesChange]
  )

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: true,
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      },
    })

  function removeImage(index: number) {
    const next = files.filter((_, i) => i !== index)
    onFilesChange(next)
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Elevation Images
        </h2>

        <span className="text-sm text-slate-500">
          {files.length}/{MAX_ELEVATION_IMAGES}
        </span>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input {...getInputProps()} />

        <p className="font-medium text-slate-800">
          Upload elevation renders
        </p>

        <p className="text-sm text-slate-500 mt-2">
          JPG, PNG, WEBP up to {MAX_ELEVATION_IMAGES} images
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="rounded-xl border p-4 bg-slate-50"
            >
              <p className="text-sm font-medium text-slate-700 truncate">
                {file.name}
              </p>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="mt-3 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 &&
        existingImages.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-5">
            {existingImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="rounded-xl border p-4 bg-slate-50"
              >
                <p className="text-sm text-slate-600 truncate">
                  {img}
                </p>
              </div>
            ))}
          </div>
        )}

      {uploading && (
        <p className="mt-4 text-sm text-blue-700">
          Uploading images...
        </p>
      )}
    </section>
  )
}