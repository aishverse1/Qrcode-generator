'use client'

import { useState, useRef, useEffect } from 'react'
import { isValidVpa, BANK_HANDLES, buildUpiLink, getCleanOrigin } from '@/lib/upi'
import CodeSnippetDemo, { cm, kw, st, fn, nm, tg, at, op } from '@/components/CodeSnippetDemo'

/* ── 3D Tilt Hook (smooth lerp + RAF) ────────────────────────── */
function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const isHovered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    function animate() {
      // lerp factor: 0.08 = slow/buttery, 0.15 = snappier
      current.current.x = lerp(current.current.x, target.current.x, 0.1)
      current.current.y = lerp(current.current.y, target.current.y, 0.1)

      const scale = isHovered.current ? 1.02 : 1
      el!.style.transform = `perspective(1200px) rotateX(${current.current.x}deg) rotateY(${current.current.y}deg) scale(${scale})`

      // keep animating until settled
      const dx = Math.abs(current.current.x - target.current.x)
      const dy = Math.abs(current.current.y - target.current.y)
      if (dx > 0.01 || dy > 0.01 || isHovered.current) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        rafId.current = null
      }
    }

    let lastEvent: MouseEvent | null = null

    function updateTilt(e: MouseEvent) {
      lastEvent = e
      const rect = el!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      target.current.x = ((y - cy) / cy) * -intensity
      target.current.y = ((x - cx) / cx) * intensity
      if (!isHovered.current) {
        isHovered.current = true
        if (!rafId.current) rafId.current = requestAnimationFrame(animate)
      }
    }

    function onMouseMove(e: MouseEvent) {
      updateTilt(e)
    }

    function onMouseLeave() {
      isHovered.current = false
      target.current.x = 0
      target.current.y = 0
      if (!rafId.current) rafId.current = requestAnimationFrame(animate)
    }
    
    function onResize() {
      if (lastEvent && isHovered.current) {
        updateTilt(lastEvent)
      }
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', onResize)
    window.addEventListener('blur', onMouseLeave)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('blur', onMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [intensity])

  return ref
}

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

