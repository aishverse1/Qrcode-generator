'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { verifySignedPaymentToken } from '@/lib/token'
import { buildUpiLink } from '@/lib/upi'

interface PaymentData {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}

export default function PayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<PaymentData | null>(null)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    // path is like /pay/[token]
    const segments = path.split('/')
    const token = segments[segments.length - 1]

    if (!token) {
      setInvalid(true)
      return
    }

    verifySignedPaymentToken(token).then((decoded) => {
      if (decoded) {
        setData(decoded)
      } else {
        setInvalid(true)
      }
    })
  }, [])

  const upiLink = data
    ? buildUpiLink({
        vpa: data.vpa,
        businessName: data.businessName,
        amount: data.amount,
        remarkCode: data.remarkCode,
      })
    : ''

  useEffect(() => {
    if (canvasRef.current && upiLink) {
      QRCode.toCanvas(canvasRef.current, upiLink, {
        width: 200,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      })
    }
  }, [upiLink])

  if (invalid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-semibold text-navy mb-2">Invalid Payment Link</h1>
          <p className="text-slate-500 text-sm">This payment link is invalid, expired, or may have been tampered with. Please ask the merchant for a new link.</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-primary to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-semibold text-navy text-lg tracking-tight">UPIDirectPay.com</span>
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">✓ Secure</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-sm text-center">
          {/* Merchant info */}
          <div className="mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {data.businessName.charAt(0)}
            </div>
            <h1 className="text-xl font-semibold text-navy mb-1">{data.businessName}</h1>
            <p className="text-slate-500 text-sm font-mono">{data.vpa}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="gradient-border inline-block rounded-xl">
              <div className="bg-white rounded-xl p-4">
                <canvas ref={canvasRef} className="mx-auto block" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">{data.amount ? 'Amount to pay' : 'Open Amount'}</p>
            <p className="text-3xl font-bold text-navy">
              {data.amount ? `₹${data.amount.toFixed(2)}` : 'Pay what you want'}
            </p>
          </div>

          {/* UPI App Buttons */}
          <div>
            <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide font-medium">Scan QR or pay with</p>
            <div className="grid grid-cols-2 gap-3">
              <a href={upiLink} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-semibold text-navy">
                <span className="text-lg">📱</span> Google Pay
              </a>
              <a href={upiLink} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition text-sm font-semibold text-navy">
                <span className="text-lg">📲</span> PhonePe
              </a>
              <a href={upiLink} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-semibold text-navy">
                <span className="text-lg">💰</span> Paytm
              </a>
              <a href={upiLink} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition text-sm font-semibold text-navy">
                <span className="text-lg">🏦</span> BHIM UPI
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center max-w-xs leading-relaxed">
          Payments are processed directly via UPI. No card details are stored.
        </p>
      </main>

      <footer className="text-center py-4 text-slate-400 text-xs">
        Powered by <span className="font-medium text-blue-primary">UPIDirectPay.com</span>
      </footer>
    </div>
  )
}
