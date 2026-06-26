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
    brandColor: '#4285F4',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end` : `gpay://upi/pay?${qs}`
    }
  },
  {
    name: 'PhonePe',
    shortName: 'PhonePe',
    brandColor: '#5F259F',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.phonepe.app;end` : `phonepe://pay?${qs}`
    }
  },
  {
    name: 'Paytm',
    shortName: 'Paytm',
    brandColor: '#00B9F1',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=net.one97.paytm;end` : `paytmmp://pay?${qs}`
    }
  },
  {
    name: 'BHIM UPI',
    shortName: 'BHIM',
    brandColor: '#00784A',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=in.org.npci.upiapp;end` : buildUpiLink({ vpa, businessName: name, amount, remarkCode: 'UPIDirectPay' })
    }
  },
]

export default function MobileRedirect({ vpa, businessName, amount, remarkCode }: MobileRedirectProps) {
  const [state, setState] = useState<RedirectState>('launching')
  const [countdown, setCountdown] = useState(3)

  const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode })
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
  const initial = businessName.charAt(0).toUpperCase()

  const universalLink = isAndroid 
    ? `intent://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}&tn=${encodeURIComponent(remarkCode)}#Intent;scheme=upi;end`
    : upiLink

  useEffect(() => {
    if (isAndroid) {
      window.location.href = universalLink
    } else {
      window.location.href = upiLink
    }

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
  }, [upiLink, vpa, businessName, amount, remarkCode, isAndroid])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '18px clamp(24px, 5vw, 48px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--cornflower)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 15 }}>U</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
            UPIDirectPay
          </span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(0,0,0,0.07)',
          padding: 40, maxWidth: 380, width: '100%', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>

          {/* Merchant avatar */}
          <div style={{
            width: 64, height: 64, background: 'var(--cornflower)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(103,117,232,0.3)',
          }}>
            <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 28 }}>
              {initial}
            </span>
          </div>

          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-1)', letterSpacing: '-.03em', marginBottom: 4 }}>
            {businessName}
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
            {vpa}
          </p>

          {amount && amount > 0 ? (
            <p style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink-1)', letterSpacing: '-.04em', marginBottom: 24 }}>
              ₹{amount.toFixed(2)}
            </p>
          ) : (
            <p style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 14 }}>Open Amount</p>
          )}

          {/* Launching state */}
          {state === 'launching' ? (
            <>
              {/* Progress bar */}
              <div style={{
                width: '100%', height: 3, background: '#F0F0F0', borderRadius: 99,
                overflow: 'hidden', marginBottom: 20,
              }}>
                <div style={{
                  height: '100%', background: 'var(--cornflower)', borderRadius: 99,
                  animation: `progressBar ${countdown}s var(--ease-out-expo) forwards`,
                }} />
              </div>
              <style>{`
                @keyframes progressBar {
                  from { width: 0%; }
                  to   { width: 100%; }
                }
              `}</style>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, color: 'var(--cornflower)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cornflower)' }}>
                  Opening your UPI app…
                </span>
              </div>
              <p style={{ color: 'var(--ink-3)', fontSize: 12 }}>
                Showing options in {countdown}s if nothing opens
              </p>
            </>
          ) : (
            /* Fallback state */
            <>
              <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                No UPI app opened? Choose one below:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {UPI_APPS.map(app => (
                  <button key={app.name}
                    onClick={() => { window.location.href = app.buildLink(vpa, businessName, amount, isAndroid) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#F5F5F5',
                      border: '1px solid rgba(0,0,0,0.07)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '13px 16px',
                      textDecoration: 'none',
                      transition: 'background 0.12s',
                      cursor: 'pointer',
                      width: '100%',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#EBEBEB')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#F5F5F5')}>
                    {/* Brand icon */}
                    <div style={{
                      width: 32, height: 32, background: app.brandColor, borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>₹</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-1)', margin: 0 }}>{app.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-3)', margin: 0 }}>Tap to pay</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 5" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Universal fallback */}
              <button
                onClick={() => { window.location.href = universalLink }}
                style={{
                  display: 'block', width: '100%',
                  background: 'var(--cornflower)', color: 'var(--white)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  fontSize: 14, fontWeight: 800,
                  textAlign: 'center', textDecoration: 'none',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cornflower-lighter)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--cornflower)')}>
                Open in Any UPI App
              </button>
            </>
          )}
        </div>
      </main>

      <p style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 11, padding: '16px 24px' }}>
        Payment goes directly to the merchant. Zero commission.
      </p>
    </div>
  )
}
