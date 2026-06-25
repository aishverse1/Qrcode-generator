'use client'

import { useState, useRef, useEffect } from 'react'
import { isValidVpa, BANK_HANDLES, buildUpiLink } from '@/lib/upi'

type Phase    = 'landing' | 'transitioning' | 'form'
type FormStep = 'input'   | 'confirm'       | 'success'

interface SuccessData {
  token: string
  vpa: string
  businessName: string
  amount: number | null
}

/* ── CSS ─────────────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ribbon {
    position: fixed;
    top: -20vh; left: -20vw;
    width: 140vw; height: 140vh;
    pointer-events: none;
    z-index: 9999;
    transform: translate(100%, 100%) skewX(-45deg);
  }
  @keyframes ribbonSweep {
    0% { transform: translate(100%, 100%) skewX(-45deg); }
    100% { transform: translate(-100%, -100%) skewX(-45deg); }
  }
  .ribbon.go {
    animation: ribbonSweep 0.85s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
  }

  .ribbon-1 { background: #6B3FA0; }
  .ribbon-2 { background: linear-gradient(to left, #7C3AED, #D06090, #3B82F6); }
  .ribbon-3 { background: #F0EAF8; }
  .ribbon-4 { background: #ffffff; }

  .ribbon-1.go { animation-delay: 0.00s; }
  .ribbon-2.go { animation-delay: 0.09s; }
  .ribbon-3.go { animation-delay: 0.18s; }
  .ribbon-4.go { animation-delay: 0.27s; }

  @keyframes fadeOut { to { opacity: 0; } }
  @keyframes formIn {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes confirmIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes successIn {
    from { opacity:0; transform:scale(0.96) translateY(12px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pop {
    0%   { transform: scale(0.8); opacity: 0; }
    60%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }
`

/* ── Ribbons ─────────────────────────────────────────────────── */
function Ribbons({ active }: { active: boolean }) {
  const cls = (n: string) => `ribbon ribbon-${n}${active ? ' go' : ''}`
  return (
    <>
      <div className={cls('1')} />
      <div className={cls('2')} />
      <div className={cls('3')} />
      <div className={cls('4')} />
    </>
  )
}

/* ── Landing ─────────────────────────────────────────────────── */
function Landing({ dimming, onStart }: { dimming: boolean; onStart: () => void }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      background:'linear-gradient(145deg,#060810 0%,#0A0E1C 55%,#0C1128 100%)',
      display:'flex', flexDirection:'column',
      fontFamily:'Inter,-apple-system,system-ui,sans-serif',
      animation: dimming ? 'fadeOut 0.4s ease forwards' : 'none',
      pointerEvents: dimming ? 'none' : 'auto',
    }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 40px', borderBottom:'1px solid rgba(255,255,255,0.05)',
        position:'relative', zIndex:1, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36,
            background:'linear-gradient(135deg,#5945FE,#3B82F6)', borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'white', fontWeight:900, fontSize:18 }}>U</span>
          </div>
          <span style={{ color:'white', fontWeight:700, fontSize:17, letterSpacing:'-.025em' }}>
            UPIDirectPay
          </span>
        </div>
        <nav style={{ display:'flex', alignItems:'center', gap:24 }}>
          <span style={{ color:'rgba(255,255,255,.4)', fontSize:14, fontWeight:500, cursor:'pointer' }}>Docs</span>
          <button onClick={onStart} style={{ color:'rgba(255,255,255,.8)', fontSize:14, fontWeight:600,
            padding:'8px 20px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)',
            background:'rgba(255,255,255,.04)', cursor:'pointer', fontFamily:'inherit' }}>
            Login
          </button>
        </nav>
      </header>

      <main style={{ flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'0 24px', textAlign:'center', position:'relative', zIndex:1 }}>

        <h1 style={{ color:'white', fontSize:'clamp(38px,5.2vw,66px)', fontWeight:900,
          lineHeight:1.08, letterSpacing:'-.04em', marginBottom:20, maxWidth:700 }}>
          Accept UPI payments<br/>
          <span style={{ color:'#5945FE' }}>without the middlemen</span>
        </h1>

        <p style={{ color:'rgba(255,255,255,.46)', fontSize:17, lineHeight:1.65,
          maxWidth:450, marginBottom:42, fontWeight:400, letterSpacing:'-.01em' }}>
          Generate payment links &amp; QR codes. Money lands directly in your account in seconds.
        </p>

        <button id="get-started-btn" onClick={onStart}
          style={{ background:'#5945FE',
            color:'white', border:'none', borderRadius:50,
            padding:'17px 52px', fontSize:16, fontWeight:700,
            cursor:'pointer', letterSpacing:'-.01em', fontFamily:'inherit',
            boxShadow:'0 10px 30px -5px rgba(89,69,254,.5)',
            transition:'transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.boxShadow='0 15px 40px -5px rgba(89,69,254,.65)' }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 10px 30px -5px rgba(89,69,254,.5)' }}>
          Get Started
        </button>

        <p style={{ color:'rgba(255,255,255,.2)', fontSize:13, marginTop:20 }}>
          Trusted by merchants across India
        </p>
      </main>
    </div>
  )
}

