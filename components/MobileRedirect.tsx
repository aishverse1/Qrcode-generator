'use client'

import { useEffect, useState } from 'react'
import { buildUpiLink } from '@/lib/upi'

interface MobileRedirectProps {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}

type RedirectState = 'launching' | 'fallback'

const UPI_APPS = [
  {
    name: 'Google Pay',
    shortName: 'GPay',
    emoji: '🔵',
    gradient: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buildLink: (vpa: string, name: string, amount: number | null) =>
      `gpay://upi/pay?pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`,
  },
  {
    name: 'PhonePe',
    shortName: 'PhonePe',
    emoji: '🟣',
    gradient: 'from-purple-500 to-purple-700',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    buildLink: (vpa: string, name: string, amount: number | null) =>
      `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`,
  },
  {
    name: 'Paytm',
    shortName: 'Paytm',
    emoji: '🔷',
    gradient: 'from-sky-400 to-sky-500',
    textColor: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    buildLink: (vpa: string, name: string, amount: number | null) =>
      `paytmmp://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`,
  },
  {
    name: 'BHIM UPI',
    shortName: 'BHIM',
    emoji: '🟢',
    gradient: 'from-green-500 to-green-600',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    buildLink: (vpa: string, name: string, amount: number | null) =>
      buildUpiLink({ vpa, businessName: name, amount, remarkCode: 'UPIDirectPay' }),
  },
]

export default function MobileRedirect({ vpa, businessName, amount, remarkCode }: MobileRedirectProps) {
  const [state, setState] = useState<RedirectState>('launching')
  const [countdown, setCountdown] = useState(3)

  const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode })
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)

  useEffect(() => {
    // Fire UPI deep link
    if (isAndroid) {
      // Android intent scheme for broader compatibility
      const intentLink = `intent://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}&tn=${encodeURIComponent(remarkCode)}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`
      window.location.href = intentLink
    } else {
      // iOS and others — standard upi:// scheme
      window.location.href = upiLink
    }

    // Countdown before showing fallback
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval)
          setState('fallback')
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [upiLink, vpa, businessName, amount, remarkCode, isAndroid, isIOS])

  const initial = businessName.charAt(0).toUpperCase()

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

          {/* Merchant avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
            {initial}
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-1">{businessName}</h1>
          <p className="text-slate-400 text-xs font-mono mb-2">{vpa}</p>

          {amount && amount > 0 ? (
            <p className="text-3xl font-bold text-slate-900 mt-2 mb-6">₹{amount.toFixed(2)}</p>
          ) : (
            <p className="text-slate-500 mt-2 mb-6 text-sm">Open Amount</p>
          )}

          {state === 'launching' ? (
            <>
              {/* Launching state */}
              <div className="flex items-center justify-center gap-3 text-violet-600 mb-4">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm font-medium">Opening your UPI app…</span>
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-slate-400 text-xs">
                Showing manual options in {countdown}s…
              </p>
            </>
          ) : (
            <>
              {/* Fallback state */}
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                No UPI app opened? Choose one below:
              </p>

              <div className="space-y-2.5">
                {UPI_APPS.map(app => (
                  <a
                    key={app.name}
                    href={app.buildLink(vpa, businessName, amount)}
                    className={`flex items-center gap-4 w-full ${app.bgColor} border ${app.borderColor} px-4 py-3.5 rounded-xl transition hover:shadow-md active:scale-[0.98]`}
                  >
                    <span className="text-2xl">{app.emoji}</span>
                    <div className="text-left flex-1">
                      <p className={`text-sm font-semibold ${app.textColor}`}>{app.name}</p>
                      <p className="text-xs text-slate-400">Tap to pay</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Universal fallback */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={upiLink}
                  className="block w-full bg-violet-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition text-center"
                >
                  Open in Any UPI App
                </a>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center max-w-xs leading-relaxed">
          Payment goes directly to the merchant. Zero commission.
        </p>
      </main>
    </div>
  )
}
