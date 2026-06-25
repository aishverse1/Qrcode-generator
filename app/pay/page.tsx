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

function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy}
      className={className || "flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"}>
      {copied ? (
        <span>✓ Copied</span>
      ) : (
        label
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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const upiLink = `upi://pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || 'Merchant')}${am && am > 0 ? `&am=${am.toFixed(2)}` : ''}&cu=INR`

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment link created!</h1>
        <p className="text-slate-500 text-sm">Share this link with your customers</p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-6 max-w-4xl w-full px-6 mb-8">
        {/* Left: QR Code Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] p-5 flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
              {pn?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div>
              <div className="font-semibold text-lg leading-tight">{pn || 'Merchant'}</div>
              <div className="text-white/80 text-sm">
                {am && am > 0 ? `₹${am.toFixed(2)} fixed` : 'Open Amount'}
              </div>
            </div>
          </div>
          {/* QR Area */}
          <div className="p-8 flex-1 flex items-center justify-center bg-slate-50/50">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <img
                  src={`/api/pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || '')}${am ? `&am=${am}` : ''}&format=qr`}
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="block"
                />
            </div>
          </div>
          {/* Footer */}
          <div className="py-3 px-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium bg-white">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-slate-700">
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
            </svg>
            Scan with GPay · PhonePe · Paytm · BHIM
          </div>
        </div>

        {/* Right: Shareable Link Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-6 flex flex-col">
          <h2 className="text-xs font-bold text-slate-700 tracking-wide mb-4">SHAREABLE LINK</h2>
          
          <div className="bg-slate-100/80 rounded-lg px-4 py-3 text-sm text-slate-700 mb-4 truncate border border-slate-200/60">
            {currentUrl}
          </div>
          
          <CopyButton 
            text={currentUrl} 
            label="Copy Link" 
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-3 rounded-xl mb-6 transition shadow-sm flex items-center justify-center"
          />
          
          <div className="flex gap-2 mb-2">
            <div className="flex-1 bg-slate-100/80 rounded-lg px-4 py-2 text-sm text-slate-700 truncate flex items-center border border-slate-200/60">
              {upiLink}
            </div>
            <CopyButton 
              text={upiLink} 
              label="Copy UPI" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap border border-slate-200 flex items-center justify-center"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">UPI deep link — paste in apps, messages or emails</p>
        </div>
      </div>

      {/* Bottom Info Box */}
      <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 max-w-2xl w-full mx-6 flex gap-3 text-sm text-slate-700 shadow-sm mb-8">
        <span className="text-xl shrink-0 mt-0.5">💡</span>
        <p className="leading-relaxed">
          Share <span className="font-semibold">{currentUrl}</span> with customers.<br/>
          When they open it on mobile, their UPI app launches automatically.
        </p>
      </div>
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