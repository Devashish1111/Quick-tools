import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    const userId = session.metadata?.userId
    const customerId = session.customer as string

    if (userId) {
      // Update user in Supabase to 'PRO' status
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          stripe_customer_id: customerId,
          is_pro: true,
        })
      
      if (error) {
        console.error('Error updating user profile:', error)
        return new NextResponse('Database Error', { status: 500 })
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    // Downgrade user
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ is_pro: false })
      .eq('stripe_customer_id', customerId)
      
    if (error) {
      console.error('Error downgrading user profile:', error)
      return new NextResponse('Database Error', { status: 500 })
    }
  }

  return new NextResponse('OK', { status: 200 })
}
