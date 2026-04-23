// src/app/dashboard/saved-plans/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'

export const metadata = {
  title: 'Saved Plans | Dashboard',
}

export default async function SavedPlansPage() {
  const supabase =
    await createClient()

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: items,
  } =
    await supabase
      .from(
        'saved_plans'
      )
      .select(
        `
        id,
        created_at,
        product_id,
        products (
          id,
          slug,
          title,
          price,
          category,
          bedrooms,
          bathrooms,
          plinth_area,
          elevation_images
        )
      `
      )
      .eq(
        'user_id',
        user.id
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      )

  const saved =
    items || []

  return (
    <main className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose-600">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              Wishlist
            </div>

            <h1 className="mt-3 text-3xl font-bold text-slate-800">
              Saved Plans
            </h1>

            <p className="mt-2 text-slate-500">
              Review shortlisted architectural plans and continue when ready.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0F4C5C] px-5 py-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Total Saved
            </p>

            <p className="mt-1 text-2xl font-bold">
              {saved.length}
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {saved.length ===
        0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Heart className="h-8 w-8 text-slate-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            No Saved Plans Yet
          </h2>

          <p className="mt-2 text-slate-500 max-w-md mx-auto">
            Browse our catalogue and save designs you’d like to compare later.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-2xl bg-[#0F4C5C] px-6 py-3 font-semibold text-white hover:bg-[#123d49] transition"
          >
            Explore Plans
          </Link>
        </section>
      )}

      {/* Grid */}
      {saved.length >
        0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {saved.map(
            (
              item: any
            ) => {
              const p =
                item.products

              const image =
                p?.elevation_images?.[0]

              const imageUrl =
                image
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${
                      image.startsWith(
                        '/'
                      )
                        ? image.slice(
                            1
                          )
                        : image
                    }`
                  : null

              const href = `/products/${
                p.slug ||
                p.id
              }`

              return (
                <article
                  key={
                    item.id
                  }
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {imageUrl ? (
                      <Image
                        src={
                          imageUrl
                        }
                        alt={
                          p.title
                        }
                        fill
                        className="object-cover"
                      />
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                    <div className="absolute left-4 bottom-4 right-4">
                      <h3 className="text-xl font-bold text-white">
                        {
                          p.title
                        }
                      </h3>

                      <p className="text-white/80 text-sm">
                        {
                          p.category
                        }
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <Spec
                        value={
                          p.bedrooms ||
                          '-'
                        }
                        label="Beds"
                      />
                      <Spec
                        value={
                          p.bathrooms ||
                          '-'
                        }
                        label="Baths"
                      />
                      <Spec
                        value={
                          p.plinth_area
                            ? `${p.plinth_area}m²`
                            : '-'
                        }
                        label="Area"
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#0F4C5C]">
                        KES{' '}
                        {Number(
                          p.price
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <Link
                        href={
                          href
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F4C5C] px-5 py-3 font-semibold text-white hover:bg-[#123d49] transition"
                      >
                        View Plan
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 transition">
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              )
            }
          )}
        </section>
      )}
    </main>
  )
}

function Spec({
  value,
  label,
}: {
  value: string | number
  label: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="font-bold text-slate-800">
        {value}
      </p>

      <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">
        {label}
      </p>
    </div>
  )
}