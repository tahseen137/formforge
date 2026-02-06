import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build-time errors when env vars aren't set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// For backward compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 form endpoints',
      '100 submissions/month',
      'Basic templates',
      'Email notifications',
      'Basic spam protection',
    ],
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited form endpoints',
      '10,000 submissions/month',
      'Custom branding',
      'File uploads',
      'Conditional logic',
      'Advanced email notifications',
      'Custom redirects',
      'Priority email support',
    ],
  },
  business: {
    name: 'Business',
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      'Everything in Pro',
      'API access',
      'Webhooks',
      'Team collaboration',
      'White-label forms',
      'Priority support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
