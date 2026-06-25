'use client'

import { useEffect, useState } from 'react'
import { buildUpiLink } from '@/lib/upi'

interface QrCardProps {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  embedMode?: boolean
}

export default function QrCard({ vpa, businessName, amount, remarkCode, embedMode = false }: QrCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode })
  const initial = businessName.charAt(0).toUpperCase()

  useEffect(() => {
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upiLink, {
        width: 320,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      }).then(url => setQrDataUrl(url))
    })
  }, [upiLink])

  function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const upiApps = [
    { name: 'GPay',    deepLink: `gpay://upi/pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}` },
    { name: 'PhonePe', deepLink: `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}` },
    { name: 'Paytm',   deepLink: `paytmmp://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}` },
    { name: 'BHIM',    deepLink: upiLink },
  ]

  const appIcons: Record<string, JSX.Element> = {
    GPay: (
      <svg width="28" height="28" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r="24" fill="#fff"/>
        <circle cx="24" cy="24" r="20" fill="#4285F4"/>
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm5.5 9.5h-3v3.5h-2V23.5h-1.5v-2h3V18h2v3.5h1.5v2z" fill="#fff"/>
      </svg>
    ),
    PhonePe: (
      <svg width="28" height="28" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r="24" fill="#fff"/>
        <circle cx="24" cy="24" r="20" fill="#5F259F"/>
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 13c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#fff"/>
      </svg>
    ),
    Paytm: (
      <svg width="28" height="28" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r="24" fill="#fff"/>
        <circle cx="24" cy="24" r="20" fill="#00B9F1"/>
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-2 13h4v-6h-4v6zm0-8h4v-2h-4v2z" fill="#fff"/>
      </svg>
    ),
    BHIM: (
      <svg width="28" height="28" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r="24" fill="#fff"/>
        <circle cx="24" cy="24" r="20" fill="#00784A"/>
        <text x="24" y="30" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">₹</text>
      </svg>
    ),
  }

  return (
    /* ── Outer shell: full screen, everything centered ── */
    <div className={`
      ${embedMode ? 'p-4' : 'min-h-screen bg-slate-50 p-4'}
      flex flex-col items-center justify-center
    `}>

      {/* ── Single centered card ── */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

        {/* Top bar: logo + amount */}
        {!embedMode && (
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-slate-900 font-semibold text-base tracking-tight">UPIDirectPay</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Secure</span>
            </div>
            {amount && amount > 0 && (
              <span className="text-xl font-bold text-slate-900">₹{amount.toFixed(2)}</span>
            )}
          </div>
        )}

        {/* Merchant identity */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-sm truncate">{businessName}</p>
            <p className="text-slate-400 text-xs font-mono truncate">{vpa}</p>
          </div>
        </div>

        {/* QR Code — centered */}
        <div className="flex justify-center px-5 pt-5 pb-3">
          {qrDataUrl ? (
            <img
              src={qrDataUrl} alt="UPI QR Code"
              width={200} height={200}
              className="rounded-xl"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <svg className="w-8 h-8 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Scan hint */}
        <p className="text-center text-xs text-slate-400 pb-4">
          Scan with any UPI app to pay
        </p>

        {/* UPI App buttons — centered grid */}
        {!embedMode && (
          <div className="px-5 pb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Pay with
            </p>
            <div className="grid grid-cols-2 gap-2">
              {upiApps.map(app => (
                <a
                  key={app.name}
                  href={app.deepLink}
                  className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 hover:shadow-md hover:border-slate-200 transition"
                >
                  {appIcons[app.name]}
                  <span className="text-sm font-semibold text-slate-700">{app.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!embedMode && (
          <div className="px-5 pb-5 flex flex-col gap-2">
            <a
              href={upiLink}
              className="block w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold text-center hover:bg-violet-700 transition"
            >
              Open in UPI App
            </a>
            <button
              onClick={copyLink}
              className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium text-center hover:bg-slate-50 transition"
            >
              {copied ? '✓ Link Copied!' : '🔗 Copy Payment Link'}
            </button>
          </div>
        )}

        {/* Embed: just the open button */}
        {embedMode && (
          <div className="px-5 pb-5">
            <a
              href={upiLink}
              className="block w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold text-center hover:bg-violet-700 transition"
            >
              Open in UPI App
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      {!embedMode && (
        <p className="text-slate-400 text-xs mt-5 text-center">
          Powered by UPIDirectPay · Direct to bank · Zero commission
        </p>
      )}
    </div>
  )
}
