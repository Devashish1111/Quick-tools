import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'
import { z } from 'zod'

const shortenSchema = z.object({
  url: z.string().url('Please provide a valid URL to shorten')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Only HTTP and HTTPS URLs are allowed'),
})

// Basic in-memory rate limiting (per-instance)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60000;

export async function POST(request: Request) {
  try {
    // Apply rate limit
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const rateRecord = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (now - rateRecord.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateRecord.count = 1;
      rateRecord.timestamp = now;
    } else {
      rateRecord.count++;
      if (rateRecord.count > RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }
    rateLimitMap.set(ip, rateRecord);

    let body;
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    // 1. Zod Validation
    const validationResult = shortenSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { url } = validationResult.data
    const supabase = await createClient()

    // 2. Defensive Auth Check
    let userId = null
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) userId = user.id
    } catch (authError) {
      console.warn('Auth check failed, proceeding as anonymous:', authError)
    }

    // Generate short code
    const shortCode = crypto.randomBytes(4).toString('base64url').substring(0, 6)

    // 3. Defensive Database Insert
    const { data, error } = await supabase
      .from('short_links')
      .insert([
        { 
          original_url: url, 
          short_code: shortCode,
          user_id: userId
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase DB Error during insertion:', error)
      return NextResponse.json(
        { error: 'Database service is temporarily unavailable. Please try again later.' },
        { status: 503 } // Service Unavailable
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000'
    const shortUrl = `${baseUrl}/s/${shortCode}`

    return NextResponse.json({ shortUrl, shortCode, originalUrl: url })
  } catch (error) {
    console.error('Unhandled internal API error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    )
  }
}
