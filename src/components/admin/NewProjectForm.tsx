// src/components/admin/NewProjectForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  Loader2,
  ChevronDown,
  Info,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  X
} from 'lucide-react'

interface Order {
  id: string
  email: string
  total: number
  created_at: string
  addons: any[]
  product: { id: string; title: string } | null
  user_id: string | null
}

interface NewProjectFormProps {
  eligibleOrders: Order[]
}

const SERVICE_TYPES = [
  { 
    value: 'architectural_supervision', 
    label: 'Architectural Supervision', 
    description: 'On-site construction supervision and quality control',
    icon: Building2
  },
  { 
    value: 'project_management', 
    label: 'Project Management', 
    description: 'End-to-end project coordination and timeline management',
    icon: Calendar
  },
  { 
    value: 'contracting', 
    label: 'Contracting', 
    description: 'Construction and contracting services',
    icon: Briefcase
  },
  { 
    value: 'consultation', 
    label: 'Consultation', 
    description: 'Expert architectural consultation and advisory',
    icon: Info
  },
  { 
    value: 'renovation', 
    label: 'Renovation', 
    description: 'Renovation and remodeling services',
    icon: MapPin
  },
]

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'review', label: 'Under Review', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
]

export function NewProjectForm({ eligibleOrders }: NewProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('pending')
  const [formError, setFormError] = useState<string | null>(null)
  const [showOrderDropdown, setShowOrderDropdown] = useState(false)
  
  // Additional fields state
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDropdown(false)
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOrder) {
      setFormError('Please select an order')
      return
    }
    
    if (!selectedService) {
      setFormError('Please select a service type')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: selectedOrder.id,
            user_id: selectedOrder.user_id,
            service_type: selectedService,
            status: selectedStatus,
            location,
            notes,
            start_date: startDate || null,
            due_date: dueDate || null,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create project')
        }

        const data = await response.json()
        router.push('/admin/projects?view=kanban')
        router.refresh()
      } catch (err: any) {
        setFormError(err.message || 'Something went wrong')
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-canvas pb-20">
      {/* Header */}
      <div className="bg-white border-b border-mist/30 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/projects"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-canvas text-deep-600 hover:bg-mist/50 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-deep-800">New Project</h1>
                <p className="text-sm text-mist">Create from completed order</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/admin/projects"
                className="px-4 py-2 text-deep-600 hover:text-deep-800 font-medium transition-colors hidden sm:block"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Alert */}
          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-rose-700">{formError}</p>
              </div>
              <button 
                onClick={() => setFormError(null)}
                className="text-rose-400 hover:text-rose-600"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Order Selection */}
          <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-mist/20 bg-canvas/50">
              <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                <Briefcase size={18} className="text-tefetra" />
                Linked Order <span className="text-rose-500">*</span>
              </h2>
            </div>
            
            <div className="p-6">
              {eligibleOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-medium text-deep-700 mb-2">No Eligible Orders</h3>
                  <p className="text-mist text-sm mb-4 max-w-sm mx-auto">
                    No completed orders with service addons found. Projects can only be created from orders with architectural services.
                  </p>
                  <Link 
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-tefetra text-white rounded-xl text-sm font-medium hover:bg-tefetra-600 transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Custom Order Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-deep-700 mb-2">
                      Select Order
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowOrderDropdown(!showOrderDropdown)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 bg-canvas border rounded-xl text-left transition-all
                        ${showOrderDropdown ? 'border-tefetra ring-2 ring-tefetra/20' : 'border-mist hover:border-tefetra/30'}
                      `}
                    >
                      {selectedOrder ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-tefetra/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-tefetra" />
                          </div>
                          <div>
                            <p className="font-medium text-deep-800">{selectedOrder.product?.title || 'Product'}</p>
                            <p className="text-sm text-mist">{selectedOrder.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-mist">Choose a completed order...</span>
                      )}
                      <ChevronDown className={`w-5 h-5 text-mist transition-transform ${showOrderDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showOrderDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setShowOrderDropdown(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-mist/30 rounded-2xl shadow-xl z-50 max-h-80 overflow-auto">
                          <div className="p-2">
                            {eligibleOrders.map((order) => (
                              <button
                                key={order.id}
                                type="button"
                                onClick={() => handleOrderSelect(order)}
                                className={`
                                  w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors
                                  ${selectedOrder?.id === order.id ? 'bg-tefetra/10 border border-tefetra/20' : 'hover:bg-canvas'}
                                `}
                              >
                                <div className="w-10 h-10 rounded-lg bg-canvas flex items-center justify-center shrink-0">
                                  <Building2 className="w-5 h-5 text-mist" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-deep-800 truncate">
                                    {order.product?.title || 'Architectural Plan'}
                                  </p>
                                  <p className="text-sm text-mist truncate">{order.email}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-semibold text-tefetra">{formatCurrency(order.total)}</p>
                                  <p className="text-xs text-mist">{formatDate(order.created_at)}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Selected Order Details */}
                  {selectedOrder && (
                    <div className="bg-canvas rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist">Order ID</span>
                        <span className="font-mono text-sm text-deep-700">{selectedOrder.id.slice(0, 12)}...</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist">Client</span>
                        <span className="text-sm text-deep-700">{selectedOrder.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist">Amount</span>
                        <span className="font-semibold text-tefetra">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist">Services</span>
                        <span className="text-sm text-deep-700">
                          {selectedOrder.addons?.filter((a: any) => a.type === 'service').length || 0} service(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Service Type */}
          <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-mist/20 bg-canvas/50">
              <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                <Info size={18} className="text-tefetra" />
                Service Type <span className="text-rose-500">*</span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid gap-3">
                {SERVICE_TYPES.map((service) => {
                  const Icon = service.icon
                  const isSelected = selectedService === service.value
                  
                  return (
                    <label 
                      key={service.value}
                      className={`
                        relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-tefetra bg-tefetra/5' 
                          : 'border-mist bg-canvas hover:border-tefetra/30'}
                      `}
                    >
                      <input
                        type="radio"
                        name="service_type"
                        value={service.value}
                        checked={isSelected}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                        ${isSelected ? 'bg-tefetra text-white' : 'bg-white text-mist'}
                      `}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className={`
                          font-semibold mb-1
                          ${isSelected ? 'text-tefetra-700' : 'text-deep-700'}
                        `}>
                          {service.label}
                        </p>
                        <p className="text-sm text-mist">{service.description}</p>
                      </div>
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected ? 'border-tefetra bg-tefetra' : 'border-mist'}
                      `}>
                        {isSelected && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Status Selection */}
          <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-mist/20 bg-canvas/50">
              <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                <FileText size={18} className="text-tefetra" />
                Initial Status
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {STATUS_OPTIONS.map((status) => {
                  const isSelected = selectedStatus === status.value
                  return (
                    <label 
                      key={status.value}
                      className={`
                        relative flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all
                        ${isSelected ? 'border-tefetra bg-tefetra/5' : 'border-mist bg-canvas hover:border-tefetra/30'}
                      `}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={isSelected}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="sr-only"
                      />
                      <span className={`
                        w-2 h-2 rounded-full
                        ${status.value === 'pending' ? 'bg-amber-500' : ''}
                        ${status.value === 'in_progress' ? 'bg-blue-500' : ''}
                        ${status.value === 'review' ? 'bg-purple-500' : ''}
                        ${status.value === 'completed' ? 'bg-emerald-500' : ''}
                      `} />
                      <span className={`font-medium ${isSelected ? 'text-deep-800' : 'text-mist'}`}>
                        {status.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Additional Details */}
          <section className="bg-white rounded-2xl border border-mist/30 shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-mist/20 bg-canvas/50">
              <h2 className="font-semibold text-deep-700 flex items-center gap-2">
                <MapPin size={18} className="text-tefetra" />
                Additional Details
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-deep-700">
                  Project Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Karen, Nairobi"
                    className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="start_date" className="block text-sm font-medium text-deep-700">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                    <input
                      type="date"
                      id="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="due_date" className="block text-sm font-medium text-deep-700">
                    Target Completion
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                    <input
                      type="date"
                      id="due_date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-deep-700">
                  Internal Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Private notes for team members..."
                  className="w-full px-4 py-3 bg-canvas border border-mist rounded-xl text-deep-800 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Tips */}
          <div className="bg-gradient-to-r from-tefetra/5 to-transparent border border-tefetra/20 rounded-2xl p-6">
            <h3 className="font-semibold text-deep-700 mb-3 flex items-center gap-2">
              <Info size={18} className="text-tefetra" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-mist">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-tefetra mt-0.5 shrink-0" />
                <span>Projects are linked to completed orders with service addons</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-tefetra mt-0.5 shrink-0" />
                <span>Status can be updated anytime from the kanban board</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-tefetra mt-0.5 shrink-0" />
                <span>Client details are automatically pulled from the selected order</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/projects"
              className="px-6 py-2.5 text-deep-600 hover:text-deep-800 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || eligibleOrders.length === 0}
              className={`
                px-8 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2
                ${isPending || eligibleOrders.length === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-tefetra text-white hover:bg-tefetra-600 shadow-lg shadow-tefetra/20 hover:shadow-xl hover:-translate-y-0.5'}
              `}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}