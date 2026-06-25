'use client'

import { useState } from 'react'
import { buildUpiLink } from '@/lib/upi'

interface MerchantSnippetProps {
  vpa: string
  businessName: string
  amount?: number | null
  token?: string
  baseUrl?: string
}

export default function MerchantSnippet({
  vpa,
  businessName,
  amount = null,
  token = '',
  baseUrl = '',
}: MerchantSnippetProps) {
  const [copied, setCopied] = useState<string>('')

  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const slugUrl = token ? `${base}/${token}` : null
  const directPayUrl = `${base}/pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(businessName)}${amount && amount > 0 ? `&am=${amount.toFixed(2)}` : ''}`
  const payUrl = slugUrl ?? directPayUrl
  const upiLink = buildUpiLink({ vpa, businessName, amount, remarkCode: 'UPIDirectPay' })

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  // ── Snippet templates ──────────────────────────────────────

  const htmlLinkSnippet = `<a
  href="${payUrl}"
  style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;padding:12px 24px;border-radius:12px;font-family:sans-serif;font-size:16px;font-weight:600;text-decoration:none;box-shadow:0 4px 14px rgba(37,99,235,.35);"
>
  Pay ${businessName} with UPI
</a>`

  const jsSdkSnippet = token
    ? `<!-- UPIDirectPay SDK -->
<script src="${base}/api/embed" defer></script>
<script>
  document.getElementById('pay-btn').addEventListener('click', function() {
    MyPay.open({ slug: '${token}' });
  });
</script>

<!-- Your button -->
<button id="pay-btn">Pay with UPI</button>`
    : `<!-- UPIDirectPay SDK (direct mode) -->
<script src="${base}/api/embed" defer></script>
<script>
  document.getElementById('pay-btn').addEventListener('click', function() {
    MyPay.open({ pa: '${vpa}', pn: '${businessName}'${amount ? `, am: '${amount.toFixed(2)}'` : ''} });
  });
</script>

<!-- Your button -->
<button id="pay-btn">Pay with UPI</button>`

  const floatingWidgetSnippet = token
    ? `<!-- UPIDirectPay floating widget -->
<script
  src="${base}/api/embed"
  data-slug="${token}"
  defer
></script>`
    : `<!-- UPIDirectPay floating widget (direct mode) -->
<script
  src="${base}/api/embed"
  data-pa="${vpa}"
  data-pn="${businessName}"
  data-am="${amount ?? ''}"
  defer
></script>`

  const shareMessage = `Pay ${businessName} using UPI: ${payUrl}\n\nSafe & instant — no commission charged.`

  return (
    <div className="space-y-6">
      {/* Payment Link */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-2">Your Payment Link</h3>
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <input
            readOnly
            value={payUrl}
            className="flex-1 text-xs text-slate-600 bg-transparent outline-none font-mono truncate"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={() => copy(payUrl, 'link')}
            className="flex-shrink-0 text-xs bg-blue-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-dark transition"
          >
            {copied === 'link' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* HTML Button Snippet */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-1">HTML Button</h3>
        <p className="text-xs text-slate-500 mb-2">
          Drop this into any webpage to show a styled payment button.
        </p>
        <div className="relative">
          <pre className="bg-slate-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed">
            <code>{htmlLinkSnippet}</code>
          </pre>
          <button
            onClick={() => copy(htmlLinkSnippet, 'html')}
            className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600 transition"
          >
            {copied === 'html' ? '✓' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Preview:</p>
        <div className="mt-2">
          <a
            href={payUrl}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,99,235,.35)',
            }}
          >
            Pay {businessName} with UPI
          </a>
        </div>
      </div>

      {/* JS SDK Snippet */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-1">JavaScript SDK (Modal popup)</h3>
        <p className="text-xs text-slate-500 mb-2">
          Opens a beautiful modal with QR code on desktop, direct UPI app on mobile.
        </p>
        <div className="relative">
          <pre className="bg-slate-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed">
            <code>{jsSdkSnippet}</code>
          </pre>
          <button
            onClick={() => copy(jsSdkSnippet, 'sdk')}
            className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600 transition"
          >
            {copied === 'sdk' ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Floating Widget */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-1">Floating Pay Button</h3>
        <p className="text-xs text-slate-500 mb-2">
          Auto-renders a sticky &quot;Pay with UPI&quot; button in the bottom-right corner.
        </p>
        <div className="relative">
          <pre className="bg-slate-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed">
            <code>{floatingWidgetSnippet}</code>
          </pre>
          <button
            onClick={() => copy(floatingWidgetSnippet, 'widget')}
            className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600 transition"
          >
            {copied === 'widget' ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Direct UPI Deep Link */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-1">Direct UPI Deep Link</h3>
        <p className="text-xs text-slate-500 mb-2">For use in native apps, emails, or SMS.</p>
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <input
            readOnly
            value={upiLink}
            className="flex-1 text-xs text-slate-600 bg-transparent outline-none font-mono truncate"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={() => copy(upiLink, 'upi')}
            className="flex-shrink-0 text-xs bg-blue-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-dark transition"
          >
            {copied === 'upi' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Share Message */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-primary mb-2">Share via Message</h3>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Ready-to-send message for WhatsApp, SMS, or email:
        </p>
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{shareMessage}</p>
        </div>
        <button
          onClick={() => copy(shareMessage, 'msg')}
          className="mt-2 text-xs text-blue-primary font-medium hover:underline"
        >
          {copied === 'msg' ? '✓ Copied!' : 'Copy message'}
        </button>
      </div>
    </div>
  )
}
