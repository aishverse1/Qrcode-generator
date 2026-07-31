# Slug Payment Page Specification

## Purpose
Serves the shareable `/{slug}` payment page: on mobile it redirects straight into a UPI app, on desktop (or when embedded) it renders a QR code + payment card.

## Requirements

### Requirement: Slug Routing and Reserved Paths
The system SHALL treat any path matching `^/[a-zA-Z0-9_-]{4,12}$` as a candidate payment slug, except for a reserved list.

#### Scenario: Reserved path is not treated as a slug
- **WHEN** the path is `pay`, `register`, `api`, `_next`, `favicon.ico`, `robots.txt`, `sitemap.xml`, or `manifest.json`
- **THEN** the request is passed through to normal Next.js routing instead of slug lookup

#### Scenario: Legacy `/pay/{token}` redirect
- **WHEN** a request matches `/pay/{token}` where token is 4-12 alphanumeric/`_`/`-` characters
- **THEN** the system issues a permanent (301) redirect to `/{token}`

### Requirement: Mobile Deep-Link Redirect
On mobile user agents, the system SHALL redirect directly to the `upi://` deep link before rendering any page content.

#### Scenario: Mobile visitor with a valid token
- **WHEN** `middleware.ts` detects a mobile user agent (via `MOBILE_UA_REGEX`) requesting `/{slug}`, and the slug is not reserved, and `embed=true` is not set
- **THEN** the middleware fetches the payment doc from Firestore via the public REST API, builds `upi://pay?pa=...&pn=...&tn=...&cu=INR[&am=...]`, and issues an HTTP redirect to that `upi://` URL — no fallback UI is shown if no UPI app handles the scheme

#### Scenario: Mobile visitor with unknown token
- **WHEN** the token is not found in Firestore
- **THEN** the middleware calls `NextResponse.next()`, allowing the page component to render and call `notFound()`

#### Scenario: Desktop or embed request bypasses the redirect
- **WHEN** the user agent is not mobile, or the query string contains `embed=true`
- **THEN** the middleware passes the request through and the `[slug]/page.tsx` server component renders normally

### Requirement: Desktop/Embed Page Rendering
`app/[slug]/page.tsx` SHALL look up the token server-side and render a `QrCard`.

#### Scenario: Valid token
- **WHEN** `verifySignedPaymentToken(slug)` resolves to payment data
- **THEN** the page renders `<QrCard vpa businessName amount remarkCode embedMode={isEmbed} />`, with `embedMode` true only when `?embed=true` is present

#### Scenario: Unknown token
- **WHEN** the token is not found
- **THEN** the page calls Next.js `notFound()`, rendering the default 404

#### Scenario: Dynamic per-page metadata
- **WHEN** `generateMetadata` runs for a valid slug
- **THEN** the page title becomes `Pay {businessName} — UPIDirectPay`; for an unknown slug it becomes `Payment Not Found — UPIDirectPay`

### Requirement: QR Card Rendering
`components/QrCard.tsx` SHALL render a client-side QR code encoding the UPI deep link, plus buttons to open specific UPI apps or copy the link.

#### Scenario: QR generation
- **WHEN** the component mounts with `vpa`, `businessName`, `amount`, `remarkCode`
- **THEN** it builds the deep link via `buildUpiLink(...)` and renders it as a data-URL QR code (240x240, black on white) using the `qrcode` package client-side

#### Scenario: Per-app buttons (non-embed only)
- **WHEN** `embedMode` is false
- **THEN** the card shows GPay/PhonePe/Paytm/BHIM buttons, each building an app-specific `intent://` (Android) or custom-scheme (`gpay://`, `phonepe://`, `paytmmp://`) URI independently of `buildUpiLink`

#### Scenario: Copy link
- **WHEN** the user clicks "Copy Payment Link"
- **THEN** the current page URL (via `getCleanOrigin() + pathname`) is copied to the clipboard, with a 2-second "Copied!" confirmation

#### Scenario: No payment-status feedback
- **WHEN** the user completes or abandons the UPI app flow
- **THEN** the page has no mechanism to detect success/failure — there is no polling, webhook, or callback; the card never changes state after the app opens
