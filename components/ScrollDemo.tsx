'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

/* ── Mock data ─────────────────────────────────────────────────── */
const MOCK_BUSINESS = "Ravi's Tea Stall"
const MOCK_VPA = 'ravi@oksbi'
const MOCK_AMOUNT = '20'

/* ── Shared card shell ─────────────────────────────────────────── */
function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 rounded-[22px] bg-white shadow-[0_24px_60px_rgba(11,18,32,0.18)] overflow-hidden">
      <div className="h-[4px] bg-[var(--cornflower)]" />
      {children}
    </div>
  )
}

/* ── Card 1 — Empty form ───────────────────────────────────────── */
function Card1Empty() {
  return (
    <CardShell>
      <div style={{ padding: '36px 32px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 18 }}>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: 1,
              background: [0,2,4,6,8].includes(i) ? 'var(--cornflower)' : 'rgba(0,0,0,0.07)',
            }} />
          ))}
        </div>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
          Create Payment Link
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 28 }}>
          Your customers pay, you get paid. Simple.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['Business Name', 'Your UPI ID', 'Amount (optional)'].map((label, idx) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {label}
              </label>
              <div style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: 11, fontSize: 14, color: 'var(--ink-4)', background: '#fff',
              }} />
            </div>
          ))}
          <div style={{
            width: '100%', marginTop: 4, background: '#F0F0F0', color: 'var(--ink-4)',
            border: 'none', borderRadius: 12, padding: '14px',
            fontSize: 15, fontWeight: 800, textAlign: 'center', fontFamily: 'inherit', letterSpacing: '-.01em',
          }}>
            Review Details →
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* ── Card 2 — Typewriter fill driven by scroll ─────────────────── */
function Card2Filled({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Typewriter: fills 25%–55% of scroll range
  const typeProgress = useTransform(scrollYProgress, [0.25, 0.55], [0, 1])

  // We'll render this inside a motion.div that subscribes to typeProgress
  return (
    <CardShell>
      <TypewriterForm typeProgress={typeProgress} />
    </CardShell>
  )
}

function TypewriterForm({ typeProgress }: { typeProgress: MotionValue<number> }) {
  const bizLen = MOCK_BUSINESS.length
  const vpaLen = MOCK_VPA.length
  const amtLen = MOCK_AMOUNT.length

  // Map each character index to a scroll fraction
  const bizChars = Array.from({ length: bizLen + 1 }, (_, i) => i)
  const vpaChars = Array.from({ length: vpaLen + 1 }, (_, i) => i)
  const amtChars = Array.from({ length: amtLen + 1 }, (_, i) => i)

  return (
    <motion.div style={{ padding: '36px 32px 30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 18 }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: 1,
            background: [0,2,4,6,8].includes(i) ? 'var(--cornflower)' : 'rgba(0,0,0,0.07)',
          }} />
        ))}
      </div>
      <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: 'var(--ink-1)', marginBottom: 6 }}>
        Create Payment Link
      </h2>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 28 }}>
        Your customers pay, you get paid. Simple.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Business name */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Business Name
          </label>
          <div style={{
            width: '100%', padding: '12px 14px',
            border: '1.5px solid var(--cornflower)',
            borderRadius: 11, fontSize: 14, color: 'var(--ink-1)', background: '#fff', fontFamily: 'inherit',
            minHeight: 46, display: 'flex', alignItems: 'center',
          }}>
            {bizChars.map(i => (
              <motion.span
                key={i}
                style={{ opacity: useTransform(typeProgress, [i / bizLen, (i + 0.85) / bizLen], [0, 1]) }}
              >
                {MOCK_BUSINESS[i] || ''}
              </motion.span>
            ))}
            <motion.span className="type-cursor"
              style={{ opacity: useTransform(typeProgress, [0, 0.05], [1, 1]) }}
            />
          </div>
        </div>

        {/* UPI ID */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Your UPI ID
          </label>
          <div style={{
            width: '100%', padding: '12px 14px',
            border: '1.5px solid var(--cornflower)',
            borderRadius: 11, fontSize: 14, color: 'var(--ink-1)', background: '#fff', fontFamily: 'inherit',
            minHeight: 46, display: 'flex', alignItems: 'center',
          }}>
            {vpaChars.map(i => (
              <motion.span
                key={i}
                style={{ opacity: useTransform(typeProgress, [i / vpaLen, (i + 0.85) / vpaLen], [0, 1]) }}
              >
                {MOCK_VPA[i] || ''}
              </motion.span>
            ))}
            <motion.span className="type-cursor"
              style={{ opacity: useTransform(typeProgress, [0, 0.05], [1, 1]) }}
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Amount <span style={{ color: 'var(--ink-4)', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <div style={{
            width: '100%', padding: '12px 14px', paddingLeft: 32,
            border: '1.5px solid var(--cornflower)',
            borderRadius: 11, fontSize: 14, color: 'var(--ink-1)', background: '#fff', fontFamily: 'inherit',
            minHeight: 46, display: 'flex', alignItems: 'center', position: 'relative',
          }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}>₹</span>
            {amtChars.map(i => (
              <motion.span
                key={i}
                style={{ opacity: useTransform(typeProgress, [i / amtLen, (i + 0.85) / amtLen], [0, 1]) }}
              >
                {MOCK_AMOUNT[i] || ''}
              </motion.span>
            ))}
            <motion.span className="type-cursor"
              style={{ opacity: useTransform(typeProgress, [0, 0.05], [1, 1]) }}
            />
          </div>
        </div>

        <div style={{
          width: '100%', marginTop: 4, background: 'var(--cornflower)', color: '#fff',
          border: 'none', borderRadius: 12, padding: '14px',
          fontSize: 15, fontWeight: 800, textAlign: 'center', fontFamily: 'inherit', letterSpacing: '-.01em',
          boxShadow: '0 4px 20px rgba(103,117,232,0.3)',
        }}>
          Review Details →
        </div>
      </div>

      <style jsx>{`
        .type-cursor {
          display: inline-block;
          width: 1.5px;
          height: 0.85em;
          background: var(--cornflower);
          margin-left: 1px;
          vertical-align: text-bottom;
          animation: typeBlink 0.75s step-end infinite;
        }
        @keyframes typeBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  )
}

/* ── Scroll-scrubbed SVG flow: merchant → customer → bank ─────────── */
function QrFlowDiagram({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const strokeStart = 0.68
  const strokeEnd = 0.88

  const dashOffset = useTransform(scrollYProgress, [strokeStart, strokeEnd], [400, 0])

  return (
    <div className="flex items-center justify-center py-4">
      <svg
        viewBox="0 0 320 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-xs"
        aria-hidden="true"
      >
        {/* Merchant icon */}
        <circle cx="28" cy="28" r="20" fill="rgba(255,255,255,0.15)" />
        <rect x="18" y="18" width="20" height="16" rx="3" fill="rgba(255,255,255,0.7)" />
        <rect x="21" y="22" width="14" height="2" rx="1" fill="var(--cornflower)" />
        <rect x="21" y="27" width="8" height="2" rx="1" fill="var(--cornflower)" />

        {/* Arrow 1 */}
        <motion.path
          d="M 56 28 L 86 28"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="400"
          style={{ strokeDashoffset: dashOffset }}
        />
        <motion.path
          d="M 80 24 L 86 28 L 80 32"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          style={{ strokeDashoffset: dashOffset }}
        />

        {/* Customer / phone icon */}
        <circle cx="118" cy="28" r="20" fill="rgba(255,255,255,0.15)" />
        <rect x="109" y="15" width="18" height="26" rx="4" fill="rgba(255,255,255,0.7)" />
        <rect x="112" y="19" width="12" height="16" rx="1" fill="var(--cornflower)" />
        <circle cx="118" cy="38" r="1.5" fill="rgba(255,255,255,0.9)" />

        {/* Arrow 2 */}
        <motion.path
          d="M 146 28 L 176 28"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="400"
          style={{ strokeDashoffset: dashOffset }}
        />
        <motion.path
          d="M 170 24 L 176 28 L 170 32"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          style={{ strokeDashoffset: dashOffset }}
        />

        {/* Bank icon */}
        <circle cx="208" cy="28" r="20" fill="rgba(255,255,255,0.15)" />
        <rect x="196" y="20" width="24" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
        <rect x="196" y="28" width="24" height="4" rx="2" fill="rgba(255,255,255,0.7)" />
        <rect x="196" y="36" width="24" height="4" rx="2" fill="rgba(255,255,255,0.7)" />

        {/* Flow label */}
        <motion.text
          x="118"
          y="54"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          fontFamily="Manrope, sans-serif"
          fontWeight="700"
          letterSpacing="0.1em"
          style={{ opacity: useTransform(scrollYProgress, [strokeStart + 0.05, strokeEnd], [0, 1]) }}
        >
          MONEY travels direct
        </motion.text>
      </svg>
    </div>
  )
}

/* ── Card 3 — Success / QR ─────────────────────────────────────── */
function Card3Success({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <CardShell>
      <div style={{ padding: '0px 10px' }}>
        {/* Animated SVG flow diagram */}
        <QrFlowDiagram scrollYProgress={scrollYProgress} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 2, marginBottom: 24, justifyContent: 'center' }}>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: 1,
              background: [0,2,4,6,8].includes(i) ? '#fff' : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', color: '#fff', marginBottom: 8 }}>
            Your payment link is ready
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Share it with your customer — they pay directly to your bank.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {/* QR card */}
          <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width: 32, height: 32, background: 'var(--cornflower)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>R</span>
              </div>
              <div>
                <p style={{ color: 'var(--ink-1)', fontWeight: 700, fontSize: 13, letterSpacing: '-.01em' }}>{MOCK_BUSINESS}</p>
                <p style={{ color: 'var(--ink-3)', fontSize: 11 }}>₹{MOCK_AMOUNT} fixed</p>
              </div>
            </div>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#FAFAFA' }}>
              {/* Abstract QR motif — corner brackets + dots */}
              <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
                <rect x="4" y="4" width="28" height="28" rx="3" stroke="#0D0D0D" strokeWidth="4" />
                <rect x="48" y="4" width="28" height="28" rx="3" stroke="#0D0D0D" strokeWidth="4" />
                <rect x="4" y="48" width="28" height="28" rx="3" stroke="#0D0D0D" strokeWidth="4" />
                <rect x="48" y="48" width="28" height="28" rx="3" stroke="#0D0D0D" strokeWidth="4" />
                <rect x="16" y="16" width="8" height="8" fill="#0D0D0D" />
                <rect x="56" y="16" width="8" height="8" fill="#0D0D0D" />
                <rect x="16" y="56" width="8" height="8" fill="#0D0D0D" />
                <rect x="36" y="36" width="8" height="8" fill="#0D0D0D" />
                <rect x="44" y="36" width="4" height="4" fill="#0D0D0D" />
                <rect x="56" y="56" width="8" height="8" fill="#0D0D0D" />
                <rect x="16" y="36" width="4" height="4" fill="#0D0D0D" />
                <rect x="60" y="44" width="4" height="4" fill="#0D0D0D" />
              </svg>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 8 }}>
              {['#25D366', '#F5F5F5'].map((bg, i) => (
                <div key={i} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: bg, color: i === 0 ? '#fff' : 'var(--ink-1)',
                  border: i === 1 ? '1.5px solid rgba(0,0,0,0.1)' : 'none',
                  borderRadius: 8, padding: '9px 8px', fontSize: 12, fontWeight: 700,
                }}>
                  {i === 0 ? 'WhatsApp' : 'Download QR'}
                </div>
              ))}
            </div>
          </div>

          {/* Link card */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
            {[
              { label: 'Shareable link', val: 'upay.in/p/ravi-tea', mono: true },
              { label: 'UPI deep link', val: 'upi://pay?pa=ravi@oksbi', mono: true },
            ].map(row => (
              <div key={row.label}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>{row.label}</p>
                <div style={{ background: '#F5F5F5', borderRadius: 7, padding: '9px 12px', fontSize: row.mono ? 11 : 13, color: 'var(--ink-1)', fontFamily: row.mono ? 'monospace' : 'inherit', wordBreak: 'break-all', lineHeight: 1.5 }}>{row.val}</div>
              </div>
            ))}
            <div style={{ background: 'var(--cornflower)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, textAlign: 'center', fontFamily: 'inherit' }}>Copy Link</div>
            <div style={{ background: '#F5F5F5', color: 'var(--ink-1)', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 600, textAlign: 'center', fontFamily: 'inherit' }}>Copy UPI Link</div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* ── CTA overlay on card 3 ─────────────────────────────────────── */
function CTAContent({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8 text-center pointer-events-none">
      <p style={{
        fontFamily: 'Manrope, sans-serif', fontWeight: 800,
        fontSize: 'clamp(16px, 2.5vw, 22px)', letterSpacing: '-.03em',
        color: '#fff', marginBottom: 20, lineHeight: 1.25,
        textShadow: '0 2px 20px rgba(0,0,0,0.35)',
      }}>
        That's it.{' '}
        <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
          No signup fee, no cut of your money.
        </span>
      </p>
      <a
        href="#create-payment-link"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('create-payment-link')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="pointer-events-auto cursor-pointer inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-extrabold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{
          background: 'var(--cornflower)',
          letterSpacing: '-.01em',
          boxShadow: '0 8px 32px rgba(103,117,232,0.5)',
        }}
      >
        Create Your Own →
      </a>
    </div>
  )
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function ScrollDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Card 1: fades as card 2 takes over
  const card1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.38], [1, 0.6, 0])
  const card1Y = useTransform(scrollYProgress, [0, 0.38], [0, -24])

  // Card 2: fades in then out as card 3 takes over
  const card2Opacity = useTransform(scrollYProgress, [0.18, 0.32, 0.55, 0.7], [0, 1, 1, 0])
  const card2Y = useTransform(scrollYProgress, [0.18, 0.45], [50, 0])

  // Card 3: fades in from card 2
  const card3Opacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1])
  const card3Y = useTransform(scrollYProgress, [0.62, 0.85], [60, 0])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '320vh' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 flex items-center justify-center h-screen overflow-hidden">
        {/* Deep indigo backdrop */}
        <div className="absolute inset-0" style={{ background: 'var(--cornflower)' }} />

        {/* Card 1 */}
        <motion.div className="absolute inset-0 mx-4" style={{ opacity: card1Opacity, y: card1Y }}>
          <Card1Empty />
        </motion.div>

        {/* Card 2 */}
        <motion.div className="absolute inset-0 mx-4" style={{ opacity: card2Opacity, y: card2Y }}>
          <Card2Filled scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* Card 3 */}
        <motion.div className="absolute inset-0 mx-4" style={{ opacity: card3Opacity, y: card3Y }}>
          <Card3Success scrollYProgress={scrollYProgress} />
          <CTAContent scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </section>
  )
}
