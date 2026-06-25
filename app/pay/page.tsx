'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MOBILE_UA_REGEX, isValidVpa } from '@/lib/upi'

function isMobileUA(ua: string) {
  return MOBILE_UA_REGEX.test(ua)
}

function sanitize(str: string | null | undefined): string {
  if (!str) return ''
  return decodeURIComponent(str.replace(/\+/g, ' ')).trim()
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">
      {copied ? (
        <span className="text-green-600">✓ Copied</span>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function PayPageInner() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'mobile' | 'desktop' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const pa = sanitize(searchParams.get('pa'))
  const pn = sanitize(searchParams.get('pn'))
  const am = searchParams.get('am') ? parseFloat(searchParams.get('am')!) : null

  const handleMobileRedirect = useCallback(() => {
    if (!pa || !isValidVpa(pa)) return

    const name = pn || 'Merchant'
    const encodedName = encodeURIComponent(name)
    const encodedRemark = encodeURIComponent('UPIDirectPay')
    let upiLink = `upi://pay?pa=${pa}&pn=${encodedName}&tn=${encodedRemark}&cu=INR`
    if (am && am > 0) {
      upiLink += `&am=${am.toFixed(2)}`
    }

    window.location.href = upiLink

    setTimeout(() => {
      setStatus('desktop')
    }, 2000)
  }, [pa, pn, am])

  useEffect(() => {
    if (!pa) {
      setStatus('error')
      setErrorMsg('Missing required parameter: pa (UPI ID)')
      return
    }

    if (!isValidVpa(pa)) {
      setStatus('error')
      setErrorMsg(`"${pa}" is not a valid UPI ID`)
      return
    }

    const ua = navigator.userAgent
    if (isMobileUA(ua)) {
      setStatus('mobile')
      handleMobileRedirect()
    } else {
      setStatus('desktop')
    }
  }, [pa, handleMobileRedirect])

  // ── Error state ───────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">UPIDirectPay.com</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Invalid Payment Request</h1>
            <p className="text-slate-500 text-sm mb-6">{errorMsg}</p>
            <Link href="/" className="text-violet-600 text-sm font-medium hover:underline">
              Go to homepage
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // ── Mobile: redirecting ───────────────────────────────────
  if (status === 'mobile') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">UPIDirectPay.com</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
              {pn?.charAt(0).toUpperCase() || 'M'}
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">{pn || 'Merchant'}</h1>
            {am && am > 0 ? (
              <p className="text-3xl font-bold text-slate-900 mt-2">₹{am.toFixed(2)}</p>
            ) : (
              <p className="text-slate-500 mt-2">Open Amount</p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-violet-600">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-medium">Opening UPI app…</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Desktop: QR code view ─────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">UPIDirectPay.com</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left: QR Code */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center">
            <div className="mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                {pn?.charAt(0).toUpperCase() || 'M'}
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-1">{pn || 'Merchant'}</h1>
              <p className="text-slate-400 text-xs">Payment request</p>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-xl p-4">
                <img
                  src={`/api/pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || '')}${am ? `&am=${am}` : ''}&format=qr`}
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="mx-auto block"
                />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-1">
                {am && am > 0 ? 'Amount to pay' : 'Open Amount'}
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {am && am > 0 ? `₹${am.toFixed(2)}` : 'Pay what you want'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM) to complete your payment securely.
              </p>
            </div>

            <a
              href={`upi://pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || 'Merchant')}${am && am > 0 ? `&am=${am.toFixed(2)}` : ''}&cu=INR`}
              className="block w-full bg-violet-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition text-center"
            >
              Open in UPI App
            </a>

            <p className="text-xs text-slate-400 mt-4 font-mono">Ref: UPIDirectPay</p>
          </div>

          {/* Right: Shareable Link */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Share Payment Link</h2>
            <p className="text-slate-500 text-sm mb-4">Copy the link below to share this payment request</p>
            <CopyButton text={typeof window !== 'undefined' ? window.location.href : ''} label="Copy Link" />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-slate-400 text-xs">
        Powered by <span className="font-medium text-violet-600">UPIDirectPay.com</span>
      </footer>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <svg className="w-8 h-8 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    }>
      <PayPageInner />
    </Suspense>
  )
}