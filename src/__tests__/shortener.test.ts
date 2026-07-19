import { describe, it, expect, vi } from 'vitest'
import { POST } from '../app/api/shorten/route'
import { GET } from '../app/s/[code]/route'

// Mock Supabase
const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 1, short_code: 'abcd12', original_url: 'https://example.com' }, error: null }) }) })
const mockEq = vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 1, original_url: 'https://example.com', clicks: 0 }, error: null }) })
const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ then: vi.fn() }) })

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    from: vi.fn().mockImplementation((table) => {
      if (table === 'short_links') {
        return {
          insert: mockInsert,
          select: mockSelect,
          update: mockUpdate,
        }
      }
    })
  })
}))

describe('URL Shortener API', () => {
  it('POST /api/shorten should create a short URL', async () => {
    const request = new Request('http://localhost:3000/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1'
      }
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.shortUrl).toBeDefined()
    expect(json.shortCode).toBeDefined()
    expect(json.originalUrl).toBe('https://example.com')
  })

  it('POST /api/shorten should reject invalid URLs', async () => {
    const request = new Request('http://localhost:3000/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'javascript:alert(1)' }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.2'
      }
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('GET /s/[code] should redirect to original URL', async () => {
    const request = new Request('http://localhost:3000/s/abcd12')
    const response = await GET(request, { params: Promise.resolve({ code: 'abcd12' }) })
    
    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe('https://example.com/')
  })
})
