import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2026-06-24.dahlia',
  appInfo: {
    name: 'QuickToolbox',
    url: 'https://quicktoolbox.com',
  },
})
