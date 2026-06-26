'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface PixelScatterProps {
  qrUrl: string
  size?: number
  modules?: number
  /** 0–1 scroll progress */
  scrollProgress: number
  /** When scatter completes (0–1), default 0.65 */
  scatterEnd?: number
}

interface Pixel {
  col: number
  row: number
  scatterX: number
  scatterY: number
  rot: number
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function extractModules(qrUrl: string, modules: number, size: number): Promise<boolean[][]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = modules
      canvas.height = modules
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, modules, modules)
      const data = ctx.getImageData(0, 0, modules, modules).data
      const grid: boolean[][] = []
      for (let r = 0; r < modules; r++) {
        grid[r] = []
        for (let c = 0; c < modules; c++) {
          const idx = (r * modules + c) * 4
          grid[r][c] = data[idx + 1] < 128
        }
      }
      resolve(grid)
    }
    img.onerror = () => resolve(Array.from({ length: modules }, () => Array(modules).fill(false)))
    img.src = qrUrl
  })
}

export default function PixelScatter({
  qrUrl,
  size = 200,
  modules = 25,
  scrollProgress,
  scatterEnd = 0.65,
}: PixelScatterProps) {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!qrUrl) return
    extractModules(qrUrl, modules, size).then((grid) => {
      const rand = seededRandom(20260626)
      const ps: Pixel[] = []
      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          if (!grid[r][c]) continue
          const angle = rand() * Math.PI * 2
          const dist = 200 + rand() * 450  // bigger spread: 200–650px
          ps.push({
            col: c, row: r,
            scatterX: Math.cos(angle) * dist,
            scatterY: Math.sin(angle) * dist,
            rot: (rand() - 0.5) * 220,
          })
        }
      }
      setPixels(ps)
    })
  }, [qrUrl, modules, size])

  // scrollProgress: 0 → scatterEnd → fade starts at 50% → 100%
  const scatterT = Math.min(scrollProgress / scatterEnd, 1)
  const fadeT    = Math.max(0, (scrollProgress - 0.5) / 0.5)
  const eased    = 1 - Math.pow(1 - scatterT, 3) // ease-out-cubic
  const opacity  = 1 - fadeT

  if (!pixels.length) {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${modules} ${modules}`}>
          {Array.from({ length: modules * modules }, (_, i) => (
            <rect key={i} x={i % modules} y={Math.floor(i / modules)} width={1} height={1} fill="#E0E0E0" />
          ))}
        </svg>
      </div>
    )
  }

  const moduleSize = size / modules

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, position: 'relative' }}
    >
      {pixels.map((p, i) => {
        const x = p.scatterX * eased
        const y = p.scatterY * eased
        const r = p.rot * eased
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.col * moduleSize,
              top:  p.row * moduleSize,
              width:  moduleSize - 1,
              height: moduleSize - 1,
              background: 'var(--shark)',
              borderRadius: 1,
              opacity,
              transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${r.toFixed(1)}deg)`,
              willChange: 'transform, opacity',
              // Don't let pixels block clicks on elements below
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </div>
  )
}
