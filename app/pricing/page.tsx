'use client';

import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '3 form endpoints',
      '100 submissions/month',
      'Basic templates',
      'Email notifications',
      'Basic spam protection',
    ],
    cta: 'Get Started',
    href: '/dashboard',
    popular: false,
    priceId: null,
  },
  {
    name: 'Pro',
    price: 19,
    description: 'For growing businesses',
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
    cta: 'Start Pro Trial',
    popular: true,
    priceId: 'pro',
  },
  {
    name: 'Business',
    price: 49,
    description: 'For teams & enterprises',
    features: [
      'Everything in Pro',
      'API access',
      'Webhooks',
      'Team collaboration (up to 10)',
      'White-label forms',
      'Priority support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Start Business Trial',
    popular: false,
    priceId: 'business',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url, error } = await res.json();

      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-white">FormForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/api/portal"
              className="px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Start free and scale as you grow. No hidden fees, cancel anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border backdrop-blur transition-all hover:scale-[1.02] ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/50 shadow-xl shadow-blue-500/20'
                  : 'bg-gray-800/30 border-blue-800/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-blue-400' : 'text-green-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={plan.popular ? 'text-gray-200' : 'text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.priceId ? (
                <button
                  onClick={() => handleCheckout(plan.priceId!)}
                  disabled={loading !== null}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.priceId ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              ) : (
                <Link
                  href={plan.href || '/dashboard'}
                  className="block text-center w-full py-3 px-6 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 border-t border-blue-800/30">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-blue-800/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-gray-400">
              Yes! You can cancel your subscription at any time. You&apos;ll continue to have
              access until the end of your billing period.
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-blue-800/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              What happens if I exceed my submission limit?
            </h3>
            <p className="text-gray-400">
              We&apos;ll notify you when you&apos;re approaching your limit. Once reached, new
              submissions will be queued until the next billing cycle or until you upgrade.
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-blue-800/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-400">
              We offer a 14-day money-back guarantee. If you&apos;re not satisfied, contact us
              for a full refund.
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-blue-800/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Can I switch plans later?
            </h3>
            <p className="text-gray-400">
              Absolutely! You can upgrade or downgrade at any time. Changes take effect
              immediately, and we&apos;ll prorate any charges.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur rounded-2xl p-12 border border-blue-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to supercharge your forms?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of developers who trust FormForge for their form backends.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-lg transition shadow-lg shadow-blue-500/50"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2026 FormForge. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
