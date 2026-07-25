'use client'

import { useEffect, useRef, useState } from 'react'

interface DotNetworkProps {
  visible?: boolean
}

export default function DotNetwork({ visible = true }: DotNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [dots, setDots] = useState<{ x: number; y: number; phase: number; r: number; opacity: number }[]>([])

  useEffect(() => {
    if (!visible) return
    const el = containerRef.current
    if (!el) return

    const { width, height } = el.getBoundingClientRect()
    const seed = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2
      const r = 0.25 + (i % 3) * 0.2
      return {
        x: width * 0.5 + Math.cos(angle) * r * Math.min(width, height) * 0.8,
        y: height * 0.5 + Math.sin(angle) * r * Math.min(width, height) * 0.8,
        phase: (i / 28) * Math.PI * 2,
        r: 1.5 + (i % 3) * 0.8,
        opacity: 0.12 + (i % 4) * 0.05,
      }
    })
    setDots(seed)

    let last = 0
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 16, 3)
      last = ts
      timeRef.current += dt * 0.015

      setDots(prev => prev.map(d => {
        const t = timeRef.current + d.phase
        const nx = d.x + Math.sin(t * 0.7) * 0.4
        const ny = d.y + Math.cos(t * 0.5) * 0.3
        return { ...d, x: Math.max(20, Math.min(width - 20, nx)), y: Math.max(20, Math.min(height - 20, ny)) }
      }))

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [visible])

  if (!visible) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <svg className="w-full h-full">
        <g>
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--emerald)" opacity={d.opacity} />
          ))}
        </g>
        {/* Faint connecting lines between close dots */}
        <g opacity={0.15}>
          {dots.map((d, i) =>
            dots.slice(i + 1).filter(d2 => {
              const dx = d.x - d2.x; const dy = d.y - d2.y
              return Math.sqrt(dx * dx + dy * dy) < 100
            }).map((d2, j) => (
              <line key={`${i}-${j}`} x1={d.x} y1={d.y} x2={d2.x} y2={d2.y}
                stroke="var(--emerald)" strokeWidth={0.5} />
            ))
          )}
        </g>
      </svg>
    </div>
  )
}
