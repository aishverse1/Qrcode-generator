'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyRefer = () => {
    navigator.clipboard.writeText('https://upidirectpay.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-navy text-lg tracking-tight">UPIDirectPay.com</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-slate-600 hover:text-navy hidden sm:block">Features</a>
            <Link href="/get-started" className="bg-blue-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-dark transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span>Zero Commission</span>
          <span className="w-1.5 h-1.5 bg-blue-primary rounded-full" />
          <span>Direct to your bank account</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-navy mb-6 leading-tight max-w-2xl mx-auto">
          Accept UPI Payments<br />Without the Middleman
        </h1>
        <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Generate QR codes and payment links that send money directly to your bank. No Razorpay, no 2% fee, no settlement delays.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/get-started" className="bg-blue-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-dark transition shadow-lg shadow-blue-primary/25">
            Start Accepting Payments — Free
          </Link>
          <a href="#features" className="text-slate-600 px-6 py-3.5 rounded-xl text-base font-medium hover:text-navy transition hidden sm:block">
            See how it works
          </a>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
              <div className="text-red-500 font-semibold text-sm mb-2">With Other Platforms</div>
              <div className="text-3xl font-bold text-red-500 mb-4">2%</div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Platform fee per transaction</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Settlement delays</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Account suspension risk</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Hidden charges</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <div className="text-green-600 font-semibold text-sm mb-2">With UPIDirectPay.com</div>
              <div className="text-3xl font-bold text-green-600 mb-4">0%</div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Money goes direct to your bank</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Instant settlement</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> You own the payment flow</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> No middleman, no cuts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold text-navy mb-4">Everything you need to collect payments</h2>
          <p className="text-slate-500">Simple, fast, and zero-cost. Just share a link or QR code.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { title: 'QR Code Generator', desc: 'Generate NPCI-compliant QR codes for any amount in seconds', icon: '⬡', color: 'from-blue-500 to-blue-600' },
            { title: 'Shareable Links', desc: 'Send payment links via WhatsApp, SMS, email — customer pays in one tap', icon: '↗', color: 'from-purple-500 to-purple-600' },
            { title: 'No Account Needed', desc: "Don't sign up. Just enter your VPA and start collecting immediately", icon: '⚡', color: 'from-amber-500 to-amber-600' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center hover:shadow-md transition">
              <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-sm`}>{f.icon}</div>
              <h3 className="font-semibold text-navy mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold text-navy mb-4">How It Works</h2>
          <p className="text-slate-500">Three steps. No paperwork. No waiting.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { step: '1', title: 'Enter Your VPA', desc: "Add your UPI ID / VPA — that's all we need to get started" },
            { step: '2', title: 'Generate QR or Link', desc: 'Create a QR code or shareable link for any amount' },
            { step: '3', title: 'Share & Collect', desc: 'Send it to your customer — payment arrives directly in your bank' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-blue-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">{s.step}</div>
              <h3 className="font-semibold text-navy mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to collect payments?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto">No sign-up required. No commission. Just your VPA and you're live.</p>
          <Link href="/get-started" className="inline-block bg-white text-blue-primary px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition shadow-lg">
            Generate Your Free QR Code
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-4">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>© 2026 UPIDirectPay.com — Zero-commission UPI payments for Indian merchants.</p>
        </div>
      </footer>
    </div>
  )
}
