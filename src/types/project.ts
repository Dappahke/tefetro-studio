export interface Project {
  id: string
  order_id: string
  user_id: string | null
  service_type: string
  status: 'pending' | 'contacted' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  created_at: string
  order: {
    id: string
    email: string
    total: number
    product_id: string
    product: { title: string } | null
  } | null
}