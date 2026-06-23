'use client'
import { useState } from 'react'
import QRCard from '@/components/QRCard'
import { isValidVpa, BANK_HANDLES, generateRemarkCode, buildUpiLink } from '@/lib/upi'
import { encodePaymentData } from '@/lib/token'

const STORAGE_KEY = 'upidirectpay_form'

export default function GetStarted() {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [vpa, setVpa] = useState('')
  const [vpaValid, setVpaValid] = useState(false)
  const [amount, setAmount] = useState('')
  const [remarkCode] = useState(generateRemarkCode())
  const [qrReady, setQrReady] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const paymentData = { vpa, businessName, amount: amount ? parseFloat(amount) : null, remarkCode }
  const encodedData = encodePaymentData(paymentData)
  const shareLink = `${baseUrl}/pay/${encodedData}`

  const upiLink = vpa && businessName
    ? buildUpiLink({ vpa, businessName, amount: amount ? parseFloat(amount) : null, remarkCode })
    : ''

  const canGenerate = businessName.trim() && email.trim() && isValidVpa(vpa)

  const handleVpaBlur = () => setVpaValid(isValidVpa(vpa))

  const handleAppendHandle = (handle: string) => {
    if (!vpa.includes('@')) setVpa(vpa + handle)
    else setVpa(vpa.split('@')[0] + handle)
  }

  const handleGenerate = () => {
    if (!canGenerate) return
    setQrReady(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ice">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-navy text-lg tracking-tight">UPIDirectPay.com</span>
          </a>
          <a href="/" className="text-sm text-slate-500 hover:text-navy">← Back</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-navy mb-2">Generate Payment QR</h1>
          <p className="text-slate-500 text-sm">Enter your details — QR code is generated instantly, no sign-up needed.</p>
        </div>

        {!qrReady ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="My Business"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">UPI ID / VPA</label>
                <div className="relative">
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    onBlur={handleVpaBlur}
                    placeholder="yourname@upi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                  />
                  {vpa && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600">
                      {vpaValid ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {BANK_HANDLES.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleAppendHandle(h)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-mono transition"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Leave blank for open amount"
                    className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full mt-6 bg-blue-primary text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-blue-dark transition"
            >
              Generate QR Code
            </button>
          </div>
        ) : (
          <div>
            {/* Success banner */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-navy">QR Code Generated</p>
                  <p className="text-sm text-slate-500">Your payment QR is ready to use</p>
                </div>
              </div>
              <button
                onClick={() => setQrReady(false)}
                className="text-sm text-slate-400 hover:text-navy transition"
              >
                ← New QR
              </button>
            </div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-2 gap-8">

              {/* LEFT — QR + Share Link */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
                <QRCard
                  upiLink={upiLink}
                  amount={amount ? parseFloat(amount) : null}
                  businessName={businessName}
                  vpa={vpa}
                  remarkCode={remarkCode}
                  showDownload
                />

                <div className="w-full mt-8">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Payment Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 font-mono text-slate-600 truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap"
                    >
                      {copied ? '✓ Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT — Embed Tutorial */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-navy">Add to your website</p>
                    <p className="text-sm text-slate-500">Copy-paste and you're live</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-5 mb-8">
                  {[
                    { n: '1', title: 'Copy the script', body: 'Click "Copy code" in the block below. It\'s just one line.' },
                    { n: '2', title: 'Paste before </body>', body: 'Open your website\'s HTML and paste the script just above the closing </body> tag.' },
                    { n: '3', title: 'Done — a button appears', body: 'A floating "Pay with UPI" button will show on your site. No coding needed.' },
                  ].map(({ n, title, body }) => (
                    <div key={n} className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{n}</div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-navy">{title}</p>
                        <p className="text-sm text-slate-500 leading-relaxed mt-0.5">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Code block */}
                <div className="rounded-xl border border-slate-200 overflow-hidden mb-5">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Paste into your HTML</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition"
                    >
                      {copied ? '✓ Copied' : 'Copy code'}
                    </button>
                  </div>
                  <div className="bg-[#1a1a2e] px-5 py-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-emerald-300 whitespace-pre-wrap break-all leading-relaxed">{`<script src="${baseUrl}/embed.js" data-link="${shareLink}"></script>`}</pre>
                  </div>
                </div>

                {/* Platform compatibility */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Works on every platform</p>
                  <div className="flex flex-wrap gap-2">
                    {['WordPress', 'Shopify', 'Wix', 'Squarespace', 'Custom HTML'].map(p => (
                      <span key={p} className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}