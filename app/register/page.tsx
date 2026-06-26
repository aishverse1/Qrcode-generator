'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isValidVpa, BANK_HANDLES } from '@/lib/upi'

type Step = 'form' | 'confirm'

/* ── Icon SVGs ─────────────────────────────────────────────── */
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ businessName: '', vpa: '', amount: '' })
  const [vpaTouched, setVpaTouched] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const vpaRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const vpaValid = isValidVpa(form.vpa)
  const canSubmit = form.businessName.trim() && form.vpa.trim() && vpaValid

  const atIndex = form.vpa.lastIndexOf('@')
  const typedHandle = atIndex >= 0 ? form.vpa.slice(atIndex) : ''
  const prefix = atIndex >= 0 ? form.vpa.slice(0, atIndex) : form.vpa

  const filteredHandles = BANK_HANDLES.filter(h =>
    typedHandle.length > 0 && h.startsWith(typedHandle) && h !== typedHandle
  ).slice(0, 6)

  const shouldShowSuggestions =
    showSuggestions && filteredHandles.length > 0 && !vpaValid

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
        vpaRef.current && !vpaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function applySuggestion(handle: string) {
    setForm(f => ({ ...f, vpa: prefix + handle }))
    setShowSuggestions(false)
    vpaRef.current?.focus()
  }

  async function handleConfirm() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/merchant/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create payment link')
        setStep('form')
        setLoading(false)
        return
      }
      if (data.token) {
        router.push(`/${data.token}`)
      } else {
        const params = new URLSearchParams({ pa: form.vpa.trim(), pn: form.businessName.trim() })
        if (form.amount) params.set('am', form.amount)
        router.push(`/pay?${params.toString()}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
      setLoading(false)
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    border: '1.5px solid #E0E0E0',
    borderRadius: 'var(--radius-sm)',
    fontSize: 15, color: 'var(--ink-1)',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    background: 'var(--white)',
  }
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--cornflower)'
    e.target.style.boxShadow = '0 0 0 3px rgba(103,117,232,0.15)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#E0E0E0'
    e.target.style.boxShadow = 'none'
  }

  /* ── Confirm Step ── */
  if (step === 'confirm') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cornflower)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          padding: '18px clamp(24px, 5vw, 48px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 20 }}>U</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--white)', letterSpacing: '-.03em' }}>
              UPIDirectPay
            </span>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px clamp(16px, 5vw, 32px)' }}>
          <div style={{ width: '100%', maxWidth: 420,
            animation: 'slideUpFade 0.5s var(--ease-out-expo) both' }}>

            {/* Check header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, background: 'var(--white)', borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}>
                <span style={{ color: 'var(--cornflower)', fontWeight: 900, fontSize: 26 }}>
                  {form.businessName.trim().charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--white)', letterSpacing: '-.03em', marginBottom: 4 }}>
                Confirm Details
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Verify before creating your link</p>
            </div>

            {/* Summary card */}
            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-md)',
              overflow: 'hidden', marginBottom: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
              <div style={{ background: 'var(--cornflower)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--white)', fontWeight: 900, fontSize: 18 }}>
                    {form.businessName.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em' }}>
                    {form.businessName.trim()}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Payment recipient</p>
                </div>
              </div>
              <div style={{ padding: '4px 0' }}>
                {[
                  { label: 'UPI ID', val: form.vpa.trim(), mono: true },
                  { label: 'Amount', val: form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Open (any amount)', mono: false },
                  { label: 'Commission', val: 'Zero — 0%', mono: false, green: true },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderTop: i > 0 ? '1px solid #F0F0F0' : 'none',
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: row.green ? '#059669' : 'var(--ink-1)',
                      fontFamily: row.mono ? 'monospace' : 'inherit',
                      background: row.mono ? '#F5F5F5' : 'transparent',
                      padding: row.mono ? '2px 8px' : '0',
                      borderRadius: row.mono ? 6 : 0,
                    }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA',
                borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 12 }}>
                <p style={{ color: 'var(--error-ink)', fontSize: 13, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setStep('form'); setError('') }} disabled={loading}
                style={{ flex: 1, border: '1.5px solid rgba(255,255,255,0.35)', background: 'transparent',
                  color: 'var(--white)', borderRadius: 'var(--radius-sm)', padding: '13px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Edit
              </button>
              <button onClick={handleConfirm} disabled={loading}
                style={{ flex: 2,
                  background: loading ? 'rgba(255,255,255,0.2)' : 'var(--white)',
                  color: loading ? 'rgba(255,255,255,0.5)' : 'var(--cornflower)',
                  border: 'none', borderRadius: 'var(--radius-sm)', padding: '13px',
                  fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}>
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>✓ Confirm & Create</>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* ── Form Step ── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px clamp(16px, 5vw, 32px)' }}>
        <div style={{ width: '100%', maxWidth: 420,
          animation: 'slideUpFade 0.5s var(--ease-out-expo) both' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: 'var(--ink-1)',
              letterSpacing: '-.03em', marginBottom: 6 }}>
              Create Payment Link
            </h1>
            <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
              Enter your details. Money goes straight to your bank.
            </p>
          </div>

          <form onSubmit={e => { e.preventDefault(); if (canSubmit) setStep('confirm') }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Business Name */}
            <div>
              <label htmlFor="reg-businessName" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                Business Name
              </label>
              <input id="reg-businessName" type="text" value={form.businessName}
                onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                placeholder="Ravi's Tea Stall"
                required
                style={inputBase}
                onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* UPI VPA */}
            <div>
              <label htmlFor="reg-vpa" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                Your UPI ID
              </label>
              <div style={{ position: 'relative' }}>
                <input ref={vpaRef} id="reg-vpa" type="text" value={form.vpa}
                  onChange={e => { setForm(f => ({ ...f, vpa: e.target.value })); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => { setVpaTouched(true); setShowSuggestions(false) }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setShowSuggestions(false); vpaRef.current?.blur() }
                    if (e.key === 'ArrowDown' && filteredHandles.length > 0) {
                      e.preventDefault(); document.getElementById('reg-sugg-0')?.focus()
                    }
                  }}
                  placeholder="ravi@oksbi"
                  required autoComplete="off"
                  aria-autocomplete="list"
                  aria-haspopup="listbox"
                  aria-expanded={shouldShowSuggestions}
                  style={{
                    ...inputBase, paddingRight: form.vpa ? 40 : 16,
                    borderColor: vpaTouched && form.vpa && !vpaValid ? 'var(--error-ink)' : '#E0E0E0',
                  }} />
                {form.vpa && (
                  <span style={{ position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', fontSize: 14, fontWeight: 800,
                    color: vpaValid ? '#10B981' : 'var(--error-ink)' }}>
                    {vpaValid ? <IconCheck /> : '✕'}
                  </span>
                )}
                {shouldShowSuggestions && (
                  <div ref={suggestionsRef} role="listbox" aria-label="Popular UPI handles"
                    style={{
                      position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 6,
                      background: 'var(--white)', border: '1.5px solid #E0E0E0',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden',
                      animation: 'slideUpFade 0.2s var(--ease-out-expo) both',
                    }}>
                    <p style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 700,
                      padding: '8px 14px 4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      Popular UPI handles
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 14px 12px' }}>
                      {filteredHandles.map((h, i) => (
                        <button key={h} id={`reg-sugg-${i}`} role="option" type="button"
                          aria-selected={false}
                          onMouseDown={e => { e.preventDefault(); applySuggestion(h) }}
                          onKeyDown={e => {
                            if (e.key === 'Escape') { setShowSuggestions(false); vpaRef.current?.focus() }
                            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                              const next = document.getElementById(`reg-sugg-${i + 1}`)
                              if (next) { e.preventDefault(); next.focus() }
                              else { vpaRef.current?.focus() }
                            }
                            if (e.key === 'ArrowUp' && i === 0) {
                              vpaRef.current?.focus()
                            }
                          }}
                          style={{ fontSize: 12, background: 'var(--cornflower-light)', color: 'var(--cornflower)',
                            fontWeight: 600, border: 'none', borderRadius: 100,
                            padding: '5px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Popular handle chips */}
              {!form.vpa && (
                <div role="group" aria-label="Insert a popular UPI handle" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {['@oksbi', '@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@apl'].map(h => (
                    <button key={h} type="button"
                      onClick={() => {
                        setForm(f => ({ ...f, vpa: f.vpa.split('@')[0] + h }))
                        vpaRef.current?.focus()
                      }}
                      style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--ink-2)',
                        fontWeight: 500, border: '1px solid #E0E0E0', borderRadius: 100,
                        padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
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

            {/* Amount */}
            <div>
              <label htmlFor="reg-amount" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                Amount <span style={{ color: 'var(--ink-4)', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--ink-3)', fontSize: 15, fontWeight: 600 }}>₹</span>
                <input id="reg-amount" type="number" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00" min="1" step="0.01"
                  style={{ ...inputBase, paddingLeft: 34 }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {error && (
              <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA',
                borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <p style={{ color: 'var(--error-ink)', fontSize: 13, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={!canSubmit}
              style={{
                width: '100%',
                background: canSubmit ? 'var(--cornflower)' : '#F0F0F0',
                color: canSubmit ? 'var(--white)' : 'var(--ink-4)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '15px', fontSize: 15, fontWeight: 800,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', marginTop: 4,
                transition: 'all 0.2s var(--ease-out-expo)',
                boxShadow: canSubmit ? '0 4px 20px rgba(103,117,232,0.3)' : 'none',
              }}>
              Review Details →
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', marginTop: 24 }}>
            <Link href="/" style={{ color: 'var(--cornflower)', fontWeight: 600, textDecoration: 'none' }}>
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
