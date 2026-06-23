'use client'
import { useEffect, useRef } from 'react'

interface PaymentModalProps {
  token: string
  baseUrl: string
  onClose: () => void
}

export default function PaymentModal({ token, baseUrl, onClose }: PaymentModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'payment-success') onClose()
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="font-semibold text-navy">Pay with UPI</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
        </div>
        <iframe ref={iframeRef} src={`${baseUrl}/pay/${token}?modal=1`} className="flex-1 w-full border-0" title="UPI Payment" />
      </div>
    </div>
  )
}