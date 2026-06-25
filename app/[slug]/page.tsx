import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { verifySignedPaymentToken } from '@/lib/token'
import { MOBILE_UA_REGEX } from '@/lib/upi'
import QrCard from '@/components/QrCard'
import MobileRedirect from '@/components/MobileRedirect'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
  searchParams: { embed?: string }
}

// Reserved path segments that should NOT be treated as slugs
const RESERVED_PATHS = new Set([
  'pay', 'register', 'api', '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml',
])

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await verifySignedPaymentToken(params.slug)
  if (!data) return { title: 'Payment Not Found — UPIDirectPay' }
  return {
    title: `Pay ${data.businessName} — UPIDirectPay`,
    description: `Send a UPI payment directly to ${data.businessName}. Zero commission.`,
  }
}

export default async function SlugPage({ params, searchParams }: Props) {
  const { slug } = params
  const isEmbed = searchParams.embed === 'true'

  // Guard: skip reserved segments
  if (RESERVED_PATHS.has(slug.toLowerCase())) {
    notFound()
  }

  // Fetch payment data from Firestore (server-side — VPA never in URL)
  const data = await verifySignedPaymentToken(slug)
  if (!data) notFound()

  const { vpa, businessName, amount, remarkCode } = data

  // Read User-Agent server-side to decide which view to render
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = MOBILE_UA_REGEX.test(userAgent)

  // Embed mode: compact stripped card (no header/footer), suitable for iframes
  if (isEmbed) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen p-4">
        <QrCard
          vpa={vpa}
          businessName={businessName}
          amount={amount}
          remarkCode={remarkCode}
          embedMode
        />
      </div>
    )
  }

  // Mobile: fire UPI deep link immediately + fallback buttons
  if (isMobile) {
    return (
      <MobileRedirect
        vpa={vpa}
        businessName={businessName}
        amount={amount}
        remarkCode={remarkCode}
      />
    )
  }

  // Desktop: full QR card with dark background
  return (
    <QrCard
      vpa={vpa}
      businessName={businessName}
      amount={amount}
      remarkCode={remarkCode}
      embedMode={false}
    />
  )
}
