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
        width: 220,
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
    <div className={`${embedMode ? 'p-4' : 'min-h-screen bg-slate-50 p-4'} flex flex-col items-center justify-center`}>

      {/* Single centered card */}
      <div style={{
        width: '100%', maxWidth: 340,
        background: 'var(--white)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>

        {/* Top bar: logo + amount */}
        {!embedMode && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: 'var(--cornflower)', borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 13 }}>U</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink-1)', letterSpacing: '-.03em' }}>
                UPIDirectPay
              </span>
            </div>
            {amount && amount > 0 && (
              <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--ink-1)', letterSpacing: '-.04em' }}>
                ₹{amount.toFixed(2)}
              </span>
            )}
          </div>
        )}

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
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="UPI QR Code" width={200} height={200}
              style={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)' }} />
          ) : (
            <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                style={{ animation: 'spin 0.8s linear infinite', color: 'var(--cornflower)' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
              </svg>
            </div>
          )}
        </div>

        {/* Scan hint */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', paddingBottom: 16 }}>
          Scan with any UPI app to pay
        </p>

        {/* UPI App buttons */}
        {!embedMode && (
          <div style={{ padding: '0 18px 16px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
              textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center', marginBottom: 10 }}>
              Pay with
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { name: 'GPay',    color: '#4285F4' },
                { name: 'PhonePe', color: '#5F259F' },
                { name: 'Paytm',   color: '#00B9F1' },
                { name: 'BHIM',    color: '#00784A' },
              ].map(app => (
                <div key={app.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: '#F5F5F5',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                  }}>
                  <div style={{
                    width: 22, height: 22, background: app.color, borderRadius: 5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontWeight: 900, fontSize: 11 }}>₹</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-1)' }}>{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!embedMode && (
          <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href={upiLink}
              style={{
                display: 'block', width: '100%',
                background: 'var(--cornflower)', color: 'var(--white)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '13px',
                fontSize: 14, fontWeight: 800,
                textAlign: 'center', textDecoration: 'none',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cornflower-lighter)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--cornflower)')}>
              Open in UPI App
            </a>
            <button onClick={copyLink}
              style={{
                width: '100%',
                background: copied ? 'var(--cornflower)' : '#F5F5F5',
                color: copied ? 'var(--white)' : 'var(--ink-1)',
                border: copied ? 'none' : '1.5px solid #E0E0E0',
                borderRadius: 'var(--radius-sm)',
                padding: '11px',
                fontSize: 13, fontWeight: 700,
                textAlign: 'center',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = '#EBEBEB'; e.currentTarget.style.borderColor = '#CCC' } }}
              onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.borderColor = '#E0E0E0' } }}>
              {copied ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Link Copied!</>
              ) : (
                <><IconLink /> Copy Payment Link</>
              )}
            </button>
          </div>
        )}

        {/* Embed mode */}
        {embedMode && (
          <div style={{ padding: '0 18px 18px' }}>
            <a href={upiLink}
              style={{
                display: 'block', width: '100%',
                background: 'var(--cornflower)', color: 'var(--white)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '13px',
                fontSize: 14, fontWeight: 800,
                textAlign: 'center', textDecoration: 'none',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cornflower-lighter)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--cornflower)')}>
              Open in UPI App
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      {!embedMode && (
        <p style={{ color: 'var(--ink-3)', fontSize: 11, marginTop: 20, textAlign: 'center' }}>
          Powered by UPIDirectPay · Direct to bank · Zero commission
        </p>
      )}
    </div>
  )
}
