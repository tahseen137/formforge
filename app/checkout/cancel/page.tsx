import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-blue-800/30 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Checkout Cancelled
          </h1>
          <p className="text-gray-300 mb-8">
            No worries! Your checkout was cancelled and you haven&apos;t been charged.
            You can try again anytime.
          </p>

          <div className="space-y-3">
            <Link
              href="/pricing"
              className="block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition shadow-lg shadow-blue-500/50"
            >
              View Pricing
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            >
              Continue with Free Plan
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Have questions?{' '}
              <a
                href="mailto:support@formforge.app"
                className="text-blue-400 hover:text-blue-300"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
