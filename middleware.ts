import { NextRequest, NextResponse } from 'next/server'

const MOBILE_UA_REGEX = /Android|iPhone|iPod|iPad|Mobile|webOS|BlackBerry|Opera Mini|IEMobile|Kindle/i
const FIRESTORE_PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'upidirectpay'

export const runtime = 'nodejs'

// Paths that are NOT slugs — never intercept these
const RESERVED = new Set([
  'pay', 'register', 'api', '_next', 'favicon.ico',
  'robots.txt', 'sitemap.xml', 'manifest.json',
])

/**
 * Look up payment data from Firestore REST API.
 * Used server-side in middleware — no firebase-admin bundle needed.
 */
async function getPaymentByToken(token: string): Promise<{
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
} | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/payments/${token}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res.ok) return null
    const doc = await res.json()
    if (!doc.fields) return null

    const f = doc.fields
    const rawAmount = f.amount?.doubleValue ?? f.amount?.integerValue ?? null
    return {
      vpa: f.vpa?.stringValue || '',
      businessName: f.businessName?.stringValue || '',
      amount: rawAmount !== null ? parseFloat(rawAmount) : null,
      remarkCode: f.remarkCode?.stringValue || 'UPIDirectPay',
    }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ── Legacy /pay/[token] redirect ──────────────────────────
  const payTokenMatch = pathname.match(/^\/pay\/([a-zA-Z0-9_-]{4,12})$/)
  if (payTokenMatch) {
    const token = payTokenMatch[1]
    const url = request.nextUrl.clone()
    url.pathname = `/${token}`
    return NextResponse.redirect(url, 301)
  }

  // ── Slug-based routing: /[slug] ───────────────────────────
  const slugMatch = pathname.match(/^\/([a-zA-Z0-9_-]{4,12})$/)
  if (!slugMatch) return NextResponse.next()

  const slug = slugMatch[1]

  // Skip reserved paths
  if (RESERVED.has(slug.toLowerCase())) return NextResponse.next()

  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = MOBILE_UA_REGEX.test(userAgent)
  const isEmbed = searchParams.get('embed') === 'true'

  // For embed or desktop: let the page render normally (server component handles it)
  if (isEmbed || !isMobile) return NextResponse.next()

  // Mobile: do a server-side redirect straight to the UPI deep link
  const data = await getPaymentByToken(slug)
  if (!data) return NextResponse.next() // Let 404 page handle it

  const { vpa, businessName, amount, remarkCode } = data
  if (!vpa) return NextResponse.next()

  const encodedName = encodeURIComponent(businessName)
  const encodedRemark = encodeURIComponent(remarkCode || 'UPIDirectPay')
  let upiLink = `upi://pay?pa=${vpa}&pn=${encodedName}&tn=${encodedRemark}&cu=INR`
  if (amount && amount > 0) {
    upiLink += `&am=${Number(amount).toFixed(2)}`
  }

  // Redirect to UPI deep link — browser will open UPI app or fall back to the page
  return NextResponse.redirect(upiLink)
}

export const config = {
  matcher: [
    '/:slug([a-zA-Z0-9_-]{4,12})',
    '/pay/:token([a-zA-Z0-9_-]{4,12})',
  ],
}
