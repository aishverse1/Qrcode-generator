'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isValidVpa, BANK_HANDLES } from '@/lib/upi'

type Step = 'form' | 'confirm'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ businessName: '', vpa: '', amount: '' })
  const [vpaTouched, setVpaTouched] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const vpaRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const vpaValid = isValidVpa(form.vpa)
  const canSubmit = form.businessName.trim() && form.vpa.trim() && vpaValid

  // Autocomplete: show suggestions when user typed something but no complete handle yet
  const atIndex = form.vpa.lastIndexOf('@')
  const typedHandle = atIndex >= 0 ? form.vpa.slice(atIndex) : ''
  const prefix = atIndex >= 0 ? form.vpa.slice(0, atIndex) : form.vpa

  const filteredHandles = BANK_HANDLES.filter(h =>
    typedHandle.length > 0 && h.startsWith(typedHandle) && h !== typedHandle
  ).slice(0, 6)

  const shouldShowSuggestions =
    showSuggestions && filteredHandles.length > 0 && !vpaValid

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        vpaRef.current &&
        !vpaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function applySuggestion(handle: string) {
    setForm(f => ({ ...f, vpa: prefix + handle }))
    setShowSuggestions(false)
    vpaRef.current?.focus()
  }

  async function handleConfirm() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/merchant/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpa: form.vpa.trim(),
          businessName: form.businessName.trim(),
          amount: form.amount ? parseFloat(form.amount) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create payment link')
        setStep('form')
        setLoading(false)
        return
      }
      // Redirect to slug-based page
      if (data.token) {
        router.push(`/${data.token}`)
      } else {
        const params = new URLSearchParams({ pa: form.vpa.trim(), pn: form.businessName.trim() })
        if (form.amount) params.set('am', form.amount)
        router.push(`/pay?${params.toString()}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
      setLoading(false)
    }
  }

  // ── Confirmation Step ──────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">UPIDirectPay.com</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Animated checkmark header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Confirm Details</h1>
              <p className="text-slate-500 text-sm">Please verify your payment information</p>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">
                    {form.businessName.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-semibold text-lg">{form.businessName.trim()}</p>
                <p className="text-blue-100 text-xs mt-0.5">Payment recipient</p>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">UPI VPA</span>
                  <span className="text-sm font-semibold text-slate-900 font-mono bg-slate-50 px-2.5 py-1 rounded-lg">
                    {form.vpa.trim()}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className={`text-sm font-semibold ${form.amount ? 'text-slate-900 text-lg' : 'text-slate-400'}`}>
                    {form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Open (any amount)'}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Payment via</span>
                  <span className="text-sm text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    Direct UPI · Zero commission
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('form'); setError('') }}
                disabled={loading}
                className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                ← Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>✓ Confirm &amp; Create</>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Form Step ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">UPIDirectPay.com</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create Payment Link</h1>
            <p className="text-slate-500 text-sm">Enter your details to generate a UPI payment link</p>
          </div>

          <form
            onSubmit={e => { e.preventDefault(); if (canSubmit) setStep('confirm') }}
            className="space-y-4"
          >
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                placeholder="My Business"
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* UPI VPA with autocomplete */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                UPI VPA (ID)
              </label>
              <div className="relative">
                <input
                  ref={vpaRef}
                  type="text"
                  value={form.vpa}
                  onChange={e => {
                    setForm(f => ({ ...f, vpa: e.target.value }))
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setVpaTouched(true)}
                  placeholder="yourname@oksbi"
                  required
                  autoComplete="off"
                  className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    vpaTouched && form.vpa && !vpaValid
                      ? 'border-red-300'
                      : 'border-slate-200'
                  }`}
                />
                {form.vpa && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
                    vpaValid ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {vpaValid ? '✓' : '✗'}
                  </span>
                )}

                {/* Suggestion dropdown */}
                {shouldShowSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <p className="text-[10px] text-slate-400 font-medium px-3 pt-2 pb-1 uppercase tracking-wide">
                      Popular UPI handles
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                      {filteredHandles.map(handle => (
                        <button
                          key={handle}
                          type="button"
                          onMouseDown={e => { e.preventDefault(); applySuggestion(handle) }}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full transition"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Popular handle chips (always visible when field is empty) */}
              {!form.vpa && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['@oksbi', '@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@apl'].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setForm(f => ({ ...f, vpa: f.vpa.split('@')[0] + h }))
                        vpaRef.current?.focus()
                      }}
                      className="text-xs text-slate-500 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-full transition"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}

              {vpaTouched && form.vpa && !vpaValid && (
                <p className="text-xs text-red-500 mt-1">Enter a valid VPA (e.g. name@oksbi)</p>
              )}
            </div>

            {/* Amount (optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Amount <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition"
            >
              Review &amp; Generate →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            <Link href="/" className="hover:text-blue-600 transition">← Back to homepage</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
