'use client'

import { useState, useEffect, useRef } from 'react'
import { getCleanOrigin } from '@/lib/upi'

/* ── Syntax token helpers (Material Palenight palette) ────────── */
export const cm = (v: string) => <span style={{ color: '#636D83' }}>{v}</span>
export const kw = (v: string) => <span style={{ color: '#C792EA' }}>{v}</span>
export const st = (v: string) => <span style={{ color: '#C3E88D' }}>{v}</span>
export const fn = (v: string) => <span style={{ color: '#82AAFF' }}>{v}</span>
export const nm = (v: string) => <span style={{ color: '#F78C6C' }}>{v}</span>
export const tg = (v: string) => <span style={{ color: '#F07178' }}>{v}</span>
export const at = (v: string) => <span style={{ color: '#FFCB6B' }}>{v}</span>
export const op = (v: string) => <span style={{ color: '#89DDFF' }}>{v}</span>

/* ── Highlighted snippets as JSX ──────────────────────────────── */
function HtmlSnippet({ origin }: { origin: string }) {
  return (
    <>
      {cm('<!-- Load the embed SDK -->')}{'\n'}
      {op('<')}{tg('script')} {at('src')}{op('=')}{st(`"${origin}/api/embed"`)} {at('defer')}{op('>')}{op('</')}{tg('script')}{op('>')}{'\n'}
      {'\n'}
      {cm('<!-- Trigger it from any button -->')}{'\n'}
      {op('<')}{tg('button')} {at('id')}{op('=')}{st('"pay-btn"')}{op('>')}Pay ₹500.00{op('</')}{tg('button')}{op('>')}{'\n'}
      {op('<')}{tg('script')}{op('>')}{'\n'}
      {'  '}document.{fn('getElementById')}({st("'pay-btn'")}).{fn('addEventListener')}({st("'click'")}, {kw('function')}() {'{'}{'\n'}
      {'    '}MyPay.{fn('open')}({'{ '}{at('slug')}{op(':')} {st("'0sj7mr'")}{' }'});{'\n'}
      {'  '}{'}'});{'\n'}
      {op('</')}{tg('script')}{op('>')}
    </>
  )
}

function JsSnippet() {
  return (
    <>
      {cm('// The slug comes from POST /api/merchant/create')}{'\n'}
      {cm('// (or straight from your shareable link\'s path)')}{'\n'}
      {'\n'}
      {kw('const')} res {op('=')} {kw('await')} {fn('fetch')}({st("'/api/merchant/create'")}, {'{'}{'\n'}
      {'  '}{at('method')}{op(':')} {st("'POST'")},{'\n'}
      {'  '}{at('headers')}{op(':')} {'{ '}{st("'Content-Type'")}{op(':')} {st("'application/json'")} {'}'},{'\n'}
      {'  '}{at('body')}{op(':')} JSON.{fn('stringify')}({'{'}{'\n'}
      {'    '}{at('vpa')}{op(':')} {st("'ravi@oksbi'")},{'\n'}
      {'    '}{at('businessName')}{op(':')} {st("\"Ravi's Tea Stall\"")},{'\n'}
      {'    '}{at('amount')}{op(':')} {nm('20')},{'\n'}
      {'  }'}),{'\n'}
      {'}'});{'\n'}
      {kw('const')} {'{ '}token{' }'} {op('=')} {kw('await')} res.{fn('json')}();{'\n'}
      {'\n'}
      {cm('// Open the payment flow in a modal (desktop) or')}{'\n'}
      {cm('// direct redirect (mobile) — MyPay is exposed by /api/embed')}{'\n'}
      MyPay.{fn('open')}({'{ '}{at('slug')}{op(':')} token {'}'});
    </>
  )
}

function UpiSnippet() {
  return (
    <>
      {fn('upi://pay')}{op('?')}{at('pa')}{op('=')}{st('ravi@oksbi')}{'\n'}
      {'         '}{op('&')}{at('pn')}{op('=')}{st("Ravi%27s+Tea+Stall")}{'\n'}
      {'         '}{op('&')}{at('am')}{op('=')}{nm('20.00')}{'\n'}
      {'         '}{op('&')}{at('cu')}{op('=')}{st('INR')}{'\n'}
      {'         '}{op('&')}{at('tn')}{op('=')}{st('UPIDirectPay')}{'\n'}
      {'\n'}
      {cm('Parameters:')}{'\n'}
      {'  '}{at('pa')}{'  →  Payee VPA (your UPI ID)'}{'\n'}
      {'  '}{at('pn')}{'  →  Payee display name'}{'\n'}
      {'  '}{at('am')}{'  →  Amount in INR (optional)'}{'\n'}
      {'  '}{at('cu')}{'  →  Currency — always INR'}{'\n'}
      {'  '}{at('tn')}{'  →  Transaction note / remark'}{'\n'}
      {'\n'}
      {cm('Works with: GPay · PhonePe · Paytm · BHIM')}{'\n'}
      {cm('Follows NPCI UPI deep-link specification')}
    </>
  )
}

