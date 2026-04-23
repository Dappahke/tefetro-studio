// src/app/blog/submit/page.tsx (No changes needed - it's a client component page)
import { Metadata } from 'next'
import { GuestBlogForm } from '@/components/blog/GuestBlogForm'

export const metadata: Metadata = {
  title: 'Submit Your Article | Guest Blog at Tefetro Studios',
  description: 'Share your architectural expertise with our community. Submit your guest blog post and get featured on Kenya\'s leading PropTech platform.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://tefetro.studio/blog/submit' },
}

export default function SubmitBlogPage() {
  return (
    <main className="min-h-screen bg-[#eaf3fb]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#e66b00]/10 text-[#e66b00] rounded-full text-sm font-medium mb-6">
            Contribute to the Community
          </span>
          <h1 className="font-bold text-4xl lg:text-5xl text-[#0f172a] mb-4 tracking-tight">
            Share Your Expertise
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Join our network of industry professionals. Submit your architectural insights, construction case studies, or property investment analysis for publication.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-[#0f2a44]/5 p-8 lg:p-12">
          <GuestBlogForm />
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '👁️',
              title: 'Wide Reach',
              desc: 'Your article reaches 5,000+ monthly readers including architects, developers, and homeowners.',
              color: 'bg-[#0f2a44]',
            },
            {
              icon: '📈',
              title: 'SEO Backlinks',
              desc: 'Get a do-follow backlink to your portfolio or company website from a high-authority domain.',
              color: 'bg-[#e66b00]',
            },
            {
              icon: '✅',
              title: 'Verified Badge',
              desc: 'Published authors receive a verified contributor badge on their profile and all articles.',
              color: 'bg-[#0f2a44]',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-[#0f2a44]/5">
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 text-white text-xl`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#0f172a] mb-2">{item.title}</h3>
              <p className="text-sm text-[#475569]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}