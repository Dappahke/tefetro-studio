'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type PortfolioFormProps = {
  project?: any
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function formatDateTimeLocal(date?: string | null) {
  if (!date) return ''

  const d = new Date(date)
  const pad = (n: number) =>
    String(n).padStart(2, '0')

  return `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

export default function PortfolioForm({
  project,
}: PortfolioFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const isEditing = !!project?.id

  // Core
  const [title, setTitle] = useState(
    project?.title || ''
  )
  const [slug, setSlug] = useState(
    project?.slug || ''
  )
  const [slugTouched, setSlugTouched] =
    useState(!!project?.slug)

  const [category, setCategory] = useState(
    project?.category || 'residential'
  )

  const [description, setDescription] =
    useState(project?.description || '')

  const [shortDescription, setShortDescription] =
    useState(
      project?.short_description || ''
    )

  // Media
  const [image, setImage] = useState(
    project?.image || ''
  )

  const [galleryImages, setGalleryImages] =
    useState<string[]>(
      Array.isArray(project?.images)
        ? project.images
        : []
    )

  // CMS
  const [featured, setFeatured] =
    useState(project?.featured || false)

  const [featuredOrder, setFeaturedOrder] =
    useState(
      project?.featured_order || 0
    )

  const [displayOrder, setDisplayOrder] =
    useState(
      project?.display_order || 0
    )

  const [status, setStatus] = useState(
    project?.status || 'concept'
  )

  const [publishNow, setPublishNow] =
    useState(
      !!project?.published_at
    )

  const [publishedAt, setPublishedAt] =
    useState(
      formatDateTimeLocal(
        project?.published_at
      )
    )

  // SEO
  const [metaTitle, setMetaTitle] =
    useState(
      project?.meta_title || ''
    )

  const [
    metaDescription,
    setMetaDescription,
  ] = useState(
    project?.meta_description || ''
  )

  // UI
  const [loading, setLoading] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [errorMsg, setErrorMsg] =
    useState('')

  useEffect(() => {
    if (!slugTouched) {
      setSlug(generateSlug(title))
    }
  }, [title, slugTouched])

  useEffect(() => {
    if (!metaTitle) {
      setMetaTitle(title)
    }
  }, [title])

  const previewSlug = useMemo(() => {
    return slug || 'project-slug'
  }, [slug])

  async function uploadFiles(
    files: FileList | null,
    multiple = false
  ) {
    if (!files?.length) return

    try {
      setUploading(true)

      const urls: string[] = []

      for (const file of Array.from(files)) {
        const ext =
          file.name
            .split('.')
            .pop() || 'jpg'

        const name = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`

        const path = `portfolio/${name}`

        const { error } =
          await supabase.storage
            .from('portfolio')
            .upload(path, file)

        if (error) throw error

        const { data } =
          supabase.storage
            .from('portfolio')
            .getPublicUrl(path)

        urls.push(data.publicUrl)
      }

      if (multiple) {
        setGalleryImages((prev) => [
          ...prev,
          ...urls,
        ])
      } else {
        setImage(urls[0])
      }
    } catch (error: any) {
      setErrorMsg(
        error?.message ||
          'Upload failed.'
      )
    } finally {
      setUploading(false)
    }
  }

  function removeGalleryImage(
    index: number
  ) {
    setGalleryImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    )
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setErrorMsg('')

    try {
      const finalPublishedAt =
        publishNow
          ? publishedAt
            ? new Date(
                publishedAt
              ).toISOString()
            : new Date().toISOString()
          : null

      const payload = {
        title,
        slug,
        category,
        description,
        short_description:
          shortDescription,
        image,
        images: galleryImages,
        featured,
        featured_order:
          Number(featuredOrder),
        display_order:
          Number(displayOrder),
        status,
        published_at:
          finalPublishedAt,
        meta_title: metaTitle,
        meta_description:
          metaDescription,
      }

      if (isEditing) {
        const { error } =
          await supabase
            .from(
              'portfolio_projects'
            )
            .update(payload)
            .eq(
              'id',
              project.id
            )

        if (error) throw error
      } else {
        const { error } =
          await supabase
            .from(
              'portfolio_projects'
            )
            .insert(payload)

        if (error) throw error
      }

      router.push(
        '/admin/portfolio'
      )
      router.refresh()
    } catch (error: any) {
      setErrorMsg(
        error?.message ||
          'Failed to save project.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b px-6 py-5">
          <h1 className="text-2xl font-bold">
            {isEditing
              ? 'Edit Project'
              : 'Create Project'}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Full CMS control for
            Tefetro portfolio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 px-6 py-6"
        >
          {/* Basic */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Project Title"
                className="rounded-xl border px-4 py-3"
                required
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="rounded-xl border px-4 py-3"
              >
                <option value="residential">
                  Residential
                </option>
                <option value="rental_units">
                  Rental Units
                </option>
                <option value="apartments">
                  Apartments
                </option>
                <option value="interiors">
                  Interiors
                </option>
                <option value="landscaping">
                  Landscaping
                </option>
                <option value="technical_planning">
                  Technical Planning
                </option>
              </select>
            </div>

            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(
                  generateSlug(
                    e.target.value
                  )
                )
              }}
              placeholder="slug"
              className="w-full rounded-xl border px-4 py-3"
            />

            <p className="text-xs text-slate-500">
              /our-work/
              {previewSlug}
            </p>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Full Description"
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <textarea
              rows={3}
              value={
                shortDescription
              }
              onChange={(e) =>
                setShortDescription(
                  e.target.value
                )
              }
              placeholder="Short Description"
              className="w-full rounded-xl border px-4 py-3"
            />
          </section>

          {/* Media */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold">
              Media
            </h2>

            <label className="block rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer">
              <span>
                {uploading
                  ? 'Uploading...'
                  : 'Upload Cover Image'}
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  uploadFiles(
                    e.target.files,
                    false
                  )
                }
              />
            </label>

            {image && (
              <img
                src={image}
                alt=""
                className="h-64 w-full rounded-2xl object-cover border"
              />
            )}

            <label className="block rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer">
              <span>
                {uploading
                  ? 'Uploading...'
                  : 'Upload Gallery Images'}
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  uploadFiles(
                    e.target.files,
                    true
                  )
                }
              />
            </label>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {galleryImages.map(
                (
                  img,
                  index
                ) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-32 w-full rounded-xl border object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeGalleryImage(
                          index
                        )
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* CMS Controls */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold">
              Publishing & Display
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(
                      e.target
                        .checked
                    )
                  }
                />
                Featured Project
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    publishNow
                  }
                  onChange={(e) =>
                    setPublishNow(
                      e.target
                        .checked
                    )
                  }
                />
                Publish Project
              </label>

              <input
                type="number"
                value={
                  featuredOrder
                }
                onChange={(e) =>
                  setFeaturedOrder(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                placeholder="Featured Order"
                className="rounded-xl border px-4 py-3"
              />

              <input
                type="number"
                value={
                  displayOrder
                }
                onChange={(e) =>
                  setDisplayOrder(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                placeholder="Display Order"
                className="rounded-xl border px-4 py-3"
              />
            </div>

            <input
              type="datetime-local"
              value={
                publishedAt
              }
              onChange={(e) =>
                setPublishedAt(
                  e.target
                    .value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="concept">
                Concept
              </option>
              <option value="design">
                Design
              </option>
              <option value="proposal">
                Proposal
              </option>
              <option value="plan">
                Plan
              </option>
              <option value="visualization">
                Visualization
              </option>
              <option value="completed">
                Completed
              </option>
            </select>
          </section>

          {/* SEO */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold">
              SEO Settings
            </h2>

            <input
              value={metaTitle}
              onChange={(e) =>
                setMetaTitle(
                  e.target.value
                )
              }
              placeholder="Meta Title"
              className="w-full rounded-xl border px-4 py-3"
            />

            <textarea
              rows={3}
              value={
                metaDescription
              }
              onChange={(e) =>
                setMetaDescription(
                  e.target.value
                )
              }
              placeholder="Meta Description"
              className="w-full rounded-xl border px-4 py-3"
            />
          </section>

          {/* Error */}
          {errorMsg && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/portfolio'
                )
              }
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                uploading
              }
              className="rounded-xl bg-[#0f2a44] px-5 py-3 text-white"
            >
              {uploading
                ? 'Uploading...'
                : loading
                ? 'Saving...'
                : isEditing
                ? 'Update Project'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}