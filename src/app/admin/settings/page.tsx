// src/app/admin/settings/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { 
  ArrowLeft, 
  Save, 
  Store, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Truck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  MapPin,
  Percent,
  DollarSign
} from 'lucide-react'

export const metadata = {
  title: 'Settings | Tefetro Admin',
  description: 'Manage system settings and configuration',
}

export const dynamic = 'force-dynamic'

// Fetch current settings
async function getSettings() {
  const { data } = await adminClient
    .from('site_settings')
    .select('*')
    .single()
  
  return data || {
    store_name: 'Tefetro',
    store_email: 'support@tefetro.com',
    store_phone: '',
    store_address: '',
    currency: 'USD',
    tax_rate: 0,
    shipping_fee: 0,
    free_shipping_threshold: null,
    email_notifications: true,
    order_notifications: true,
    marketing_emails: false,
    maintenance_mode: false,
    theme: 'light'
  }
}

// Update settings action
async function updateSettings(formData: FormData) {
  'use server'
  
  const session = await verifyAdmin()
  if (!session.user) redirect('/login')

  const settings = {
    store_name: formData.get('store_name') as string,
    store_email: formData.get('store_email') as string,
    store_phone: formData.get('store_phone') as string,
    store_address: formData.get('store_address') as string,
    currency: formData.get('currency') as string,
    tax_rate: parseFloat(formData.get('tax_rate') as string) || 0,
    shipping_fee: parseFloat(formData.get('shipping_fee') as string) || 0,
    free_shipping_threshold: formData.get('free_shipping_threshold') 
      ? parseFloat(formData.get('free_shipping_threshold') as string) 
      : null,
    email_notifications: formData.get('email_notifications') === 'on',
    order_notifications: formData.get('order_notifications') === 'on',
    marketing_emails: formData.get('marketing_emails') === 'on',
    maintenance_mode: formData.get('maintenance_mode') === 'on',
    theme: formData.get('theme') as string,
    updated_at: new Date().toISOString(),
    updated_by: session.user.id
  }

  const { error } = await adminClient
    .from('site_settings')
    .upsert(settings, { onConflict: 'id' })

  if (error) {
    console.error('Failed to update settings:', error)
    throw new Error('Failed to save settings')
  }

  await adminClient.from('audit_logs').insert({
    user_id: session.user.id,
    event: 'settings_updated',
    metadata: { description: 'System settings updated' },
  })

  revalidatePath('/admin/settings')
  redirect('/admin/settings?success=true')
}

