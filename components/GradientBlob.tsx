'use client'

import { useEffect, useRef, useState } from 'react'

interface GradientBlobProps {
  scrollY: number
}

export default function GradientBlob({ scrollY }: GradientBlobProps) {
  const [mounted, setMounted] = useState(false)
  const blobRef = useRef<SVGSVGElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    let last = 0
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 16, 3)
      last = ts
      timeRef.current += dt * 0.01
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [mounted])

  if (!mounted) return null

  // Shift blob position based on scroll
  const shiftY = scrollY * 0.08

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none"
      style={{
        zIndex: 0,
        left: '50%',
        top: `calc(50% - ${shiftY}px)`,
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        height: '80vh',
      }}
    >
      <svg ref={blobRef} viewBox="0 0 500 500" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.11" />
            <stop offset="50%" stopColor="var(--emerald-lighter)" stopOpacity="0.06" />
            <stop offset="80%" stopColor="var(--emerald-light)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0" />
          </radialGradient>
          <filter id="blobBlur">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        {/* Main soft blob */}
        <ellipse
          cx="250" cy="250" rx="210" ry="185"
          fill="url(#blobGrad)"
          filter="url(#blobBlur)"
        />

        {/* Inner bright core — subtle pulse */}
        <ellipse
          cx="240" cy="230" rx="100" ry="85"
          fill="var(--emerald)"
          opacity="0.04"
          style={{
            animation: 'floatBob 8s ease-in-out infinite',
            transformOrigin: '240px 230px',
          }}
        />

        {/* Rotating dashed ring */}
        <circle
          cx="250" cy="250" r="160"
          fill="none"
          stroke="var(--emerald-lighter)"
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray="6 10"
          style={{
            animation: 'spin 80s linear infinite',
            transformOrigin: '250px 250px',
          }}
        />
      </svg>
    </div>
  )
}
