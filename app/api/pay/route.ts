import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { isValidVpa } from '@/lib/upi'

/**
 * GET /api/pay
 *
 * Query params:
 *   pa  – UPI VPA / Virtual Payment Address (required)
 *   pn  – Payee name (optional, default "Merchant")
 *   am  – Amount (optional)
 *   format – if "qr", returns PNG image; otherwise returns JSON
 *
 * Mobile clients get redirected via client-side window.location in /pay page.
 * This endpoint serves QR image bytes to the desktop /pay page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const pa = (searchParams.get('pa') || '').trim()
  const pn = decodeURIComponent(searchParams.get('pn') || 'Merchant').replace(/\+/g, ' ')
  const am = searchParams.get('am')
  const format = searchParams.get('format')

  // Validate VPA
  if (!pa || !isValidVpa(pa)) {
    return NextResponse.json(
      { error: 'Invalid or missing pa (UPI ID)' },
      { status: 400 }
    )
  }

  const amount = am ? parseFloat(am) : null
  const remark = 'UPIDirectPay'

  // Build NPCI-compliant upi:// deep link
  const encodedName = encodeURIComponent(pn)
  const encodedRemark = encodeURIComponent(remark)
  let upiLink = `upi://pay?pa=${pa}&pn=${encodedName}&tn=${encodedRemark}&cu=INR`
  if (amount !== null && !isNaN(amount) && amount > 0) {
    upiLink += `&am=${amount.toFixed(2)}`
  }

  // JSON mode — returns payment metadata + compiled upi link
  if (format !== 'qr') {
    return NextResponse.json({
      vpa: pa,
      name: pn,
      amount,
      currency: 'INR',
      remark,
      upiLink,
      qrUrl: `/api/pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}${amount ? `&am=${amount}` : ''}&format=qr`,
    })
  }

  // PNG mode — returns QR code image
  try {
    const qrBuffer = await QRCode.toBuffer(upiLink, {
      width: 400,
      margin: 2,
      color: { dark: '#0F172A', light: '#FFFFFF' },
      type: 'png',
    })

    return new NextResponse(new Uint8Array(qrBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    console.error('[api/pay] QR generation error:', err)
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 })
  }
}
