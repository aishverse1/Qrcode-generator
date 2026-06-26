import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UPIDirectPay.com — Zero-Commission UPI Payment Collection',
  description: 'UPIDirectPay.com routes UPI payments directly to your bank account. Zero commission, no middleman.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ice antialiased">{children}</body>
    </html>
  )
}