/* ── Success Step ────────────────────────────────────────────── */
function SuccessView({ data, onReset }: { data: SuccessData; onReset: () => void }) {
  const [qrUrl, setQrUrl]     = useState('')
  const [copied, setCopied]   = useState(false)
  const [copiedQr, setCopiedQr] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = `${baseUrl}/${data.token}`

  const upiLink = buildUpiLink({
    vpa: data.vpa,
    businessName: data.businessName,
    amount: data.amount,
    remarkCode: 'UPIDirectPay',
  })

  useEffect(() => {
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(upiLink, {
        width: 280, margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      }).then(url => setQrUrl(url))
    })
  }, [upiLink])

  function copy(text: string, cb: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      cb(true); setTimeout(() => cb(false), 2000)
    })
  }

  return (
    <div className="w-full max-w-4xl font-sans" style={{ animation:'successIn .45s cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment link created!</h1>
        <p className="text-slate-500 text-sm">Share this link with your customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {/* Left: QR Code Card */}
        <div className="bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] p-5 flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
              {data.businessName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-lg leading-tight">{data.businessName}</div>
              <div className="text-white/80 text-sm">
                {data.amount && data.amount > 0 ? `₹${data.amount.toFixed(2)} fixed` : 'Open Amount'}
              </div>
            </div>
          </div>
          {/* QR Area */}
          <div className="p-8 flex-1 flex items-center justify-center bg-slate-50/50">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               {qrUrl ? (
                 <img
                    src={qrUrl}
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="block"
                  />
               ) : (
                 <div className="w-[200px] h-[200px] flex items-center justify-center">
                    <svg className="w-8 h-8 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                       <circle cx="12" cy="12" r="10" className="opacity-25" />
                       <path d="M4 12a8 8 0 018-8" className="opacity-75" />
                    </svg>
                 </div>
               )}
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
        <div className="bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-6 flex flex-col">
          <h2 className="text-xs font-bold text-slate-700 tracking-wide mb-4">SHAREABLE LINK</h2>
          
          <div className="bg-slate-100/80 rounded-lg px-4 py-3 text-sm text-slate-700 mb-4 truncate border border-slate-200/60 font-mono min-w-0">
            {shareUrl}
          </div>
          
          <button 
            onClick={() => copy(shareUrl, setCopied)}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-3 rounded-xl mb-6 transition shadow-sm flex items-center justify-center"
          >
            {copied ? '✓ Copied' : 'Copy Link'}
          </button>
          
          <div className="flex gap-2 mb-2 w-full">
            <div className="flex-1 min-w-0 bg-slate-100/80 rounded-lg px-4 py-2 text-sm text-slate-700 truncate flex items-center border border-slate-200/60 font-mono">
              {upiLink}
            </div>
            <button 
              onClick={() => copy(upiLink, setCopiedQr)}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap border border-slate-200 flex items-center justify-center"
            >
              {copiedQr ? '✓' : 'Copy UPI'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">UPI deep link — paste in apps, messages or emails</p>
        </div>
      </div>

      {/* Bottom Info Box */}
      <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 w-full flex gap-3 text-sm text-slate-700 shadow-sm mb-6">
        <span className="text-xl shrink-0 mt-0.5">💡</span>
        <p className="leading-relaxed">
          Share <span className="font-semibold">{shareUrl}</span> with customers.<br/>
          When they open it on mobile, their UPI app launches automatically.
        </p>
      </div>

      {/* Create another */}
      <div className="flex justify-center">
        <button onClick={onReset}
          className="w-full max-w-xs bg-white border-2 border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          + Create Another Link
        </button>
      </div>
    </div>
  )
}

/* ── Form Page ───────────────────────────────────────────────── */
function FormPage({ onFireRibbons }: { onFireRibbons: () => void }) {
  const [step, setStep]         = useState<FormStep>('input')
  const [form, setForm]         = useState({ businessName:'', vpa:'', amount:'' })
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [vpaTouched, setVpaTouched] = useState(false)
  const [showSugg, setShowSugg] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const vpaRef  = useRef<HTMLInputElement>(null)
  const suggRef = useRef<HTMLDivElement>(null)

  const vpaValid  = isValidVpa(form.vpa)
  const canSubmit = !!(form.businessName.trim() && form.vpa.trim() && vpaValid)

  const atIdx  = form.vpa.lastIndexOf('@')
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

  function resetForm() {
    setStep('input')
    setForm({ businessName:'', vpa:'', amount:'' })
    setSuccessData(null)
    setError('')
    setVpaTouched(false)
  }

  async function confirmAndCreate() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/merchant/create', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setStep('confirm'); setLoading(false); return }

      onFireRibbons()

      setTimeout(() => {
        setSuccessData({
          token: data.token,
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        })
        setStep('success')
        setLoading(false)
      }, 500)
    } catch {
      setError('Something went wrong.'); setLoading(false)
    }
  }

  const inputStyle = (invalid?: boolean): React.CSSProperties => ({
    width:'100%', padding:'12px 14px',
    border:`1.5px solid ${invalid ? '#FCA5A5' : '#E2E8F0'}`,
    borderRadius:12, fontSize:14, color:'#0F172A',
    outline:'none', fontFamily:'inherit', transition:'border-color .15s', background:'white',
  })
  const onFocusV = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#5945FE' }
  const onBlurV  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#E2E8F0' }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'white',
      display:'flex', flexDirection:'column',
      fontFamily:'Inter,-apple-system,system-ui,sans-serif',
      animation:'formIn 0.45s cubic-bezier(0.4,0,0.2,1) 0s both' }}>

      <header style={{ display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px 32px', borderBottom:'1px solid #F1F5F9', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30,
            background:'linear-gradient(135deg,#5945FE,#3B82F6)', borderRadius:8,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'white', fontWeight:900, fontSize:13 }}>U</span>
          </div>
          <span style={{ fontWeight:700, fontSize:15, color:'#0F172A', letterSpacing:'-.025em' }}>
            UPIDirectPay
          </span>
        </div>
      </header>

      <main style={{ flex:1, display:'flex', alignItems:'center',
        justifyContent:'center', padding:'24px', overflow:'auto' }}>

        {/* ── Success ── */}
        {step === 'success' && successData && (
          <SuccessView data={successData} onReset={resetForm}/>
        )}

        {/* ── Input Form ── */}
        {step === 'input' && (
          <div style={{ width:'100%', maxWidth:340 }}>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#0F172A',
                letterSpacing:'-.03em', marginBottom:6 }}>
                Create Payment Link
              </h1>
              <p style={{ color:'#94A3B8', fontSize:13 }}>
                Enter your details to generate a UPI payment link
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Business Name */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151',
                  marginBottom:5, letterSpacing:'.06em', textTransform:'uppercase' }}>
                  Business Name
                </label>
                <input type="text" value={form.businessName}
                  onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                  placeholder="My Business" style={inputStyle()}
                  onFocus={onFocusV} onBlur={onBlurV}/>
              </div>

              {/* UPI VPA */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151',
                  marginBottom:5, letterSpacing:'.06em', textTransform:'uppercase' }}>
                  UPI VPA (ID)
                </label>
                <div style={{ position:'relative' }}>
                  <input ref={vpaRef} type="text" value={form.vpa} autoComplete="off"
                    onChange={e => { setForm(f => ({ ...f, vpa: e.target.value })); setShowSugg(true) }}
                    onFocus={e => { onFocusV(e); setShowSugg(true) }}
                    onBlur={e => { setVpaTouched(true); onBlurV(e) }}
                    placeholder="yourname@oksbi"
                    style={{ ...inputStyle(vpaTouched && !!form.vpa && !vpaValid), paddingRight:36 }}/>
                  {form.vpa && (
                    <span style={{ position:'absolute', right:12, top:'50%',
                      transform:'translateY(-50%)', fontSize:13, fontWeight:700,
                      color: vpaValid ? '#10B981' : '#F87171' }}>
                      {vpaValid ? '✓' : '✗'}
                    </span>
                  )}
                  {showHints && (
                    <div ref={suggRef} style={{ position:'absolute', left:0, right:0,
                      top:'100%', marginTop:4, background:'white',
                      border:'1.5px solid #E2E8F0', borderRadius:12,
                      boxShadow:'0 8px 24px rgba(0,0,0,.09)', zIndex:100, overflow:'hidden' }}>
                      <p style={{ fontSize:10, color:'#94A3B8', fontWeight:700,
                        padding:'8px 12px 4px', textTransform:'uppercase', letterSpacing:'.06em' }}>
                        Popular handles
                      </p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'4px 12px 10px' }}>
                        {hints.map(h => (
                          <button key={h} type="button"
                            onMouseDown={e => { e.preventDefault();
                              setForm(f => ({ ...f, vpa: pfx + h }));
                              setShowSugg(false); vpaRef.current?.focus() }}
                            style={{ fontSize:12, background:'#EDE9FE', color:'#6D28D9',
                              fontWeight:600, border:'none', borderRadius:100,
                              padding:'4px 12px', cursor:'pointer', fontFamily:'inherit' }}>
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!form.vpa && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:7 }}>
                    {['@oksbi','@okhdfcbank','@okaxis','@ybl','@paytm','@apl'].map(h => (
                      <button key={h} type="button"
                        onClick={() => { setForm(f => ({ ...f, vpa:(f.vpa.includes('@') ? f.vpa.split('@')[0] : f.vpa)+h })); vpaRef.current?.focus() }}
                        style={{ fontSize:11, background:'#F8FAFC', color:'#64748B', fontWeight:500,
                          border:'1px solid #E2E8F0', borderRadius:100, padding:'3px 10px',
                          cursor:'pointer', fontFamily:'inherit' }}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
                {vpaTouched && form.vpa && !vpaValid && (
                  <p style={{ fontSize:11, color:'#EF4444', marginTop:5, fontWeight:500 }}>
                    Enter a valid VPA (e.g. name@oksbi)
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151',
                  marginBottom:5, letterSpacing:'.06em', textTransform:'uppercase' }}>
                  Amount{' '}
                  <span style={{ color:'#94A3B8', fontWeight:400, fontSize:10,
                    textTransform:'none', letterSpacing:0 }}>(optional)</span>
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%',
                    transform:'translateY(-50%)', color:'#94A3B8', fontSize:14 }}>₹</span>
                  <input type="number" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00" min="1" step="0.01"
                    style={{ ...inputStyle(), paddingLeft:30 }}
                    onFocus={onFocusV} onBlur={onBlurV}/>
                </div>
              </div>

              {error && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA',
                  borderRadius:10, padding:'10px 14px' }}>
                  <p style={{ color:'#DC2626', fontSize:12, fontWeight:500 }}>{error}</p>
                </div>
              )}

              <button onClick={() => { if (canSubmit) setStep('confirm') }} disabled={!canSubmit}
                style={{ width:'100%',
                  background: canSubmit ? '#5945FE' : '#F1F5F9',
                  color: canSubmit ? 'white' : '#94A3B8',
                  border:'none', borderRadius:14, padding:'14px', fontSize:14, fontWeight:700,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  letterSpacing:'-.01em', fontFamily:'inherit', marginTop:4,
                  boxShadow: canSubmit ? '0 4px 20px rgba(89,69,254,.28)' : 'none',
                  transition:'all .2s' }}>
                Review &amp; Generate →
              </button>
            </div>
          </div>
        )}

        {/* ── Confirm Step ── */}
        {step === 'confirm' && (
          <div style={{ width:'100%', maxWidth:340, animation:'confirmIn .35s ease both' }}>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ width:52, height:52,
                background:'linear-gradient(135deg,#5945FE,#3B82F6)', borderRadius:15,
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 12px', boxShadow:'0 8px 24px rgba(89,69,254,.33)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style={{ fontSize:20, fontWeight:800, color:'#0F172A',
                letterSpacing:'-.03em', marginBottom:4 }}>Confirm Details</h1>
              <p style={{ color:'#94A3B8', fontSize:13 }}>Verify your payment information</p>
            </div>

            <div style={{ border:'1.5px solid #E2E8F0', borderRadius:16,
              overflow:'hidden', marginBottom:14 }}>
              <div style={{ background:'linear-gradient(135deg,#5945FE,#3B82F6)',
                padding:'16px 18px' }}>
                <div style={{ width:40, height:40, background:'rgba(255,255,255,.2)',
                  borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:8 }}>
                  <span style={{ color:'white', fontWeight:900, fontSize:18 }}>
                    {form.businessName.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <p style={{ color:'white', fontWeight:700, fontSize:16,
                  letterSpacing:'-.02em' }}>{form.businessName.trim()}</p>
                <p style={{ color:'rgba(255,255,255,.55)', fontSize:11, marginTop:2 }}>
                  Payment recipient
                </p>
              </div>
              <div>
                {[
                  { label:'UPI VPA',    val: form.vpa.trim(), mono:true,  green:false },
                  { label:'Amount',     val: form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Open amount', mono:false, green:false },
                  { label:'Commission', val: 'Zero — 0%', mono:false, green:true },
                ].map((row, i) => (
                  <div key={row.label} style={{ display:'flex', alignItems:'center',
                    justifyContent:'space-between', padding:'11px 18px',
                    borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                    <span style={{ fontSize:13, color:'#64748B', fontWeight:500 }}>{row.label}</span>
                    <span style={{ fontSize:13, fontWeight:700,
                      color: row.green ? '#10B981' : '#0F172A',
                      fontFamily: row.mono ? 'monospace' : 'inherit',
                      background: row.mono ? '#F8FAFC' : 'transparent',
                      padding: row.mono ? '2px 8px' : '0',
                      borderRadius: row.mono ? 8 : 0 }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA',
                borderRadius:10, padding:'10px 14px', marginBottom:12 }}>
                <p style={{ color:'#DC2626', fontSize:12, fontWeight:500 }}>{error}</p>
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setStep('input'); setError('') }} disabled={loading}
                style={{ flex:1, border:'1.5px solid #E2E8F0', background:'white',
                  color:'#374151', borderRadius:14, padding:'13px',
                  fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                ← Edit
              </button>
              <button onClick={confirmAndCreate} disabled={loading}
                style={{ flex:2,
                  background: loading ? '#F1F5F9' : '#5945FE',
                  color: loading ? '#94A3B8' : 'white',
                  border:'none', borderRadius:14, padding:'13px',
                  fontSize:14, fontWeight:700,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(89,69,254,.28)' }}>
                {loading ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      style={{ animation:'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor"
                        strokeWidth="4" opacity=".25"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor"
                        strokeWidth="4" strokeLinecap="round" opacity=".8"/>
                    </svg>
                    Creating…
                  </>
                ) : '✓ Confirm & Create'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ── Root ────────────────────────────────────────────────────── */
export default function Home() {
  const [phase,  setPhase]  = useState<Phase>('landing')
  const [triggerCount, setTriggerCount] = useState(0)
  const [active, setActive] = useState(false)

  function go() {
    setPhase('transitioning')
    setActive(true)
    setTimeout(() => setPhase('form'), 1150)
  }

  function fireRibbons() {
    setTriggerCount(c => c + 1)
  }

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden',
      position:'relative', background:'#ffffff' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      {(phase === 'landing' || phase === 'transitioning') && (
        <Landing dimming={phase === 'transitioning'} onStart={go}/>
      )}
      <Ribbons key={triggerCount} active={active}/>
      {phase === 'form' && <FormPage onFireRibbons={fireRibbons}/>}
    </div>
  )
}
