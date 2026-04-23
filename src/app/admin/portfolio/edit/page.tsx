// src/app/admin/portfolio/edit/page.tsx - FIXED
import { createClient } from '@/lib/supabase/server'
import PortfolioForm from '@/components/admin/PortfolioForm'

export default async function EditPage({ params }: any) {
  const supabase = await createClient()  // ← Add 'await' here

  const { data: project } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', params.id)
    .single()

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Edit Project</h1>
      <PortfolioForm project={project} />
    </div>
  )
}