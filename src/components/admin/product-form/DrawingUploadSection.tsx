// src/components/admin/product-form/DrawingUploadSection.tsx

'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface DrawingUploadSectionProps {
  file: File | null
  existingFile?: string | null
  uploading?: boolean
  onFileSelect: (file: File | null) => void
}

export function DrawingUploadSection({
  file,
  existingFile,
  uploading = false,
  onFileSelect,
}: DrawingUploadSectionProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        'application/pdf': ['.pdf'],
      },
    })

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Drawing Package Upload
      </h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input {...getInputProps()} />

        <div className="space-y-2">
          <p className="font-medium text-slate-800">
            {isDragActive
              ? 'Drop PDF here'
              : 'Drag & drop drawing PDF'}
          </p>

          <p className="text-sm text-slate-500">
            or click to browse files
          </p>

          <p className="text-xs text-slate-400">
            Accepted format: PDF
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 rounded-xl border p-4 bg-slate-50">
          <p className="text-sm font-medium text-slate-700">
            Selected File
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {file.name}
          </p>
        </div>
      )}

      {!file && existingFile && (
        <div className="mt-4 rounded-xl border p-4 bg-slate-50">
          <p className="text-sm font-medium text-slate-700">
            Existing File
          </p>
          <p className="text-sm text-slate-600 mt-1 break-all">
            {existingFile}
          </p>
        </div>
      )}

      {uploading && (
        <p className="mt-4 text-sm text-blue-700">
          Uploading drawing package...
        </p>
      )}
    </section>
  )
}