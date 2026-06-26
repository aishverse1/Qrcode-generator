'use client'

import { useState, useRef, useEffect } from 'react'
import { isValidVpa, BANK_HANDLES, buildUpiLink } from '@/lib/upi'
import PixelScatter from '@/components/PixelScatter'

type FormStep = 'input' | 'confirm'

interface SuccessData {
  token: string
  vpa: string
  businessName: string
  amount: number | null
}

/* ── Icons ─────────────────────────────────────────────────── */
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── QR hook ───────────────────────────────────────────────── */
function useQrUrl(vpa: string, businessName: string, amount: number | null) {
  const [qrUrl, setQrUrl] = useState('')
  useEffect(() => {
    if (!vpa) return
    const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode: 'UPIDirectPay' })
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upiLink, {
        width: 200, margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then(setQrUrl)
    })
  }, [vpa, businessName, amount])
  return qrUrl
}

/* ── Registration / Confirm Form ───────────────────────────── */
function FormCard({
  visible,
  onSuccess,
}: {
  visible: boolean
  onSuccess: (data: SuccessData) => void
}) {
  const [step, setStep] = useState<FormStep>('input')
  const [form, setForm] = useState({ businessName: '', vpa: '', amount: '' })
  const [vpaTouched, setVpaTouched] = useState(false)
  const [showSugg, setShowSugg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const vpaRef  = useRef<HTMLInputElement>(null)
  const suggRef = useRef<HTMLDivElement>(null)

  const vpaValid  = isValidVpa(form.vpa)
  const canSubmit = !!(form.businessName.trim() && form.vpa.trim() && vpaValid)

  const atIdx = form.vpa.lastIndexOf('@')
  const typed  = atIdx >= 0 ? form.vpa.slice(atIdx) : ''
  const pfx    = atIdx >= 0 ? form.vpa.slice(0, atIdx) : form.vpa
  const hints  = BANK_HANDLES.filter(h => typed.length > 1 && h.startsWith(typed) && h !== typed).slice(0, 6)
  const showHints = showSugg && hints.length > 0 && !vpaValid

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        suggRef.current && !suggRef.current.contains(e.target as Node) &&
        vpaRef.current  && !vpaRef.current.contains(e.target as Node)
      ) setShowSugg(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function confirmAndCreate() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/merchant/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setTimeout(() => {
        onSuccess({
          token: data.token,
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        })
        setLoading(false)
      }, 300)
    } catch {
      setError('Something went wrong.'); setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: 11,
    fontSize: 14, color: 'var(--ink-1)',
    outline: 'none', fontFamily: 'inherit',
    background: '#fff',
    transition: 'border-color 0.15s',
  }

  if (step === 'confirm') {
    return (
      <div style={{ padding: '36px 32px 30px' }}>
        {/* Logo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 18 }}>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: 1,
              background: [0,2,4,6,8].includes(i) ? 'var(--cornflower)' : 'rgba(0,0,0,0.07)',
            }} />
          ))}
        </div>

        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22,
          letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
          Confirm Details
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 22 }}>
          Verify your payment information
        </p>

        {/* Summary card */}
        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 14,
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ background: 'var(--cornflower)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>
                {form.businessName.trim().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>
                {form.businessName.trim()}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Payment recipient</p>
            </div>
          </div>
          {[
            { label: 'UPI ID',     val: form.vpa.trim(),           mono: true },
            { label: 'Amount',      val: form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Open amount', mono: false },
            { label: 'Commission',  val: 'Zero — 0%',             mono: false, green: true },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 16px',
              borderTop: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{row.label}</span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: row.green ? '#059669' : 'var(--ink-1)',
                fontFamily: row.mono ? 'monospace' : 'inherit',
                background: row.mono ? '#F5F5F5' : 'transparent',
                padding: row.mono ? '2px 7px' : '0',
                borderRadius: row.mono ? 6 : 0,
              }}>
                {row.val}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA',
            borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ color: 'var(--error-ink)', fontSize: 12, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setStep('input'); setError('') }} disabled={loading}
            style={{ flex: 1, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff',
              color: 'var(--ink-1)', borderRadius: 12, padding: '12px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Edit
          </button>
          <button onClick={confirmAndCreate} disabled={loading}
            style={{ flex: 2, background: 'var(--cornflower)', color: '#fff',
              border: 'none', borderRadius: 12, padding: '12px',
              fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
                </svg> Creating…</>
            ) : '✓ Confirm & Create'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '36px 32px 30px' }}>
      {/* Logo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 18 }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: 1,
            background: [0,2,4,6,8].includes(i) ? 'var(--cornflower)' : 'rgba(0,0,0,0.07)',
          }} />
        ))}
      </div>

      <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22,
        letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
        Create Payment Link
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 22 }}>
        Your customers pay, you get paid. Simple.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div>
          <label htmlFor="field-businessName" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Business Name
          </label>
          <input id="field-businessName" type="text" value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            placeholder="Ravi's Tea Stall"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--cornflower)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }} />
        </div>

        <div>
          <label htmlFor="field-vpa" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Your UPI ID
          </label>
          <div style={{ position: 'relative' }}>
            <input ref={vpaRef} id="field-vpa" type="text" value={form.vpa}
              autoComplete="off"
              onChange={e => { setForm(f => ({ ...f, vpa: e.target.value })); setShowSugg(true) }}
              onFocus={() => setShowSugg(true)}
              onBlur={() => { setVpaTouched(true); setShowSugg(false) }}
              onKeyDown={e => {
                if (e.key === 'Escape') { setShowSugg(false); vpaRef.current?.blur() }
                if (e.key === 'ArrowDown' && hints.length > 0) {
                  e.preventDefault(); document.getElementById('sugg-0')?.focus()
                }
              }}
              placeholder="ravi@oksbi"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded={showHints}
              style={{
                ...inputStyle,
                paddingRight: form.vpa ? 40 : 14,
                borderColor: vpaTouched && form.vpa && !vpaValid ? 'var(--error-ink)' : 'rgba(0,0,0,0.12)',
              }} />
            {form.vpa && (
              <span style={{ position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', fontSize: 14, fontWeight: 800,
                color: vpaValid ? '#10B981' : 'var(--error-ink)' }}>
                {vpaValid ? <IconCheck /> : '✕'}
              </span>
            )}
            {showHints && (
              <div ref={suggRef} role="listbox" aria-label="Popular UPI handles"
                style={{ position: 'absolute', left: 0, right: 0, top: '100%',
                  marginTop: 5, background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                <p style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 700,
                  padding: '8px 12px 3px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Popular handles
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, padding: '4px 12px 10px' }}>
                  {hints.map((h, i) => (
                    <button key={h} id={`sugg-${i}`} role="option" type="button"
                      aria-selected={false}
                      onMouseDown={e => { e.preventDefault()
                        setForm(f => ({ ...f, vpa: pfx + h })); setShowSugg(false)
                        vpaRef.current?.focus() }}
                      onKeyDown={e => {
                        if (e.key === 'Escape') { setShowSugg(false); vpaRef.current?.focus() }
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          const next = document.getElementById(`sugg-${i + 1}`)
                          if (next) { e.preventDefault(); next.focus() }
                          else { vpaRef.current?.focus() }
                        }
                        if (e.key === 'ArrowUp' && i === 0) {
                          vpaRef.current?.focus()
                        }
                      }}
                      style={{ fontSize: 11, background: 'var(--cornflower-light)', color: 'var(--cornflower)',
                        fontWeight: 600, border: 'none', borderRadius: 100,
                        padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {!form.vpa && (
            <div role="group" aria-label="Insert a popular UPI handle" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
              {['@oksbi','@okhdfcbank','@okaxis','@ybl','@paytm','@apl'].map(h => (
                <button key={h} type="button"
                  onClick={() => {
                    setForm(f => ({ ...f, vpa: (f.vpa.includes('@') ? f.vpa.split('@')[0] : f.vpa) + h }))
                    vpaRef.current?.focus()
                  }}
                  style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--ink-2)',
                    fontWeight: 500, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 100,
                    padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {h}
                </button>
              ))}
            </div>
          )}
          {vpaTouched && form.vpa && !vpaValid && (
            <p style={{ fontSize: 11, color: 'var(--error-ink)', marginTop: 5, fontWeight: 500 }}>
              Enter a valid UPI ID (e.g. name@oksbi)
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Amount <span style={{ color: 'var(--ink-4)', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--ink-3)', fontSize: 14 }}>₹</span>
            <input type="number" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0.00" min="1" step="0.01"
              style={{ ...inputStyle, paddingLeft: 32 }}
              onFocus={e => { e.target.style.borderColor = 'var(--cornflower)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }} />
          </div>
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA',
            borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ color: 'var(--error-ink)', fontSize: 12, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button onClick={() => { if (canSubmit) setStep('confirm') }} disabled={!canSubmit}
          style={{
            width: '100%', marginTop: 4,
            background: canSubmit ? 'var(--cornflower)' : '#F0F0F0',
            color: canSubmit ? '#fff' : 'var(--ink-4)',
            border: 'none', borderRadius: 12, padding: '14px',
            fontSize: 15, fontWeight: 800, cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', letterSpacing: '-.01em',
            boxShadow: canSubmit ? '0 4px 20px rgba(103,117,232,0.3)' : 'none',
          }}>
          Review Details →
        </button>
      </div>
    </div>
  )
}

/* ── Success View ───────────────────────────────────────────── */
function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.022 6.988 2.824a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function SuccessCard({ data, onReset }: { data: SuccessData; onReset: () => void }) {
  const [qrLoading, setQrLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = `${baseUrl}/${data.token}`
  const upiLink = buildUpiLink({ vpa: data.vpa, businessName: data.businessName, amount: data.amount, remarkCode: 'UPIDirectPay' })

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${data.businessName} wants you to pay them via UPI. Click here to pay: ${shareUrl}`)}`

  function copy(text: string, cb: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => { cb(true); setTimeout(() => cb(false), 2000) })
  }

  async function downloadQr() {
    setQrLoading(true)
    try {
      const upi = buildUpiLink({ vpa: data.vpa, businessName: data.businessName, amount: data.amount, remarkCode: 'UPIDirectPay' })
      const QRCode = await import('qrcode')
      const dataUrl = await QRCode.toDataURL(upi, { width: 400, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${data.businessName.replace(/\s+/g, '-').toLowerCase()}-qr.png`
      a.click()
    } finally {
      setQrLoading(false)
    }
  }

  return (
    <div style={{ padding: '36px 32px 30px' }}>
      {/* Logo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 18 }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: 1,
            background: [0,2,4,6,8].includes(i) ? 'var(--cornflower)' : 'rgba(0,0,0,0.07)',
          }} />
        ))}
      </div>

      <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22,
        letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
        Your payment link is ready
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 22 }}>
        Share it with your customer — they pay directly to your bank.
      </p>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {/* QR card */}
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ background: 'var(--cornflower)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>
                {data.businessName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{data.businessName}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
                {data.amount && data.amount > 0 ? `₹${data.amount.toFixed(2)} fixed` : 'Open amount'}
              </p>
            </div>
          </div>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
            <QrImage vpa={data.vpa} businessName={data.businessName} amount={data.amount} />
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', gap: 8 }}>
            {/* WhatsApp share */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#25D366', color: '#fff',
                border: 'none', borderRadius: 8, padding: '9px 8px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1ebe56')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}>
              <IconWhatsApp /> WhatsApp
            </a>
            {/* Download QR */}
            <button onClick={downloadQr} disabled={qrLoading}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#F5F5F5', color: 'var(--ink-1)',
                border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '9px 8px',
                fontSize: 12, fontWeight: 700, cursor: qrLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!qrLoading) e.currentTarget.style.background = '#EBEBEB' }}
              onMouseLeave={e => { if (!qrLoading) e.currentTarget.style.background = '#F5F5F5' }}>
              {qrLoading ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
                </svg>
              ) : <IconDownload />}
              Download QR
            </button>
          </div>
        </div>

        {/* Link card */}
        <div style={{ background: '#fff', borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
              textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
              Shareable link
            </p>
            <div style={{ background: '#F5F5F5', borderRadius: 7, padding: '9px 12px',
              fontSize: 11, color: 'var(--ink-1)', fontFamily: 'monospace',
              wordBreak: 'break-all', lineHeight: 1.5 }}>
              {shareUrl}
            </div>
          </div>
          <button onClick={() => copy(shareUrl, setCopied)}
            style={{
              width: '100%', background: copied ? '#059669' : 'var(--cornflower)',
              color: '#fff', border: 'none', borderRadius: 10, padding: '11px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.15s',
            }}>
            {copied ? <><IconCheck /> Copied!</> : 'Copy Link'}
          </button>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
              textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
              UPI deep link
            </p>
            <div style={{ background: '#F5F5F5', borderRadius: 7, padding: '9px 12px',
              fontSize: 10, color: 'var(--ink-2)', fontFamily: 'monospace',
              wordBreak: 'break-all', lineHeight: 1.5 }}>
              {upiLink}
            </div>
          </div>
          <button onClick={() => copy(upiLink, setCopiedUpi)}
            style={{
              width: '100%', background: '#F5F5F5', color: 'var(--ink-1)',
              border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 10, padding: '10px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
            {copiedUpi ? <><IconCheck /> Copied!</> : 'Copy UPI Link'}
          </button>
        </div>
      </div>

      <button onClick={onReset}
        style={{
          width: '100%', background: 'transparent',
          border: '1.5px solid rgba(0,0,0,0.12)', color: 'var(--ink-2)',
          borderRadius: 12, padding: '12px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
        + Create Another Link
      </button>
    </div>
  )
}

/* ── QR image component ─────────────────────────────────────── */
function QrImage({ vpa, businessName, amount }: { vpa: string; businessName: string; amount: number | null }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    const upi = buildUpiLink({ vpa, businessName, amount, remarkCode: 'UPIDirectPay' })
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upi, {
        width: 200, margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then(setSrc)
    })
  }, [vpa, businessName, amount])
  if (!src) return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.8s linear infinite', color: 'var(--cornflower)' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
    </svg>
  )
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="QR Code" width={160} height={160} style={{ borderRadius: 4 }} />
}

/* ── Root ──────────────────────────────────────────────────── */
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [heroQrUrl, setHeroQrUrl] = useState('')
  const [formStep, setFormStep] = useState<'form' | 'success'>('form')

  // Build placeholder QR for hero
  useEffect(() => {
    const upi = buildUpiLink({ vpa: 'hello@upay', businessName: 'UPIDirectPay', amount: null, remarkCode: 'UPIDirectPay' })
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upi, { width: 200, margin: 0, color: { dark: '#000000', light: '#FFFFFF' } })
        .then(setHeroQrUrl)
    })
  }, [])

  // Scroll driver
  useEffect(() => {
    function onScroll() {
      const vh = window.innerHeight
      const maxScroll = document.documentElement.scrollHeight - vh
      const p = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
      setScrollProgress(p)

      // Lock scroll once bloom fills the screen
      if (p > 0.95) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.style.overflow = ''
    }
  }, [])

  // Derive animation phases
  const SCATTER_END = 0.55  // scatter 0 → 55vh
  const scatterT = Math.min(scrollProgress / SCATTER_END, 1)  // 0-55vh: scatter
  const riseT    = Math.max(0, (scrollProgress - 0.4) / 0.6) // 40-100vh: card rise + headline fade
  const easeOutExpo = (t: number) => 1 - Math.pow(1 - t, 3)
  const springT  = easeOutExpo(riseT)
  const cardY    = (1 - Math.min(springT, 1)) * 120  // 120% → 0%
  const cardScale = 0.92 + Math.min(springT, 1) * 0.08  // 0.92 → 1
  const cardOpacity = Math.min(riseT * 2, 1)  // fade in faster

  // Headline fades fast starting at 35vh — gone before bloom fills
  const headlineT    = Math.max(0, Math.min((scrollProgress - 0.35) / 0.2, 1))
  const headlineOpacity = 1 - easeOutExpo(headlineT)
  const headlineGone    = headlineOpacity < 0.01  // visibility:hidden once fully faded

  // Logo turns white when bloom reaches top-left (~40vh)
  const logoWhite = scrollProgress > 0.38

  // Cornflower semicircle: clip-path circle expanding from bottom-center
  const blueClip = Math.min(riseT * 2.2, 1)  // slightly overshoot

  // Lock scroll when bloom fills screen (~95%)
  const scrollLocked = scrollProgress > 0.95

  return (
    <div>
      {/* ── Fixed stage: logo + headline + QR scatter ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Cornflower blue layer — semicircle growing from behind card */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200vw',
          height: '200vh',
          background: 'var(--cornflower)',
          clipPath: `circle(${blueClip * 100}% at 50% 150%)`,
          transition: 'clip-path 0s', // driven by JS
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* Logo — top left */}
        <div style={{
          position: 'absolute',
          top: 24,
          left: 'clamp(24px, 5vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 10,
        }}>
          <div style={{
            width: 28, height: 28,
            background: logoWhite ? '#fff' : 'var(--cornflower)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.1s',
          }}>
            <span style={{
              color: logoWhite ? 'var(--cornflower)' : '#fff',
              fontWeight: 900,
              fontSize: 13,
            }}>U</span>
          </div>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 15,
            color: logoWhite ? '#fff' : 'var(--ink-1)',
            letterSpacing: '-.03em',
            transition: 'color 0.1s',
          }}>
            UPIDirectPay
          </span>
        </div>

        {/* Headline — above QR, fades as bloom covers it */}
        <div style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: headlineGone ? 0 : headlineOpacity,
          visibility: headlineGone ? 'hidden' : 'visible',
          transition: 'opacity 0s',
        }}>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 52px)',
            letterSpacing: '-.04em',
            lineHeight: 1.08,
            color: 'var(--ink-1)',
            marginBottom: 12,
            textWrap: 'balance',
          }}>
            Payment,{' '}
            <span style={{ color: 'var(--cornflower)' }}>without the middlemen</span>
          </h1>
          <p style={{
            fontSize: 'clamp(13px, 1.8vw, 16px)',
            color: 'var(--ink-3)',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>
            Zero commission. Direct to your bank.
          </p>
        </div>

        {/* QR pixel scatter — dead center */}
        <div style={{
          position: 'relative',
          zIndex: 4,
          pointerEvents: 'none',
        }}>
          {heroQrUrl && (
            <PixelScatter
              qrUrl={heroQrUrl}
              size={200}
              modules={25}
              scrollProgress={scatterT}
            />
          )}
        </div>
      </div>

      {/* ── Scroll spacer ── */}
      <div style={{ height: '500vh', position: 'relative', zIndex: 2 }}>
        {/* White card — fixed positioned, animates into place */}
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: 620,
          maxWidth: '92vw',
          background: '#fff',
          borderRadius: 22,
          boxShadow: `0 ${24 * Math.min(riseT, 1)}px ${60 * Math.min(riseT, 1)}px rgba(11,18,32,${0.18 * Math.min(riseT, 1)})`,
          zIndex: 10,
          // transform origin center
          transform: `translate(-50%, calc(-50% + ${cardY}% + ${(1 - cardScale) * 200}px)) scale(${cardScale})`,
          opacity: cardOpacity,
          transformOrigin: 'center center',
          transition: 'box-shadow 0s',
          overflow: 'hidden',
        }}>
          {/* Top accent strip */}
          <div style={{ height: 4, background: 'var(--cornflower)' }} />

          {formStep === 'form' ? (
            <FormCard
              visible={riseT > 0}
              onSuccess={(data) => {
                setSuccessData(data)
                setFormStep('success')
              }}
            />
          ) : successData ? (
            <SuccessCard data={successData} onReset={() => {
              setSuccessData(null)
              setFormStep('form')
            }} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
