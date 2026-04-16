'use client'

import { 
  Bed, 
  Bath, 
  Building2, 
  Maximize, 
  Ruler, 
  FileText, 
  Download, 
  Shield, 
  Clock, 
  CheckCircle2,
  Home,
  Hammer,
  PenTool,
  ArrowRight,
  Search,
  Filter,
  X,
  ChevronDown,
  MapPin,
  CreditCard,
  Lock,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  size?: number
}

// Product spec icons
export function BedIcon({ className, size = 20 }: IconProps) {
  return <Bed size={size} className={cn('text-sage', className)} />
}

export function BathIcon({ className, size = 20 }: IconProps) {
  return <Bath size={size} className={cn('text-sage', className)} />
}

export function FloorsIcon({ className, size = 20 }: IconProps) {
  return <Building2 size={size} className={cn('text-sage', className)} />
}

export function AreaIcon({ className, size = 20 }: IconProps) {
  return <Maximize size={size} className={cn('text-sage', className)} />
}

export function DimensionsIcon({ className, size = 20 }: IconProps) {
  return <Ruler size={size} className={cn('text-sage', className)} />
}

// Feature icons
export function PdfIcon({ className, size = 16 }: IconProps) {
  return (
    <div className={cn('flex items-center gap-1 text-red-500', className)}>
      <FileText size={size} />
      <span className="text-xs font-medium">PDF</span>
    </div>
  )
}

export function DownloadIcon({ className, size = 20 }: IconProps) {
  return <Download size={size} className={cn('', className)} />
}

export function SecureIcon({ className, size = 20 }: IconProps) {
  return <Shield size={size} className={cn('text-sage', className)} />
}

export function InstantIcon({ className, size = 20 }: IconProps) {
  return <Clock size={size} className={cn('text-sage', className)} />
}

export function VerifiedIcon({ className, size = 20 }: IconProps) {
  return <CheckCircle2 size={size} className={cn('text-sage', className)} />
}

// UI icons
export function HomeIcon({ className, size = 20 }: IconProps) {
  return <Home size={size} className={cn('', className)} />
}

export function ConstructionIcon({ className, size = 20 }: IconProps) {
  return <Hammer size={size} className={cn('', className)} />
}

export function DesignIcon({ className, size = 20 }: IconProps) {
  return <PenTool size={size} className={cn('', className)} />
}

export function ArrowRightIcon({ className, size = 20 }: IconProps) {
  return <ArrowRight size={size} className={cn('', className)} />
}

export function SearchIcon({ className, size = 20 }: IconProps) {
  return <Search size={size} className={cn('', className)} />
}

export function FilterIcon({ className, size = 20 }: IconProps) {
  return <Filter size={size} className={cn('', className)} />
}

export function CloseIcon({ className, size = 20 }: IconProps) {
  return <X size={size} className={cn('', className)} />
}

export function ChevronDownIcon({ className, size = 20 }: IconProps) {
  return <ChevronDown size={size} className={cn('', className)} />
}

export function LocationIcon({ className, size = 20 }: IconProps) {
  return <MapPin size={size} className={cn('', className)} />
}

export function PaymentIcon({ className, size = 20 }: IconProps) {
  return <CreditCard size={size} className={cn('', className)} />
}

export function LockIcon({ className, size = 20 }: IconProps) {
  return <Lock size={size} className={cn('', className)} />
}

export function EmailIcon({ className, size = 20 }: IconProps) {
  return <Mail size={size} className={cn('', className)} />
}

export function PhoneIcon({ className, size = 20 }: IconProps) {
  return <Phone size={size} className={cn('', className)} />
}

export function CalendarIcon({ className, size = 20 }: IconProps) {
  return <Calendar size={size} className={cn('', className)} />
}