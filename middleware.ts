import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Legacy /pay/[token] redirect ──────────────────────────
  const payTokenMatch = pathname.match(/^\/pay\/([a-zA-Z0-9_-]{4,12})$/)
  if (payTokenMatch) {
    const token = payTokenMatch[1]
    const url = request.nextUrl.clone()
    url.pathname = `/${token}`
    return NextResponse.redirect(url, 301)
  }

  // ── Slug-based routing: /[slug] ───────────────────────────
  // Mobile deep-link handling now happens client-side in app/[slug]/page.tsx
  // (via MobileRedirect), so the page always renders — no server redirect here.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:slug([a-zA-Z0-9_-]{4,12})',
    '/pay/:token([a-zA-Z0-9_-]{4,12})',
  ],
}
