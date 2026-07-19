import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  
  if (!code) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const supabase = await createClient()

  // Find the short link
  const { data, error } = await supabase
    .from('short_links')
    .select('id, original_url, clicks')
    .eq('short_code', code)
    .single()

  if (error || !data) {
    // If not found, redirect to home page or a 404 page
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Increment clicks in the background
  // Using an rpc function would be better to avoid race conditions,
  // but for simplicity we'll just update it directly
  supabase
    .from('short_links')
    .update({ clicks: data.clicks + 1 })
    .eq('id', data.id)
    .then()

  // Redirect to the original URL with 301 (Permanent Redirect)
  const targetUrl = data.original_url;
  
  // Prevent open redirect abuse (e.g. javascript: or data: URIs)
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }

  return NextResponse.redirect(targetUrl, 301)
}
