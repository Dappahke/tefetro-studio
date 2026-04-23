// src/components/blog/GuestBlogForm.tsx
// REPLACE YOUR ENTIRE FILE WITH THIS - NO EXTERNAL DEPENDENCIES

'use client'

import { useState } from 'react'

export function GuestBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}
    
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const profession = formData.get('profession') as string
    const authorBio = formData.get('authorBio') as string
    const articleTitle = formData.get('articleTitle') as string
    const category = formData.get('category') as string
    const excerpt = formData.get('excerpt') as string
    const articleContent = formData.get('articleContent') as string
    const agreeTerms = formData.get('agreeTerms')

    if (!fullName || fullName.length < 2) newErrors.fullName = 'Name is required'
    if (!email || !email.includes('@')) newErrors.email = 'Valid email required'
    if (!profession) newErrors.profession = 'Profession is required'
    if (!authorBio || authorBio.length < 50) newErrors.authorBio = 'Bio must be at least 50 characters'
    if (!articleTitle || articleTitle.length < 5) newErrors.articleTitle = 'Title must be at least 5 characters'
    if (!category) newErrors.category = 'Select a category'
    if (!excerpt || excerpt.length < 50) newErrors.excerpt = 'Excerpt must be at least 50 characters'
    if (!articleContent || articleContent.split(/\s+/).length < 100) newErrors.articleContent = 'Article must be at least 100 words'
    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    if (!validateForm(formData)) return

    setIsSubmitting(true)
    
    const data = Object.fromEntries(formData.entries())
    // @ts-ignore
    data.wordCount = wordCount

    try {
      const response = await fetch('/api/guest-blog/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitSuccess(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-2xl text-[#0f172a] mb-3">Submission Received!</h3>
        <p className="text-[#475569] max-w-md mx-auto">
          Thank you for your contribution. Our editorial team will review your article within 5 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Author Info */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg text-[#0f172a] pb-2 border-b border-[#0f2a44]/10">
          Author Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              Full Name <span className="text-[#e66b00]">*</span>
            </label>
            <input 
              name="fullName" 
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
              placeholder="John Doe" 
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              Email <span className="text-[#e66b00]">*</span>
            </label>
            <input 
              name="email" 
              type="email" 
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
              placeholder="john@example.com" 
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              Profession <span className="text-[#e66b00]">*</span>
            </label>
            <input 
              name="profession" 
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
              placeholder="Senior Architect" 
            />
            {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">Company</label>
            <input 
              name="company" 
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
              placeholder="Acme Architects Ltd" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">Website / Portfolio</label>
          <input 
            name="website" 
            type="url" 
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
            placeholder="https://yourportfolio.com" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Short Bio <span className="text-[#e66b00]">*</span>
            <span className="text-[#475569] font-normal ml-2">(50-300 chars)</span>
          </label>
          <textarea 
            name="authorBio" 
            rows={3} 
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all resize-none" 
            placeholder="Brief bio for your author profile..." 
          />
          {errors.authorBio && <p className="mt-1 text-sm text-red-600">{errors.authorBio}</p>}
        </div>
      </div>

      {/* Article Details */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg text-[#0f172a] pb-2 border-b border-[#0f2a44]/10">
          Article Details
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Article Title <span className="text-[#e66b00]">*</span>
          </label>
          <input 
            name="articleTitle" 
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all" 
            placeholder="SEO-friendly title" 
          />
          {errors.articleTitle && <p className="mt-1 text-sm text-red-600">{errors.articleTitle}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Category <span className="text-[#e66b00]">*</span>
          </label>
          <select 
            name="category" 
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all"
          >
            <option value="">Select category</option>
            <option value="design">Design</option>
            <option value="construction">Construction</option>
            <option value="investment">Investment</option>
            <option value="regulations">Regulations</option>
            <option value="sustainability">Sustainability</option>
            <option value="interiors">Interiors</option>
            <option value="landscaping">Landscaping</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Excerpt <span className="text-[#e66b00]">*</span>
          </label>
          <textarea 
            name="excerpt" 
            rows={3} 
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all resize-none" 
            placeholder="Compelling summary for search results..." 
          />
          {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Article Content <span className="text-[#e66b00]">*</span>
            <span className="text-[#475569] font-normal ml-2">(Min 100 words)</span>
          </label>
          <div className="relative">
            <textarea
              name="articleContent"
              rows={12}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl text-[#0f172a] placeholder:text-[#475569]/50 focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all resize-none font-mono text-sm"
              placeholder="Full article content..."
              onChange={(e) => setWordCount(e.target.value.trim().split(/\s+/).length)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-[#475569] bg-white px-2 py-1 rounded border">
              {wordCount} words
            </div>
          </div>
          {errors.articleContent && <p className="mt-1 text-sm text-red-600">{errors.articleContent}</p>}
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input name="agreeTerms" type="checkbox" id="terms" className="mt-1 w-5 h-5 text-[#e66b00] rounded" />
        <label htmlFor="terms" className="text-sm text-[#475569]">
          I confirm this is original content, grant Tefetro Studios publication rights, and agree to the{' '}
          <a href="/terms" className="text-[#e66b00] hover:underline">Guest Contributor Terms</a>
        </label>
      </div>
      {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#0f2a44] text-white font-semibold rounded-xl hover:bg-[#e66b00] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  )
}