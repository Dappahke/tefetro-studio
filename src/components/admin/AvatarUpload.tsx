// src/components/AvatarUpload.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userName: string
  userEmail: string
}

export default function AvatarUpload({ 
  currentAvatarUrl, 
  userName, 
  userEmail 
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    setError(null)
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return false
    }

    return true
  }

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const clearAvatar = () => {
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const initials = (userName || userEmail)[0].toUpperCase()

  return (
    <div className="flex items-start gap-5">
      {/* Avatar Display */}
      <div 
        className={`
          relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg group cursor-pointer
          ${isDragging ? 'ring-4 ring-tefetra ring-offset-2' : ''}
          ${preview ? '' : 'bg-gradient-to-br from-tefetra to-tefetra-600'}
        `}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image 
            src={preview} 
            alt="Avatar preview" 
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="text-white w-6 h-6" />
        </div>

        {/* Remove Button */}
        {preview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              clearAvatar()
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-tefetra hover:text-tefetra-600 transition-colors"
          >
            {preview ? 'Change Photo' : 'Upload Photo'}
          </button>
          
          {preview && (
            <button
              type="button"
              onClick={clearAvatar}
              className="px-4 py-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        <p className="text-xs text-mist">
          Drag & drop or click to upload. JPG, PNG, GIF, WebP. Max 5MB.
        </p>

        {error && (
          <p className="text-xs text-rose-500">{error}</p>
        )}

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          name="avatar_file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        
        {/* Hidden field to track current avatar for deletion */}
        <input type="hidden" name="avatar_url" value={preview || ''} />
      </div>
    </div>
  )
}