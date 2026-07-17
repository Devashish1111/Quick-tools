import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const checkoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    let user;
    
    // 1. Defensive Auth Check
    try {
      const authResult = await supabase.auth.getUser()
      user = authResult.data?.user
    } catch (authError) {
      console.error('Supabase Auth Error during checkout:', authError)
      return NextResponse.json({ error: 'Auth service is temporarily unavailable.' }, { status: 503 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    // 2. Validate JSON Payload
    let body;
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { priceId } = validationResult.data

    // 3. Defensive Stripe Checkout
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        customer_email: user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
        },
      })

      if (!session.url) {
        throw new Error('Stripe returned a session without a URL')
      }

      return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (stripeError: any) {
      console.error('Stripe Error:', stripeError)
      return NextResponse.json(
        { error: 'Payment service is temporarily unavailable. Please try again later.' },
        { status: 502 } // Bad Gateway (Stripe issue)
      )
    }

  } catch (error) {
    console.error('Unhandled checkout error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    )
  }
}
