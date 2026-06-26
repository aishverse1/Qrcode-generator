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

/* ── Icon SVGs ─────────────────────────────────────────────── */
function IconLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  )
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
      style={{
        background: copied ? 'var(--cornflower)' : '#F5F5F5',
        color: copied ? 'var(--white)' : 'var(--ink-1)',
        border: copied ? 'none' : '1.5px solid #E0E0E0',
        borderRadius: 'var(--radius-sm)',
        padding: '11px 18px',
        fontSize: 13, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = '#EBEBEB'; e.currentTarget.style.borderColor = '#CCC' } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.borderColor = '#E0E0E0' } }}
    >
      {copied ? <><IconCheck /> Copied!</> : <><IconLink /> {label}</>}
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
    setTimeout(() => { setStatus('desktop') }, 2000)
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

  /* ── Error state ── */
  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          padding: '18px clamp(24px, 5vw, 48px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 20 }}>U</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
              UPIDirectPay
            </span>
          </div>
        </header>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-md)',
            border: '1.5px solid #FFE0E0',
            padding: 40, maxWidth: 380, width: '100%', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 52, height: 52, background: '#FFE8E8', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-1)', letterSpacing: '-.03em', marginBottom: 8 }}>
              Invalid Payment Request
            </h1>
            <p style={{ color: 'var(--ink-3)', fontSize: 14, marginBottom: 24 }}>{errorMsg}</p>
            <Link href="/" style={{
              color: 'var(--cornflower)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}>
              Go to homepage →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  /* ── Mobile: redirecting ── */
  if (status === 'mobile') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          padding: '18px clamp(24px, 5vw, 48px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 20 }}>U</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
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
            <div style={{
              width: 56, height: 56, background: 'var(--cornflower)', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px', boxShadow: '0 4px 16px rgba(103,117,232,0.3)',
            }}>
              <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 26 }}>
                {pn?.charAt(0).toUpperCase() || 'M'}
              </span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-1)', letterSpacing: '-.03em', marginBottom: 4 }}>
              {pn || 'Merchant'}
            </h1>
            {am && am > 0
              ? <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--ink-1)', letterSpacing: '-.04em', margin: '8px 0 24px' }}>₹{am.toFixed(2)}</p>
              : <p style={{ color: 'var(--ink-3)', margin: '8px 0 24px', fontSize: 14 }}>Open Amount</p>
            }
            {/* Progress bar */}
            <div style={{
              width: '100%', height: 3, background: '#F0F0F0', borderRadius: 99,
              overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                height: '100%',
                background: 'var(--cornflower)',
                borderRadius: 99,
                animation: 'progressBar 2s var(--ease-out-expo) forwards',
              }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--cornflower)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cornflower)' }}>Opening your UPI app…</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* ── Desktop: QR code view ── */
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const upiLink = `upi://pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || 'Merchant')}${am && am > 0 ? `&am=${am.toFixed(2)}` : ''}&cu=INR`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', paddingTop: 80, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '18px clamp(24px, 5vw, 48px)',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 20 }}>U</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
            UPIDirectPay
          </span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: 'var(--ink-1)',
            letterSpacing: '-.03em', marginBottom: 6 }}>
            Your payment link is ready
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>Share this link with your customer</p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16, marginBottom: 24,
        }}>
          {/* QR card */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0,0,0,0.07)',
            overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            {/* Cornflower accent strip */}
            <div style={{ height: 4, background: 'var(--cornflower)' }} />
            {/* Header */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 18 }}>
                  {pn?.charAt(0).toUpperCase() || 'M'}
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-1)', letterSpacing: '-.01em' }}>
                  {pn || 'Merchant'}
                </p>
                <p style={{ color: 'var(--ink-3)', fontSize: 11 }}>
                  {am && am > 0 ? `₹${am.toFixed(2)} fixed` : 'Open amount'}
                </p>
              </div>
            </div>
            {/* QR */}
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
              <img
                src={`/api/pay?pa=${encodeURIComponent(pa || '')}&pn=${encodeURIComponent(pn || '')}${am ? `&am=${am}` : ''}&format=qr`}
                alt="Payment QR Code"
                width={200} height={200}
                style={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)' }}
              />
            </div>
            {/* Footer */}
            <div style={{
              padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.05)',
              textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', fontWeight: 500,
            }}>
              Scan with GPay · PhonePe · Paytm · BHIM
            </div>
          </div>

          {/* Link card */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0,0,0,0.07)',
            padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
                textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Shareable link</p>
              <div style={{
                background: '#F5F5F5', borderRadius: 6, padding: '11px 14px',
                fontSize: 12, color: 'var(--ink-1)', fontFamily: 'monospace',
                wordBreak: 'break-all', lineHeight: 1.5,
              }}>
                {currentUrl}
              </div>
            </div>
            <CopyButton text={currentUrl} label="Copy Link" />

            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
                textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>UPI deep link</p>
              <div style={{
                background: '#F5F5F5', borderRadius: 6, padding: '11px 14px',
                fontSize: 11, color: 'var(--ink-2)', fontFamily: 'monospace',
                wordBreak: 'break-all', lineHeight: 1.5,
              }}>
                {upiLink}
              </div>
            </div>
            <CopyButton text={upiLink} label="Copy UPI Link" />
          </div>
        </div>

        {/* Info box */}
        <div style={{
          border: '1.5px solid var(--cornflower)',
          borderRadius: 'var(--radius-md)', padding: '14px 18px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: 'var(--cornflower-light)',
        }}>
          <span style={{ color: 'var(--cornflower)', marginTop: 1, flexShrink: 0 }}><IconInfo /></span>
          <p style={{ color: 'var(--ink-1)', fontSize: 13, lineHeight: 1.6 }}>
            Share <strong style={{ fontWeight: 700 }}>{currentUrl}</strong> with your customer.
            When they open it on mobile, their UPI app launches automatically.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          style={{ animation: 'spin 0.8s linear infinite', color: 'var(--cornflower)' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
        </svg>
      </div>
    }>
      <PayPageInner />
    </Suspense>
  )
}
