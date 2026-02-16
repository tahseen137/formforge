import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-white">FormForge</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          Your form backend in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">30 seconds</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Stop writing backend code for simple forms. Get a submission endpoint instantly and focus on building great products.
        </p>
        <Link 
          href={user ? "/dashboard" : "/signup"}
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-lg transition shadow-lg shadow-blue-500/50"
        >
          Get Started Free
        </Link>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How it works</h2>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm ml-2">index.html</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`<form action="https://formforge.dev/api/submit/abc123" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>`}</code>
            </pre>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-2">Create Endpoint</h3>
              <p className="text-gray-400 text-sm">Generate a unique form URL in the dashboard</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-white font-semibold mb-2">Point Your Form</h3>
              <p className="text-gray-400 text-sm">Update your HTML form&apos;s action attribute</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
              <div className="text-3xl mb-2">📬</div>
              <h3 className="text-white font-semibold mb-2">Receive Submissions</h3>
              <p className="text-gray-400 text-sm">View submissions in dashboard and get email notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Features</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">⚡ Instant Setup</h3>
            <p className="text-gray-400">No configuration needed. Create an endpoint and start collecting submissions immediately.</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">📧 Email Notifications</h3>
            <p className="text-gray-400">Get notified instantly when someone submits your form.</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">🎨 Works Anywhere</h3>
            <p className="text-gray-400">Pure HTML forms, React, Vue, or any frontend framework.</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">🔒 Spam Protection</h3>
            <p className="text-gray-400">Built-in protection against bots and malicious submissions.</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">📊 Dashboard</h3>
            <p className="text-gray-400">View all your submissions in a beautiful, organized dashboard.</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur rounded-lg p-6 border border-blue-800/20">
            <h3 className="text-xl font-semibold text-white mb-2">🚀 Zero Lost Leads</h3>
            <p className="text-gray-400">Submissions are always saved — even if email delivery fails.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          Start free, upgrade when you need more. No hidden fees, no surprises.
        </p>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-gray-800/30 backdrop-blur rounded-xl p-8 border border-blue-800/20">
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <p className="text-gray-400 mb-4">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-300 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> 
                <span><strong>100 submissions</strong>/month</span>
              </li>
              <li className="text-gray-300 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> 3 form endpoints
              </li>
              <li className="text-gray-300 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Email notifications
              </li>
              <li className="text-gray-300 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Spam protection
              </li>
              <li className="text-gray-300 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Dashboard access
              </li>
            </ul>
            <Link 
              href={user ? "/dashboard" : "/signup"}
              className="block text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-semibold"
            >
              Get Started
            </Link>
          </div>
          
          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur rounded-xl p-8 border-2 border-blue-500/50 relative">
            <div className="absolute -top-3 right-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-gray-300 mb-4">For growing businesses</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$9</span>
              <span className="text-gray-300">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <span><strong>Unlimited submissions</strong></span>
              </li>
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Unlimited forms
              </li>
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Priority email delivery
              </li>
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Custom redirects
              </li>
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Export to CSV
              </li>
              <li className="text-gray-200 flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Priority support
              </li>
            </ul>
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="block text-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition shadow-lg shadow-blue-500/30 font-semibold"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur rounded-2xl p-12 border border-blue-500/30 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to stop losing leads?</h2>
          <p className="text-gray-300 mb-8">
            Join developers who trust FormForge to handle their form submissions.
          </p>
          <Link 
            href={user ? "/dashboard" : "/signup"}
            className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-gray-400">FormForge</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 FormForge. Built with Next.js and Tailwind CSS.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="https://github.com/tahseen137/formforge" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
