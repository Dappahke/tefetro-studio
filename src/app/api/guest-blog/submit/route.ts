// src/app/api/guest-blog/submit/route.ts
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Calculate word count
    const wordCount = data.articleContent?.trim().split(/\s+/).length || 0
    
    const doc = {
      _type: 'guestSubmission',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      wordCount,
      ...data,
    }
    
    await client.create(doc)
    
    return NextResponse.json({ success: true, message: 'Submission received' })
  } catch (error) {
    console.error('Guest blog submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}