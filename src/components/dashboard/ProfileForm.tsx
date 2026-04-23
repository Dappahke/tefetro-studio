// src/components/dashboard/ProfileForm.tsx

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LucideIcon } from 'lucide-react'
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Bell,
  Megaphone,
} from 'lucide-react'

interface ProfileData {
  id: string
  email: string
  name: string
  avatar_url?: string
  phone?: string
  country?: string
  company?: string
  bio?: string
  email_notifications?: boolean
  marketing_notifications?: boolean
}

export function ProfileForm({
  profile,
}: {
  profile: ProfileData
}) {
  const supabase =
    createClient()

  const [form, setForm] =
    useState(profile)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    message,
    setMessage,
  ] = useState('')

  function updateField<
    K extends keyof ProfileData
  >(
    key: K,
    value: ProfileData[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  async function handleSave() {
    try {
      setSaving(true)
      setMessage('')

      const {
        error,
      } = await supabase
        .from('profiles')
        .upsert({
          id: form.id,
          email:
            form.email,
          name:
            form.name,
          phone:
            form.phone,
          country:
            form.country,
          company:
            form.company,
          bio:
            form.bio,
          avatar_url:
            form.avatar_url,
          email_notifications:
            form.email_notifications,
          marketing_notifications:
            form.marketing_notifications,
        })

      if (error)
        throw error

      setMessage(
        'Profile updated successfully.'
      )
    } catch (error) {
      console.error(
        error
      )

      setMessage(
        'Unable to save profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid xl:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="xl:col-span-2 space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              icon={User}
              label="Full Name"
              value={
                form.name
              }
              onChange={(
                v: string
              ) =>
                updateField(
                  'name',
                  v
                )
              }
            />

            <InputField
              icon={Mail}
              label="Email"
              value={
                form.email
              }
              disabled
              onChange={() => {}}
            />

            <InputField
              icon={Phone}
              label="Phone"
              value={
                form.phone ||
                ''
              }
              onChange={(
                v: string
              ) =>
                updateField(
                  'phone',
                  v
                )
              }
            />

            <InputField
              icon={
                MapPin
              }
              label="Country"
              value={
                form.country ||
                ''
              }
              onChange={(
                v: string
              ) =>
                updateField(
                  'country',
                  v
                )
              }
            />

            <InputField
              icon={
                Building2
              }
              label="Company"
              value={
                form.company ||
                ''
              }
              onChange={(
                v: string
              ) =>
                updateField(
                  'company',
                  v
                )
              }
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Bio
            </label>

            <div className="relative">
              <FileText className="w-4 h-4 absolute top-4 left-4 text-slate-400" />

              <textarea
                rows={4}
                value={
                  form.bio ||
                  ''
                }
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement>
                ) =>
                  updateField(
                    'bio',
                    e
                      .target
                      .value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Preferences
          </h2>

          <div className="space-y-4">
            <ToggleRow
              icon={Bell}
              title="Email Notifications"
              checked={
                form.email_notifications ??
                true
              }
              onChange={(
                v: boolean
              ) =>
                updateField(
                  'email_notifications',
                  v
                )
              }
            />

            <ToggleRow
              icon={
                Megaphone
              }
              title="Marketing Updates"
              checked={
                form.marketing_notifications ??
                false
              }
              onChange={(
                v: boolean
              ) =>
                updateField(
                  'marketing_notifications',
                  v
                )
              }
            />
          </div>
        </section>
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-[#0F4C5C] to-[#1F4E79] text-white flex items-center justify-center text-2xl font-bold">
            {(
              form.name ||
              form.email
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {form.name ||
              'Client'}
          </h3>

          <p className="text-sm text-slate-500">
            {form.email}
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={
              handleSave
            }
            disabled={
              saving
            }
            className="w-full h-12 rounded-2xl bg-[#0F4C5C] text-white font-semibold hover:bg-[#123d49] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />

            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>

          {message && (
            <p className="text-sm text-center text-slate-500 mt-4">
              {message}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

/* -------------------------------- */

interface InputFieldProps {
  icon: LucideIcon
  label: string
  value: string
  onChange: (
    value: string
  ) => void
  disabled?: boolean
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  disabled = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label}
      </label>

      <div className="relative">
        <Icon className="w-4 h-4 absolute top-4 left-4 text-slate-400" />

        <input
          value={value}
          disabled={
            disabled
          }
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            onChange(
              e.target
                .value
            )
          }
          className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 disabled:bg-slate-50"
        />
      </div>
    </div>
  )
}

interface ToggleRowProps {
  icon: LucideIcon
  title: string
  checked: boolean
  onChange: (
    value: boolean
  ) => void
}

function ToggleRow({
  icon: Icon,
  title,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-700" />
        </div>

        <p className="font-medium text-slate-900">
          {title}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(
            !checked
          )
        }
        className={`w-12 h-7 rounded-full p-1 transition ${
          checked
            ? 'bg-[#0F4C5C]'
            : 'bg-slate-300'
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white transition ${
            checked
              ? 'translate-x-5'
              : ''
          }`}
        />
      </button>
    </div>
  )
}