function ShareableLinkSnippet({ origin }: { origin: string }) {
  return (
    <>
      {cm('// Shareable link generated for your business')}{'\n'}
      {cm('// Compatible with any browser, redirects instantly to UPI apps')}{'\n'}
      {'\n'}
      {st(`${origin}/0sj7mr`)}{'\n'}
      {'\n'}
      {cm('// Use it on your website, WhatsApp, or Instagram')}{'\n'}
      {op('<')}{tg('a')} {at('href')}{op('=')}{st(`"${origin}/0sj7mr"`)}{op('>')}{'\n'}
      {'  Pay Now'}{'\n'}
      {op('</')}{tg('a')}{op('>')}
    </>
  )
}

/* ── Tabs meta ────────────────────────────────────────────────── */
const TABS = [
  { id: 'link', label: 'Shareable Link', icon: '🔗' },
  { id: 'html', label: 'HTML', icon: '🌐' },
  { id: 'js', label: 'JavaScript', icon: '⚡' },
  { id: 'upi', label: 'UPI Protocol', icon: '⚙️' },
]

/* ── Component ────────────────────────────────────────────────── */
export default function CodeSnippetDemo() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [origin, setOrigin] = useState('https://upidirectpay.com')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(getCleanOrigin())
    }
  }, [])

  const RAW = [
    `${origin}/0sj7mr\n\n<a href="${origin}/0sj7mr">Pay Now</a>`,
    `<!-- Load the embed SDK -->\n<script src="${origin}/api/embed" defer></script>\n\n<!-- Trigger it from any button -->\n<button id="pay-btn">Pay ₹500.00</button>\n<script>\n  document.getElementById('pay-btn').addEventListener('click', function() {\n    MyPay.open({ slug: '0sj7mr' });\n  });\n</script>`,
    `// The token comes from POST /api/merchant/create\n// (or straight from your shareable link's path)\n\nconst res = await fetch('/api/merchant/create', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    vpa: 'ravi@oksbi',\n    businessName: "Ravi's Tea Stall",\n    amount: 20,\n  }),\n});\nconst { token } = await res.json();\n\n// Open the payment flow in a modal (desktop) or\n// direct redirect (mobile) — MyPay is exposed by /api/embed\nMyPay.open({ slug: token });`,
    `upi://pay?pa=ravi@oksbi\n         &pn=Ravi%27s+Tea+Stall\n         &am=20.00\n         &cu=INR\n         &tn=UPIDirectPay\n\nParameters:\n  pa  →  Payee VPA (your UPI ID)\n  pn  →  Payee display name\n  am  →  Amount in INR (optional)\n  cu  →  Currency — always INR\n  tn  →  Transaction note / remark\n\nWorks with: GPay · PhonePe · Paytm · BHIM\nFollows NPCI UPI deep-link specification`,
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function copyCode() {
    navigator.clipboard.writeText(RAW[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const snippets = [
    <ShareableLinkSnippet key="l" origin={origin} />,
    <HtmlSnippet key="h" origin={origin} />, 
    <JsSnippet key="j" />, 
    <UpiSnippet key="u" />
  ]

  return (
    <section
      ref={sectionRef}
      id="code-demo"
      style={{
        maxWidth: 1160, margin: '0 auto', padding: '100px 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cornflower)', letterSpacing: '1.1px', textTransform: 'uppercase', marginBottom: 12 }}>
          Developer Friendly
        </div>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 36, fontWeight: 800, letterSpacing: '-1.3px', marginBottom: 10, color: 'var(--ink-1)' }}>
          Integration in minutes, not days
        </h2>
        <p style={{ fontSize: 16, color: 'var(--ink-3)', maxWidth: 480, lineHeight: 1.65 }}>
          Drop in a payment link, generate a QR code, or build a custom UPI flow. No SDK, no API key needed.
        </p>
      </div>

      {/* Code block */}
      <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(16,16,20,0.14)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#13142a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(i); setCopied(false) }}
                style={{
                  padding: '14px 20px', background: 'transparent', border: 'none',
                  borderBottom: activeTab === i ? '2px solid var(--cornflower)' : '2px solid transparent',
                  color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: 13, fontWeight: activeTab === i ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={copyCode}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              background: copied ? '#059669' : 'rgba(255,255,255,0.08)',
              color: '#fff', border: 'none', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              whiteSpace: 'nowrap', marginLeft: 16
            }}
          >
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
        </div>

        {/* Code content */}
        <div style={{ background: '#1a1b2e', padding: '24px 28px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0, fontFamily: "'SF Mono','Fira Code','Cascadia Code','Consolas',monospace",
            fontSize: 13, lineHeight: 1.75, color: '#A6ACCD', tabSize: 2,
          }}>
            <code>{snippets[activeTab]}</code>
          </pre>
        </div>

        {/* Bottom bar with language hint */}
        <div style={{
          background: '#13142a', padding: '10px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            {TABS[activeTab].label}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
            UPIDirectPay · Zero Commission
          </span>
        </div>
      </div>
    </section>
  )
}
