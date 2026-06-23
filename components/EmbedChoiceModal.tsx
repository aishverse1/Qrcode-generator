'use client'
import { useState } from 'react'

interface EmbedChoiceModalProps {
  isOpen: boolean
  shareLink: string
  token: string
  onClose: () => void
}

export default function EmbedChoiceModal({ isOpen, shareLink, token, onClose }: EmbedChoiceModalProps) {
  const [choice, setChoice] = useState<'redirect' | 'popup' | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const embedCode = `<script src="https://upidirectpay.com/embed.js" data-token="${token}"></script>`

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>

        {!choice ? (
          <>
            <h2 className="text-xl font-semibold text-navy mb-1">How should customers pay?</h2>
            <p className="text-slate-500 text-sm mb-6">Choose how your customers see the QR code</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Redirect Option */}
              <button
                onClick={() => setChoice('redirect')}
                className="border-2 border-slate-100 rounded-2xl p-5 text-left hover:border-blue-primary hover:bg-blue-50 transition group"
              >
                {/* Phone mockup - redirect */}
                <div className="w-full aspect-[9/16] bg-slate-100 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-white" />
                  {/* Browser bar */}
                  <div className="absolute top-0 left-0 right-0 h-5 bg-slate-300 flex items-center gap-1 px-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  {/* Mock QR card inside phone */}
                  <div className="absolute top-8 left-2 right-2 bg-white rounded-lg p-2 shadow text-center">
                    <div className="w-full aspect-square bg-slate-200 rounded mb-1 relative">
                      <div className="absolute inset-2 grid grid-cols-5 grid-rows-5 gap-0.5">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-navy' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded w-3/4 mx-auto mb-0.5" />
                    <div className="h-1.5 bg-slate-200 rounded w-1/2 mx-auto" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-primary bg-blue-50 px-2 py-0.5 rounded-full">REDIRECT</span>
                </div>
                <h3 className="font-semibold text-navy text-sm mb-1">Open on our site</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Customer is taken to a secure UPIDirectPay.com page to pay</p>
              </button>

              {/* Popup Option */}
              <button
                onClick={() => setChoice('popup')}
                className="border-2 border-slate-100 rounded-2xl p-5 text-left hover:border-purple-500 hover:bg-purple-50 transition group"
              >
                {/* Website mockup with popup */}
                <div className="w-full aspect-[9/16] bg-slate-100 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-100" />
                  {/* Mock website content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                    <div className="h-2 bg-slate-300 rounded w-3/4" />
                    <div className="h-6 bg-slate-300 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-8 bg-blue-400 rounded w-24 mt-1" />
                  </div>
                  {/* Floating popup overlay */}
                  <div className="absolute bottom-8 right-1 left-1 bg-white rounded-lg p-2 shadow-xl border border-slate-100">
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="w-3 h-3 bg-blue-primary rounded text-white flex items-center justify-center text-xs">✓</div>
                      <span className="text-xs font-medium text-navy">Pay with UPI</span>
                    </div>
                    <div className="w-full aspect-square bg-slate-100 rounded relative">
                      <div className="absolute inset-1 grid grid-cols-5 grid-rows-5 gap-0.5">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-navy' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded w-3/4 mx-auto mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">POPUP</span>
                </div>
                <h3 className="font-semibold text-navy text-sm mb-1">Embed on your site</h3>
                <p className="text-slate-500 text-xs leading-relaxed">QR popup appears on your website — customers never leave</p>
              </button>
            </div>
          </>
        ) : (
          <div className="py-2">
            <button onClick={() => setChoice(null)} className="text-sm text-blue-primary hover:underline mb-4 flex items-center gap-1">
              ← Choose different option
            </button>

            {choice === 'redirect' ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-blue-primary bg-blue-50 px-2 py-0.5 rounded-full">REDIRECT</span>
                  <h3 className="font-semibold text-navy">Shareable Payment Link</h3>
                </div>
                <p className="text-slate-500 text-sm mb-4">Send this link to your customer. They'll open it and pay on our secure site.</p>
                <div className="bg-slate-900 rounded-xl p-4 mb-3">
                  <p className="text-green-400 text-sm font-mono break-all">{shareLink}</p>
                </div>
                <button
                  onClick={() => copy(shareLink)}
                  className="w-full bg-blue-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-dark transition"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">POPUP</span>
                  <h3 className="font-semibold text-navy">Embed Code</h3>
                </div>
                <p className="text-slate-500 text-sm mb-4">Paste this snippet into your website HTML. A "Pay with UPI" button will appear.</p>
                <div className="bg-slate-900 rounded-xl p-4 mb-3">
                  <p className="text-green-400 text-sm font-mono break-all">{embedCode}</p>
                </div>
                <button
                  onClick={() => copy(embedCode)}
                  className="w-full bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                  {copied ? '✓ Copied!' : 'Copy Embed Code'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
