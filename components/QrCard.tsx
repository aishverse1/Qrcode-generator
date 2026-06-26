'use client'

import { useEffect, useState } from 'react'
import { buildUpiLink } from '@/lib/upi'
import Image from 'next/image'

// Import logos from root directory
import gpayLogo from '../gpay.png'
import phonepeLogo from '../phonepe.png'
import paytmLogo from '../paytm.png'
import bhimLogo from '../bhim.png'

interface QrCardProps {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  embedMode?: boolean
}

const APP_LOGOS: Record<string, any> = {
  'GPay': gpayLogo,
  'PhonePe': phonepeLogo,
  'Paytm': paytmLogo,
  'BHIM': bhimLogo,
}

const UPI_APPS = [
  {
    name: 'GPay',
    brandColor: '#4285F4',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end` : `gpay://upi/pay?${qs}`
    }
  },
  {
    name: 'PhonePe',
    brandColor: '#5F259F',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.phonepe.app;end` : `phonepe://pay?${qs}`
    }
  },
  {
    name: 'Paytm',
    brandColor: '#00B9F1',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=net.one97.paytm;end` : `paytmmp://pay?${qs}`
    }
  },
  {
    name: 'BHIM',
    brandColor: '#00784A',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=in.org.npci.upiapp;end` : buildUpiLink({ vpa, businessName: name, amount, remarkCode: 'UPIDirectPay' })
    }
  },
]

function IconLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  )
}

export default function QrCard({ vpa, businessName, amount, remarkCode, embedMode = false }: QrCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode })
  const initial = businessName.charAt(0).toUpperCase()

  useEffect(() => {
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upiLink, {
        width: 240,
        margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then(setQrDataUrl)
    })
  }, [upiLink])

  function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`${embedMode ? 'p-4' : 'min-h-screen w-full bg-white p-4 overflow-y-auto md:h-screen md:overflow-hidden'} flex flex-col items-center justify-center`}>
      
      {/* Detached Logo and Subtitle */}
      {!embedMode && (
        <div style={{ textAlign: 'center', marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, background: 'var(--cornflower)', borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 13 }}>U</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
              UPIDirectPay
            </span>
          </div>
          <p style={{ color: 'var(--ink-1)', fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>
            Pay the merchant {businessName} by UPI
          </p>
        </div>
      )}

      {/* Outer Blue Card */}
      <div className="w-full max-w-3xl" style={{
        background: 'var(--cornflower)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        boxShadow: '0 12px 40px rgba(103,117,232,0.3)',
      }}>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Inner White QR Card - Left Side on Desktop */}
          <div className="flex-1" style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            {/* Merchant identity */}
            <div style={{
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 18 }}>{initial}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-1)', letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {businessName}
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {vpa}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ padding: '24px 20px 12px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="UPI QR Code" width={240} height={240}
                  style={{ borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)' }} />
              ) : (
                <div style={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    style={{ animation: 'spin 0.8s linear infinite', color: 'var(--cornflower)' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Relocated Amount */}
            {amount && amount > 0 && (
              <div style={{ textAlign: 'center', paddingBottom: 16, background: '#FAFAFA' }}>
                <span style={{ fontWeight: 900, fontSize: 28, color: 'var(--ink-1)', letterSpacing: '-.04em' }}>
                  ₹{amount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Scan hint */}
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', paddingBottom: 16, background: '#FAFAFA' }}>
              Scan with any UPI app to pay
            </p>
          </div>

          {/* Buttons Area - Right Side on Desktop */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* UPI App buttons */}
            {!embedMode && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', marginBottom: 12 }}>
                  Pay with
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {UPI_APPS.map(app => (
                    <button key={app.name}
                      onClick={() => {
                        const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
                        window.location.href = app.buildLink(vpa, businessName, amount, isAndroid)
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--ink-1)',
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        appearance: 'none', WebkitAppearance: 'none',
                        width: '100%', textAlign: 'left', color: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}>
                      <div style={{
                        width: 28, height: 28, background: '#fff', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, overflow: 'hidden', padding: 4
                      }}>
                        {APP_LOGOS[app.name] ? (
                          <Image src={APP_LOGOS[app.name]} alt={app.name} width={22} height={22} style={{ objectFit: 'contain' }} />
                        ) : (
                          <span style={{ color: 'var(--ink-1)', fontWeight: 900, fontSize: 13 }}>₹</span>
                        )}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!embedMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <button onClick={() => {
                    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
                    const universalLink = isAndroid 
                      ? `intent://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}&tn=${encodeURIComponent(remarkCode)}#Intent;scheme=upi;end`
                      : upiLink
                    window.location.href = universalLink
                  }}
                  style={{
                    display: 'block', width: '100%',
                    background: '#ffffff', color: 'var(--ink-1)',
                    border: 'none', borderRadius: 10,
                    padding: '16px',
                    fontSize: 15, fontWeight: 800,
                    textAlign: 'center', textDecoration: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                  Open in Any UPI App
                </button>
                <button onClick={copyLink}
                  style={{
                    width: '100%',
                    background: copied ? '#10B981' : 'var(--ink-1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '16px',
                    fontSize: 14, fontWeight: 700,
                    textAlign: 'center',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    appearance: 'none', WebkitAppearance: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                  {copied ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Link Copied!</>
                  ) : (
                    <><IconLink /> Copy Payment Link</>
                  )}
                </button>
              </div>
            )}

            {/* Embed mode action */}
            {embedMode && (
              <div>
                <button onClick={() => {
                    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
                    const universalLink = isAndroid 
                      ? `intent://pay?pa=${vpa}&pn=${encodeURIComponent(businessName)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}&tn=${encodeURIComponent(remarkCode)}#Intent;scheme=upi;end`
                      : upiLink
                    window.location.href = universalLink
                  }}
                  style={{
                    display: 'block', width: '100%',
                    background: '#ffffff', color: 'var(--ink-1)',
                    border: 'none', borderRadius: 10,
                    padding: '16px',
                    fontSize: 15, fontWeight: 800,
                    textAlign: 'center', textDecoration: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                  Open in Any UPI App
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {!embedMode && (
        <p style={{ color: 'var(--ink-4)', fontSize: 12, marginTop: 24, textAlign: 'center' }}>
          Powered by UPIDirectPay · Direct to bank · Zero commission
        </p>
      )}
    </div>
  )
}
