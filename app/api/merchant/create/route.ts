import { NextRequest, NextResponse } from 'next/server'
import { createSignedPaymentToken } from '@/lib/token'
import { isValidVpa } from '@/lib/upi'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vpa, businessName, amount } = body

    // Validate VPA
    if (!vpa || typeof vpa !== 'string') {
      return NextResponse.json({ error: 'VPA (pa) is required' }, { status: 400 })
    }
    if (!isValidVpa(vpa.trim())) {
      return NextResponse.json({ error: 'Invalid VPA format' }, { status: 400 })
    }

    // Validate business name
    if (!businessName || typeof businessName !== 'string' || !businessName.trim()) {
      return NextResponse.json({ error: 'Business name (pn) is required' }, { status: 400 })
    }

    // Validate amount (must be positive if provided)
    const parsedAmount = amount != null && amount !== '' ? parseFloat(amount) : null
    if (parsedAmount !== null && (isNaN(parsedAmount) || parsedAmount <= 0)) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    // Create signed payment token stored in Firestore (6-char slug)
    const { token } = await createSignedPaymentToken({
      vpa: vpa.trim(),
      businessName: businessName.trim(),
      amount: parsedAmount,
      remarkCode: 'UPIDirectPay',
    })

    const payUrl = `/${token}`

    return NextResponse.json({
      success: true,
      token,
      payUrl,
      vpa: vpa.trim(),
      businessName: businessName.trim(),
      amount: parsedAmount,
    })
  } catch (err) {
    console.error('[api/merchant/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