export default async function SettingsPage({ 
  searchParams 
}: { 
  searchParams: { success?: string; tab?: string } 
}) {
  const session = await verifyAdmin()
  if (!session.user) redirect('/login')

  const settings = await getSettings()
  const showSuccess = searchParams.success === 'true'
  const activeTab = searchParams.tab || 'general'

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  ]

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shipping', label: 'Shipping & Tax', icon: Truck },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-mist/30 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center justify-center w-10 h-10 rounded-xl bg-canvas text-deep-600 hover:bg-mist/50 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-deep-800">Settings</h1>
                <p className="text-sm text-mist">Manage your store configuration</p>
              </div>
            </div>
            <form action={updateSettings}>
              <button type="submit" className="px-6 py-2.5 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-all shadow-lg shadow-tefetra/20 flex items-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700">
            <CheckCircle2 size={20} />
            <p className="font-medium">Settings saved successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-white rounded-2xl border border-mist/30 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <Link key={tab.id} href={`/admin/settings?tab=${tab.id}`} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-tefetra/10 text-tefetra' : 'text-deep-600 hover:bg-canvas'}`}>
                    <Icon size={18} />
                    {tab.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 bg-white rounded-2xl border border-mist/30 p-6">
              <h3 className="font-semibold text-deep-700 mb-4 flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                System Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-mist">Version</span><span className="text-deep-700 font-medium">1.0.0</span></div>
                <div className="flex justify-between"><span className="text-mist">Environment</span><span className="text-emerald-600 font-medium">Production</span></div>
                <div className="flex justify-between"><span className="text-mist">Database</span><span className="text-emerald-600 font-medium flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Connected</span></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form action={updateSettings} className="space-y-6">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Building2 size={18} className="text-tefetra" />
                        Store Information
                      </h2>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-deep-700">Store Name</label>
                          <input type="text" name="store_name" defaultValue={settings.store_name} className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-deep-700">Store Email</label>
                          <input type="email" name="store_email" defaultValue={settings.store_email} className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-700">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                          <input type="tel" name="store_phone" defaultValue={settings.store_phone} placeholder="+1 (555) 123-4567" className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-700">Store Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-mist" size={18} />
                          <textarea name="store_address" defaultValue={settings.store_address} rows={3} placeholder="Enter your business address..." className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all resize-none" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Globe size={18} className="text-tefetra" />
                        Regional Settings
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-700">Default Currency</label>
                        <select name="currency" defaultValue={settings.currency} className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all appearance-none cursor-pointer">
                          {currencies.map((curr) => (
                            <option key={curr.code} value={curr.code}>{curr.symbol} {curr.code} - {curr.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Mail size={18} className="text-tefetra" />
                        Email Notifications
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <label className="flex items-center justify-between p-4 bg-canvas rounded-xl cursor-pointer hover:bg-mist/30 transition-colors">
                        <div>
                          <p className="font-medium text-deep-700">Order Confirmations</p>
                          <p className="text-sm text-mist">Send email when new orders are placed</p>
                        </div>
                        <input type="checkbox" name="order_notifications" defaultChecked={settings.order_notifications} className="w-5 h-5 text-tefetra rounded border-mist focus:ring-tefetra" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-canvas rounded-xl cursor-pointer hover:bg-mist/30 transition-colors">
                        <div>
                          <p className="font-medium text-deep-700">System Notifications</p>
                          <p className="text-sm text-mist">Important updates and security alerts</p>
                        </div>
                        <input type="checkbox" name="email_notifications" defaultChecked={settings.email_notifications} className="w-5 h-5 text-tefetra rounded border-mist focus:ring-tefetra" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-canvas rounded-xl cursor-pointer hover:bg-mist/30 transition-colors">
                        <div>
                          <p className="font-medium text-deep-700">Marketing Emails</p>
                          <p className="text-sm text-mist">Promotional content and newsletters</p>
                        </div>
                        <input type="checkbox" name="marketing_emails" defaultChecked={settings.marketing_emails} className="w-5 h-5 text-tefetra rounded border-mist focus:ring-tefetra" />
                      </label>
                    </div>
                  </section>
                </div>
              )}

              {/* Shipping & Tax Settings */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Truck size={18} className="text-tefetra" />
                        Shipping Configuration
                      </h2>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-deep-700">Standard Shipping Fee</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                            <input type="number" name="shipping_fee" step="0.01" min="0" defaultValue={settings.shipping_fee} className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-deep-700">Free Shipping Threshold</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                            <input type="number" name="free_shipping_threshold" step="0.01" min="0" defaultValue={settings.free_shipping_threshold || ''} placeholder="No free shipping" className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                          </div>
                          <p className="text-xs text-mist">Leave empty to disable free shipping</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Percent size={18} className="text-tefetra" />
                        Tax Configuration
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-deep-700">Default Tax Rate (%)</label>
                        <div className="relative max-w-xs">
                          <input type="number" name="tax_rate" step="0.01" min="0" max="100" defaultValue={settings.tax_rate} className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-mist">%</span>
                        </div>
                        <p className="text-xs text-mist">Applied to all products unless specified otherwise</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-mist/20 bg-gradient-to-r from-tefetra/5 to-transparent">
                      <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                        <Palette size={18} className="text-tefetra" />
                        Theme Settings
                      </h2>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-deep-700">Admin Theme</label>
                        <div className="grid grid-cols-3 gap-4">
                          <label className="cursor-pointer">
                            <input type="radio" name="theme" value="light" defaultChecked={settings.theme === 'light'} className="sr-only peer" />
                            <div className="p-4 rounded-xl border-2 border-mist peer-checked:border-tefetra peer-checked:bg-tefetra/5 transition-all text-center">
                              <div className="w-8 h-8 bg-white border-2 border-mist rounded-lg mx-auto mb-2 shadow-sm" />
                              <span className="text-sm font-medium text-deep-700">Light</span>
                            </div>
                          </label>
                          <label className="cursor-pointer">
                            <input type="radio" name="theme" value="dark" defaultChecked={settings.theme === 'dark'} className="sr-only peer" />
                            <div className="p-4 rounded-xl border-2 border-mist peer-checked:border-tefetra peer-checked:bg-tefetra/5 transition-all text-center">
                              <div className="w-8 h-8 bg-deep-800 border-2 border-deep-600 rounded-lg mx-auto mb-2 shadow-sm" />
                              <span className="text-sm font-medium text-deep-700">Dark</span>
                            </div>
                          </label>
                          <label className="cursor-pointer">
                            <input type="radio" name="theme" value="system" defaultChecked={settings.theme === 'system'} className="sr-only peer" />
                            <div className="p-4 rounded-xl border-2 border-mist peer-checked:border-tefetra peer-checked:bg-tefetra/5 transition-all text-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-white to-deep-800 border-2 border-mist rounded-lg mx-auto mb-2 shadow-sm" />
                              <span className="text-sm font-medium text-deep-700">System</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-mist/20 pt-5">
                        <label className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                          <div className="flex items-center gap-3">
                            <AlertCircle size={20} className="text-amber-600" />
                            <div>
                              <p className="font-medium text-amber-800">Maintenance Mode</p>
                              <p className="text-sm text-amber-600">Temporarily disable the storefront</p>
                            </div>
                          </div>
                          <input type="checkbox" name="maintenance_mode" defaultChecked={settings.maintenance_mode} className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Mobile Save Button */}
              <div className="lg:hidden">
                <button type="submit" className="w-full px-6 py-3 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-all shadow-lg shadow-tefetra/20 flex items-center justify-center gap-2">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}