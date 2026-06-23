'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCardProps {
  upiLink: string
  amount?: number | null
  businessName: string
  vpa: string
  remarkCode: string
  showDownload?: boolean
}

export default function QRCard({ upiLink, amount, businessName, vpa, remarkCode, showDownload = false }: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, upiLink, {
        width: 240,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      })
    }
  }, [upiLink])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `upidirectpay-${remarkCode}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="gradient-border inline-block rounded-xl">
        <div className="bg-white rounded-xl p-4">
          <canvas ref={canvasRef} className="mx-auto block" />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="font-semibold text-navy">{businessName}</p>
        <p className="text-slate-500 text-sm font-mono">{vpa}</p>
        {amount ? (
          <p className="text-2xl font-bold text-navy mt-2">₹{amount.toFixed(2)}</p>
        ) : (
          <p className="text-slate-400 text-sm mt-2">Open amount — customer chooses</p>
        )}
      </div>
      {showDownload && (
        <button
          onClick={downloadQR}
          className="mt-4 w-full bg-slate-100 text-navy py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR
        </button>
      )}
    </div>
  )
}