/* ── FormCard & SuccessCard (Preserved) ─────────────────────── */
function FormCard({ visible, onSuccess }: { visible: boolean; onSuccess: (data: SuccessData) => void }) {
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
      <div style={{ padding: '36px 32px 30px', opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
          Confirm Details
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 22 }}>
          Verify your payment information
        </p>

        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 14, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ background: 'var(--cornflower)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>{form.businessName.trim().charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>{form.businessName.trim()}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Payment recipient</p>
            </div>
          </div>
          {[
            { label: 'UPI ID', val: form.vpa.trim(), mono: true },
            { label: 'Amount', val: form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Open amount', mono: false },
            { label: 'Commission', val: 'Zero — 0%', mono: false, green: true },
          ].map((row, i) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderTop: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.green ? '#059669' : 'var(--ink-1)', fontFamily: row.mono ? 'monospace' : 'inherit', background: row.mono ? '#F5F5F5' : 'transparent', padding: row.mono ? '2px 7px' : '0', borderRadius: row.mono ? 6 : 0 }}>
                {row.val}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ color: 'var(--error-ink)', fontSize: 12, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setStep('input'); setError('') }} disabled={loading} style={{ flex: 1, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: 'var(--ink-1)', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Edit
          </button>
          <button onClick={confirmAndCreate} disabled={loading} style={{ flex: 2, background: 'var(--cornflower)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating…' : '✓ Confirm & Create'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '36px 32px 30px', opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
      <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
        Create Payment Link
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 22 }}>
        Your customers pay, you get paid. Simple.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label htmlFor="field-businessName" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Business Name
          </label>
          <input id="field-businessName" type="text" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Ravi's Tea Stall" style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--cornflower)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }} />
        </div>

        <div>
          <label htmlFor="field-vpa" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Your UPI ID
          </label>
          <div style={{ position: 'relative' }}>
            <input ref={vpaRef} id="field-vpa" type="text" value={form.vpa} autoComplete="off" onChange={e => { setForm(f => ({ ...f, vpa: e.target.value })); setShowSugg(true) }} onFocus={() => setShowSugg(true)} onBlur={() => { setVpaTouched(true); setShowSugg(false) }} onKeyDown={e => {
              if (e.key === 'Escape') { setShowSugg(false); vpaRef.current?.blur() }
              if (e.key === 'ArrowDown' && hints.length > 0) { e.preventDefault(); document.getElementById('sugg-0')?.focus() }
            }} placeholder="ravi@oksbi" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={showHints} style={{ ...inputStyle, paddingRight: form.vpa ? 40 : 14, borderColor: vpaTouched && form.vpa && !vpaValid ? 'var(--error-ink)' : 'rgba(0,0,0,0.12)' }} />
            {form.vpa && (
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 800, color: vpaValid ? '#10B981' : 'var(--error-ink)' }}>
                {vpaValid ? <IconCheck /> : '✕'}
              </span>
            )}
            {showHints && (
              <div ref={suggRef} role="listbox" aria-label="Popular UPI handles" style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 5, background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                <p style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 700, padding: '8px 12px 3px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Popular handles</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, padding: '4px 12px 10px' }}>
                  {hints.map((h, i) => (
                    <button key={h} id={`sugg-${i}`} role="option" type="button" aria-selected={false} onMouseDown={e => { e.preventDefault(); setForm(f => ({ ...f, vpa: pfx + h })); setShowSugg(false); vpaRef.current?.focus() }} onKeyDown={e => {
                      if (e.key === 'Escape') { setShowSugg(false); vpaRef.current?.focus() }
                      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { const next = document.getElementById(`sugg-${i + 1}`); if (next) { e.preventDefault(); next.focus() } else { vpaRef.current?.focus() } }
                      if (e.key === 'ArrowUp' && i === 0) { vpaRef.current?.focus() }
                    }} style={{ fontSize: 11, background: 'var(--cornflower-light)', color: 'var(--cornflower)', fontWeight: 600, border: 'none', borderRadius: 100, padding: '4px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
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
                <button key={h} type="button" onClick={() => { setForm(f => ({ ...f, vpa: (f.vpa.includes('@') ? f.vpa.split('@')[0] : f.vpa) + h })); vpaRef.current?.focus() }} style={{ fontSize: 11, background: '#F5F5F5', color: 'var(--ink-2)', fontWeight: 500, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {h}
                </button>
              ))}
            </div>
          )}
          {vpaTouched && form.vpa && !vpaValid && (
            <p style={{ fontSize: 11, color: 'var(--error-ink)', marginTop: 5, fontWeight: 500 }}>Enter a valid UPI ID (e.g. name@oksbi)</p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Amount <span style={{ color: 'var(--ink-4)', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', fontSize: 14 }}>₹</span>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" min="1" step="0.01" style={{ ...inputStyle, paddingLeft: 32 }} onFocus={e => { e.target.style.borderColor = 'var(--cornflower)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }} />
          </div>
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', border: '1.5px solid #FFBABA', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ color: 'var(--error-ink)', fontSize: 12, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button onClick={() => { if (canSubmit) setStep('confirm') }} disabled={!canSubmit} style={{ width: '100%', marginTop: 4, background: canSubmit ? 'var(--cornflower)' : '#F0F0F0', color: canSubmit ? '#fff' : 'var(--ink-4)', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: 'inherit', letterSpacing: '-.01em', boxShadow: canSubmit ? '0 4px 20px rgba(103,117,232,0.3)' : 'none' }}>
          Review Details →
        </button>
      </div>
    </div>
  )
}

function SuccessCodeTabs({ shareUrl, data, upiLink }: { shareUrl: string, data: SuccessData, upiLink: string }) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const origin = getCleanOrigin()

  const TABS = [
    { id: 'link', label: 'Shareable Link', icon: '🔗' },
    { id: 'html', label: 'HTML', icon: '🌐' },
    { id: 'js', label: 'JavaScript', icon: '⚡' },
    { id: 'upi', label: 'UPI Protocol', icon: '⚙️' },
  ]

  const RAW = [
    shareUrl,
    `<a href="${shareUrl}">Pay Now</a>`,
    `// Generate a UPI payment link\nconst params = new URLSearchParams({\n  pa: '${data.vpa}',\n  pn: '${data.businessName}',\n  cu: 'INR'\n});\n${data.amount ? `params.set('am', '${data.amount.toFixed(2)}');\n` : ''}const link = \`upi://pay?\${params}\`;`,
    upiLink
  ]

  const snippets = [
    <div key="link">
      {cm('// Shareable link generated for your business')}{'\n'}
      {cm('// Compatible with any browser, redirects instantly to UPI apps')}{'\n'}{'\n'}
      {st(shareUrl)}
    </div>,
    <div key="html">
      {cm('<!-- Add this to your website -->')}{'\n'}
      {op('<')}{tg('a')} {at('href')}{op('=')}{st(`"${shareUrl}"`)}{op('>')}{'\n'}
      {'  Pay Now'}{'\n'}
      {op('</')}{tg('a')}{op('>')}
    </div>,
    <div key="js">
      {cm('// Generate a UPI payment link')}{'\n'}
      {kw('const')} params {op('=')} {kw('new')} {fn('URLSearchParams')}({'{'}{'\n'}
      {'  '}{at('pa')}{op(':')} {st(`'${data.vpa}'`)},{'\n'}
      {'  '}{at('pn')}{op(':')} {st(`'${data.businessName}'`)},{'\n'}
      {'  '}{at('cu')}{op(':')} {st("'INR'")},{'\n'}
      {'}'});{'\n'}
      {data.amount && <>{'params.'}{fn('set')}({st("'am'")}, {st(`'${data.amount.toFixed(2)}'`)});{'\n'}</>}
      {kw('const')} link {op('=')} {st('`upi://pay?${params}`')};
    </div>,
    <div key="upi">
      {fn('upi://pay')}{op('?')}{at('pa')}{op('=')}{st(data.vpa)}{'\n'}
      {'         '}{op('&')}{at('pn')}{op('=')}{st(encodeURIComponent(data.businessName))}{'\n'}
      {data.amount && <>{'         '}{op('&')}{at('am')}{op('=')}{nm(data.amount.toFixed(2))}{'\n'}</>}
      {'         '}{op('&')}{at('cu')}{op('=')}{st('INR')}
    </div>
  ]

  function copyCode() {
    navigator.clipboard.writeText(RAW[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: '#1a1b2e', borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#13142a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 8px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(i); setCopied(false) }}
              style={{
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderBottom: activeTab === i ? '2px solid var(--cornflower)' : '2px solid transparent',
                color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: 11, fontWeight: activeTab === i ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <button
          onClick={copyCode}
          style={{
            position: 'absolute', top: 12, right: 12,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 6,
            background: copied ? '#059669' : 'rgba(255,255,255,0.1)',
            color: '#fff', border: 'none', fontSize: 10, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
          }}
        >
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>
        <div style={{ padding: '16px 12px 16px 16px', overflowX: 'auto', maxWidth: '100%' }}>
          <pre style={{
            margin: 0, fontFamily: "'SF Mono','Fira Code','Cascadia Code','Consolas',monospace",
            fontSize: 11, lineHeight: 1.6, color: '#A6ACCD', tabSize: 2,
            whiteSpace: 'pre-wrap', wordBreak: 'break-all'
          }}>
            <code>{snippets[activeTab]}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function SuccessCard({ data, onReset }: { data: SuccessData; onReset: () => void }) {
  const [qrLoading, setQrLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const baseUrl = getCleanOrigin()
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

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth <= 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ padding: '0px 10px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 26, letterSpacing: '-.01em', color: '#fff', marginBottom: 8 }}>
          Your payment link is ready
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          Share it with your customer — they pay directly to your bank.
        </p>
      </div>

      <div className="success-grid">
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ width: 32, height: 32, background: 'var(--cornflower)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>{data.businessName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p style={{ color: 'var(--ink-1)', fontWeight: 700, fontSize: 13, letterSpacing: '-.01em' }}>{data.businessName}</p>
              <p style={{ color: 'var(--ink-3)', fontSize: 11 }}>{data.amount && data.amount > 0 ? `₹${data.amount.toFixed(2)} fixed` : 'Open amount'}</p>
            </div>
          </div>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
            <QrImage vpa={data.vpa} businessName={data.businessName} amount={data.amount} />
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 8 }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 8px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
              <IconWhatsApp /> WhatsApp
            </a>
            <button onClick={downloadQr} disabled={qrLoading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#F5F5F5', color: 'var(--ink-1)', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '9px 8px', fontSize: 12, fontWeight: 700, cursor: qrLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {qrLoading ? '...' : <IconDownload />} Download QR
            </button>
          </div>
        </div>

        <div className="success-code-tabs" style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Add snippet to your website</p>
            <SuccessCodeTabs shareUrl={shareUrl} data={data} upiLink={upiLink} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={onReset} style={{ width: isMobile ? '100%' : 300, background: 'var(--ink-1)', border: 'none', color: '#fff', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          Create Another Link
        </button>
      </div>
    </div>
  )
}

function QrImage({ vpa, businessName, amount }: { vpa: string; businessName: string; amount: number | null }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    const upi = buildUpiLink({ vpa, businessName, amount, remarkCode: 'UPIDirectPay' })
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upi, { width: 200, margin: 0, color: { dark: '#000000', light: '#FFFFFF' } }).then(setSrc)
    })
  }, [vpa, businessName, amount])
  if (!src) return <div style={{ width: 160, height: 160 }} />
  return <img src={src} alt="QR Code" width={160} height={160} style={{ borderRadius: 4 }} />
}

function TiltHeroCard() {
  const tiltRef = useTilt(8)
  return (
    <div className="hero-visual">
      <div
        ref={tiltRef}
        className="hero-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ width: 40, height: 40, background: 'var(--cornflower)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, transform: 'translateZ(12px)' }}>R</div>
          <div style={{ transform: 'translateZ(8px)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1.2 }}>Ravi&apos;s Tea Stall</h3>
            <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>ravi@oksbi</p>
          </div>
        </div>
        <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 16, textAlign: 'center', marginBottom: 24, transform: 'translateZ(4px)' }}>
          <div style={{ width: 140, height: 140, background: '#fff', borderRadius: 12, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
            <QrImage vpa="ravi@oksbi" businessName="Ravi's Tea Stall" amount={null} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Scan and pay with any UPI app</p>
        </div>
        <button style={{ width: '100%', padding: '14px', background: 'var(--ink-1)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', transform: 'translateZ(6px)' }}>
          Pay ₹500.00
        </button>
      </div>

      {/* Floating Notifications — counter-tilted for depth */}
      <div className="float-card float-card-1" style={{ transform: 'translateZ(20px)' }}>
        <div className="notification-icon icon-success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1.2 }}>Payment Received</p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>₹500.00 from Ananya</p>
        </div>
      </div>

      <div className="float-card float-card-2" style={{ transform: 'translateZ(20px)' }}>
        <div className="notification-icon icon-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1.2 }}>Link Generated</p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Shared via WhatsApp</p>
        </div>
      </div>
    </div>
  )
}


/* ── Home Page Replacement ───────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Track scroll for nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track journey steps for dynamic visuals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = Number(entry.target.getAttribute('data-step'))
          setActiveStep(stepIndex)
        }
      })
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 })

    const steps = document.querySelectorAll('.journey-step')
    steps.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Lock scroll when the registration overlay is open
  useEffect(() => {
    if (isCreating) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isCreating])

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: 'var(--ink-1)' }}>
      {/* ── Registration Overlay (Cornflower Blue Animation) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        pointerEvents: isCreating ? 'auto' : 'none',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto',
        paddingTop: 'clamp(60px, 8vh, 100px)',
        paddingBottom: 60,
      }}>
        {/* Top Left Logo in Overlay */}
        <div style={{
          position: 'absolute', top: 24, left: 32, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: isCreating ? 1 : 0, transition: 'opacity 0.6s ease',
          pointerEvents: isCreating ? 'auto' : 'none'
        }}>
          <div className="nav-logo-icon" style={{ background: '#fff', color: 'var(--cornflower)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>U</div>
          <span className="nav-logo-text" style={{ color: '#fff' }}>UPIDirectPay</span>
        </div>

        {/* Expanding Background Circle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--cornflower)',
          clipPath: isCreating ? 'circle(150% at 50% 100%)' : 'circle(0% at 50% 100%)',
          transition: 'clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
        
        {/* Form Container */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: successData ? 'min(960px, 96vw)' : 620,
          maxWidth: '96vw',
          background: successData ? 'transparent' : '#fff',
          borderRadius: successData ? 0 : 22,
          boxShadow: successData ? 'none' : '0 24px 60px rgba(11,18,32,0.18)',
          transform: `scale(${isCreating ? 1 : 0.95}) translateY(${isCreating ? 0 : 40}px)`,
          opacity: isCreating ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.6s ease 0.1s, width 0.3s',
          overflow: successData ? 'visible' : 'hidden',
          maxHeight: '95vh',
          overflowY: 'auto'
        }}>
          {!successData && <div style={{ height: 4, background: 'var(--cornflower-lighter)' }} />}
          
          {/* Close button */}
          <button 
            onClick={() => {
              setIsCreating(false)
              setTimeout(() => setSuccessData(null), 800)
            }}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, color: successData ? '#fff' : 'var(--ink-1)'
            }}
          >
            ✕
          </button>

          {successData ? (
            <SuccessCard data={successData} onReset={() => setSuccessData(null)} />
          ) : (
            <FormCard visible={isCreating} onSuccess={(data) => setSuccessData(data)} />
          )}
        </div>

        {/* Overlay Footer */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 16px',
          padding: '14px 32px',
          opacity: isCreating ? 1 : 0, transition: 'opacity 0.6s ease 0.3s',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>© 2025 UPIDirectPay</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Zero Commission</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Secured by NPCI</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Privacy Policy</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-content">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0) }} className="nav-logo">
              <div className="nav-logo-icon">U</div>
              <span className="nav-logo-text">UPIDirectPay</span>
            </a>
            <div className="nav-links">
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#code-demo" className="nav-link">Developers</a>
              <button onClick={() => setIsCreating(true)} className="nav-cta" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Create Link
              </button>
            </div>
            <button onClick={() => setIsCreating(true)} className="nav-mobile-cta" style={{ background: 'var(--ink-1)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Create Link
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="badge">Zero Commission Forever</div>
              <h1>
                Payment,<br/>
                <span style={{ color: 'var(--cornflower)' }}>without the middlemen</span>
              </h1>
              <p>Generate UPI payment links in seconds. Customers pay directly to your bank account via GPay, PhonePe, or Paytm.</p>
              <div className="hero-buttons">
                <button onClick={() => setIsCreating(true)} className="btn-primary" style={{ fontFamily: 'inherit' }}>
                  Create payment link
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <a href="#how-it-works" className="btn-secondary">See how it works</a>
              </div>
            </div>
            
            <TiltHeroCard />
          </div>
        </div>
      </section>

      {/* How It Works (Journey) Section */}
      <section id="how-it-works" className="journey">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="journey-layout">
            <div className="journey-steps">
              
              <div className={`journey-step ${activeStep === 0 ? 'active' : ''} ${activeStep > 0 ? 'past' : ''}`} data-step="0">
                <div className="step-indicator">01</div>
                <div className="step-content">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    Add your business details
                  </h3>
                  <p>Enter your business name and UPI ID. We validate your VPA format in real-time against supported bank handles.</p>
                  <div style={{ color: '#10B981', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <span style={{width: 6, height: 6, borderRadius: '50%', background: '#10B981'}}></span> Real-time VPA validation
                  </div>
                </div>
              </div>

              <div className={`journey-step ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'past' : ''}`} data-step="1">
                <div className="step-indicator">02</div>
                <div className="step-content">
                  <h3>Get your QR and payment link</h3>
                  <p>Your unique QR code and shareable link are ready instantly. Each transaction gets a trackable remark code for reconciliation.</p>
                  <div style={{ color: '#10B981', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <span style={{width: 6, height: 6, borderRadius: '50%', background: '#10B981'}}></span> NPCI-compliant UPI deep-link
                  </div>
                </div>
              </div>

              <div className={`journey-step ${activeStep === 2 ? 'active' : ''}`} data-step="2">
                <div className="step-indicator">03</div>
                <div className="step-content">
                  <h3>Share it and get paid</h3>
                  <p>Send the link over WhatsApp or display the QR. Customers pay via any UPI app — funds go directly to your bank account.</p>
                  <div style={{ color: '#10B981', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <span style={{width: 6, height: 6, borderRadius: '50%', background: '#10B981'}}></span> GPay · PhonePe · Paytm · BHIM
                  </div>
                </div>
              </div>
            </div>

            <div className="journey-visuals">
              {/* Visual 1 */}
              <div className={`visual-frame ${activeStep === 0 ? 'active' : ''}`}>
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(11,18,32,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      <div style={{ width: 8, height: 8, background: '#6775E8', borderRadius: '50%' }}></div>
                      <div style={{ width: 8, height: 8, background: '#A5B4FC', borderRadius: '50%' }}></div>
                      <div style={{ width: 8, height: 8, background: '#C7D2FE', borderRadius: '50%' }}></div>
                      <div style={{ width: 8, height: 8, background: '#6775E8', borderRadius: '50%' }}></div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>UPIDirectPay</span>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6, display: 'block' }}>Business name</label>
                    <div style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600 }}>Rajesh Mobile Store</div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6, display: 'block' }}>UPI ID / VPA</label>
                    <div style={{ border: '2px solid #10B981', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                      rajesh@okhdfcbank
                      <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                    {['@okhdfcbank', '@oksbi', '@okaxis', '@ybl'].map((h, i) => (
                      <span key={h} style={{ fontSize: 10, fontWeight: 600, background: i === 0 ? '#EEF2FF' : '#F1F5F9', color: i === 0 ? '#4F46E5' : 'var(--ink-3)', padding: '4px 8px', borderRadius: 100, border: i === 0 ? '1px solid #C7D2FE' : '1px solid transparent' }}>{h}</span>
                    ))}
                  </div>

                  <button style={{ width: '100%', background: '#111827', color: '#fff', fontWeight: 700, padding: 16, borderRadius: 12, border: 'none' }}>Review Details →</button>
                </div>
              </div>
              
              {/* Visual 2 */}
              <div className={`visual-frame ${activeStep === 1 ? 'active' : ''}`}>
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(11,18,32,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, background: '#6775E8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>RS</div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Rajesh Store</h4>
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>rajesh@okhdfcbank</span>
                      </div>
                    </div>
                    <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>✓ Verified</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: 140, height: 140, border: '3px solid #6775E8', borderRadius: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                      <QrImage vpa="demo" businessName="demo" amount={null} />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>₹500.00</div>
                    <div style={{ background: '#EEF2FF', color: '#6775E8', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, marginTop: 8 }}>UPAY-7X2K</div>
                  </div>
                  
                  <div style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 12, padding: '8px 8px 8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-3)' }}>upidirectpay.in/pay/488dt3h</span>
                    <button style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700 }}>Copy</button>
                  </div>
                </div>
              </div>
              
              {/* Visual 3 */}
              <div className={`visual-frame ${activeStep === 2 ? 'active' : ''}`}>
                 <div style={{ position: 'absolute', top: -15, right: -15, zIndex: 10, background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 12px 32px rgba(11,18,32,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 28, height: 28, background: '#ECFDF5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>✓</div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>₹500 received</div>
                     <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Just now via GPay</div>
                   </div>
                 </div>
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(11,18,32,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, background: '#6775E8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>RS</div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Rajesh Store</h4>
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>rajesh@okhdfcbank</span>
                      </div>
                    </div>
                    <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>✓ Verified</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                    <div style={{ width: 140, height: 140, border: '3px solid #6775E8', borderRadius: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                      <QrImage vpa="demo" businessName="demo" amount={null} />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>₹500.00</div>
                    <div style={{ background: '#EEF2FF', color: '#6775E8', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, marginTop: 8 }}>UPAY-7X2K</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {['G Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <div key={app} style={{ flex: 1, background: '#111827', color: '#fff', fontSize: 10, fontWeight: 700, padding: '8px 0', textAlign: 'center', borderRadius: 8 }}>{app}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Snippet Demo Section */}
      <CodeSnippetDemo />

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h4>0%</h4>
              <p>Commission on transactions</p>
            </div>
            <div className="stat-item">
              <h4>₹0</h4>
              <p>Setup or monthly fees</p>
            </div>
            <div className="stat-item">
              <h4>&lt;60s</h4>
              <p>Time to create your link</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Stop paying gateway fees</h2>
            <p>Join thousands of businesses accepting direct UPI payments for free.</p>
            <button onClick={() => setIsCreating(true)} className="btn-primary" style={{ padding: '20px 40px', fontSize: 18, fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}>
              Create your link now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="marquee-container">
          <div className="marquee">
            <div className="marquee-content">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="marquee-item" key={i}>
                  <div className="marquee-dot"></div>
                  ZERO COMMISSION
                  <div className="marquee-dot"></div>
                  NO MIDDLEMEN
                  <div className="marquee-dot"></div>
                  DIRECT TO BANK
                </div>
              ))}
            </div>
            <div className="marquee-content">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="marquee-item" key={`dup-${i}`}>
                  <div className="marquee-dot"></div>
                  ZERO COMMISSION
                  <div className="marquee-dot"></div>
                  NO MIDDLEMEN
                  <div className="marquee-dot"></div>
                  DIRECT TO BANK
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="footer-content">
            <div className="nav-logo">
              <div className="nav-logo-icon">U</div>
              <span className="nav-logo-text">UPIDirectPay</span>
            </div>
            <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
              © {new Date().getFullYear()} UPIDirectPay. Zero commission payment collection.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

