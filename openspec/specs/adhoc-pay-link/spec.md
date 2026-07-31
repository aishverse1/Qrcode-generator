# Ad-hoc Pay Link Specification

## Purpose
A second, parallel path to the same outcome as slug payment pages: `/pay?pa=&pn=&am=` builds a UPI payment view entirely from query parameters, with no server-side persistence. Used for on-the-fly links and as the image source for the standalone QR PNG endpoint.

## Requirements

### Requirement: Query-Param Validation
`/pay` (client component) SHALL validate the `pa` query parameter before doing anything else.

#### Scenario: Missing pa
- **WHEN** `pa` is absent from the query string
- **THEN** the page shows an "Invalid Payment Request" error state with message "Missing required parameter: pa (UPI ID)"

#### Scenario: Invalid pa format
- **WHEN** `pa` fails `isValidVpa` (`^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$`)
- **THEN** the page shows the error state with message `"{pa}" is not a valid UPI ID`

### Requirement: Mobile Auto-Redirect
On mobile user agents, `/pay` SHALL attempt an automatic redirect into a UPI app.

#### Scenario: Mobile with valid pa
- **WHEN** the client detects a mobile user agent and `pa` is valid
- **THEN** it sets `window.location.href` to `upi://pay?pa=...&pn=...&tn=UPIDirectPay&cu=INR[&am=...]` immediately, then shows a "redirecting" screen with a merchant-initial avatar and a progress bar
- **AND** falls back to the desktop QR view automatically after 2 seconds (assumes the deep link either succeeded — app switched away — or failed and the user is still here)

### Requirement: Desktop QR View
On non-mobile visits with a valid `pa`, `/pay` SHALL render a QR card and copyable links.

#### Scenario: QR image source
- **WHEN** the desktop view renders
- **THEN** the QR `<img>` points at `/api/pay?pa=...&pn=...&am=...&format=qr`, i.e. the QR pixels are generated server-side by a separate route, not client-side like the slug page's `QrCard`

#### Scenario: Two independently-built links shown
- **WHEN** the desktop view renders
- **THEN** it shows both the current page URL ("Shareable link") and a **separately reconstructed** `upi://` string built inline in `pay/page.tsx` (not via `lib/upi.ts`'s `buildUpiLink`) as the "UPI deep link" — these two link-builders can drift from each other and from `lib/upi.ts`

### Requirement: Server-Side QR/JSON Endpoint
`GET /api/pay` SHALL validate `pa` and return either a PNG QR image or JSON payment metadata.

#### Scenario: Missing/invalid pa
- **WHEN** `pa` is absent or fails `isValidVpa`
- **THEN** the route responds `400` with `{ error: 'Invalid or missing pa (UPI ID)' }`

#### Scenario: JSON mode (default)
- **WHEN** `format` is not `qr`
- **THEN** the route responds with `{ vpa, name, amount, currency: 'INR', remark: 'UPIDirectPay', upiLink, qrUrl }` — `remark` here is always the literal `'UPIDirectPay'`, independent of any per-link remark code

#### Scenario: QR mode
- **WHEN** `format=qr`
- **THEN** the route returns a 400x400 PNG (`qrcode` package, dark `#0F172A` on white) of the built `upi://` link, cached with `Cache-Control: public, max-age=300`

#### Scenario: No persistence
- **WHEN** any `/pay` or `/api/pay` request is made
- **THEN** nothing is written to Firestore — this path has no equivalent of a "token" and cannot be looked up or shared as a short link; the full `pa`/`pn`/`am` must be present in every URL
