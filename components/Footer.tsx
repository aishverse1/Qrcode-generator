'use client'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D1A] text-white">
      {/* ── Marquee strip ──────────────────────────────────────── */}
      <div className="relative overflow-hidden py-10 border-t border-white/5">
        <div className="marquee-track">
          {/* Two identical copies to create seamless loop */}
          {[0, 1].map((pass) => (
            <div key={pass} className="marquee-inner">
              <span className="marquee-text">
                ZERO COMMISSION
              </span>
              <span className="marquee-dot" aria-hidden="true">·</span>
              <span className="marquee-text">
                DIRECT TO BANK
              </span>
              <span className="marquee-dot" aria-hidden="true">·</span>
              <span className="marquee-text">
                NO MIDDLEMEN
              </span>
              <span className="marquee-dot" aria-hidden="true">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer bar ─────────────────────────────────────── */}
      <div className="border-t border-white/5 py-5">
        <p className="text-center text-xs text-white/25 font-medium tracking-wide">
          © 2026 UPIDirectPay — Not affiliated with NPCI/UPI
        </p>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          width: max-content;
        }

        .marquee-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-right: 1.5rem;
          animation: marquee-scroll 28s linear infinite;
          white-space: nowrap;
        }

        .marquee-track:hover .marquee-inner {
          animation-play-state: paused;
        }

        .marquee-text {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }

        .marquee-dot {
          font-size: 1rem;
          color: var(--cornflower, #6775E8);
          opacity: 0.6;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  )
}
