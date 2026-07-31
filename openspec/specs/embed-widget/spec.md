# Embed Widget Specification

## Purpose
A third-party-embeddable JavaScript SDK, served from `/api/embed`, that lets external sites open a UPIDirectPay payment flow in a modal (desktop) or direct redirect (mobile), either via explicit SDK calls or a legacy auto-rendered floating button.

## Requirements

### Requirement: Script Delivery
`GET /api/embed` SHALL return a self-contained JavaScript file with permissive CORS.

#### Scenario: Response headers
- **WHEN** any client requests `/api/embed`
- **THEN** the response has `Content-Type: application/javascript`, `Access-Control-Allow-Origin: *`, and is cached (`max-age=3600`, `s-maxage=86400`, `stale-while-revalidate=3600`)

### Requirement: `MyPay.open()` SDK
The script SHALL expose `window.MyPay.open(opts)` for host pages to call directly.

#### Scenario: Open by slug (desktop)
- **WHEN** `open({ slug })` is called on a non-mobile browser
- **THEN** the SDK injects a modal overlay with an iframe pointed at `{BASE}/{slug}?embed=true`

#### Scenario: Open by slug (mobile)
- **WHEN** `open({ slug })` is called on a mobile browser
- **THEN** the SDK navigates the top-level window to `{BASE}/{slug}` directly (no iframe/modal) — the slug page's own middleware then performs the `upi://` redirect

#### Scenario: Open by raw pa/pn/am (desktop)
- **WHEN** `open({ pa, pn, am })` is called with no `slug`, on a non-mobile browser
- **THEN** the SDK opens the same modal, with the iframe pointed at `{BASE}/pay?pa=...&pn=...&am=...&embed=true`

#### Scenario: Open by raw pa/pn/am (mobile)
- **WHEN** `open({ pa, pn, am })` is called with no `slug`, on a mobile browser
- **THEN** the SDK navigates directly to `upi://pay?pa=...&pn=...&cu=INR[&am=...]`, bypassing the `/pay` page entirely, with no `tn` remark param included

#### Scenario: Missing options
- **WHEN** `open()` is called with no arguments, or with neither `slug` nor `pa`
- **THEN** the SDK logs a console warning and does nothing

#### Scenario: Modal dismissal
- **WHEN** the modal is open
- **THEN** it can be closed via the close button, clicking the overlay background, or pressing Escape

### Requirement: Legacy Auto-Widget Mode
If the embedding `<script>` tag carries `data-pa` or `data-slug`/`data-token`, the SDK SHALL auto-render a floating "Pay with UPI" button.

#### Scenario: Auto-render trigger
- **WHEN** the script tag has `data-pa` or `data-slug`/`data-token` set
- **THEN** on DOM ready, a fixed-position button is injected (bottom-right) that calls `MyPay.open()` with those params on click

#### Scenario: Pure SDK mode
- **WHEN** the script tag has none of `data-pa`, `data-slug`, `data-token`
- **THEN** no button is auto-rendered; only `window.MyPay` is exposed for manual use

### Requirement: Base URL Resolution
The SDK SHALL resolve its own base URL through a fallback chain rather than a fixed config value.

#### Scenario: Resolution order
- **WHEN** the SDK determines its own base URL
- **THEN** it prefers the build-time `NEXT_PUBLIC_BASE_URL` env var
- **AND** if unset, it inspects its own `<script src>` for `/api/embed` and derives the origin from that
- **AND** if that also fails, it falls back to `window.location.origin`

### Requirement: Discoverability
The SDK MUST currently rely on inline code comments as its only documentation; no dedicated integrator-facing page exists.

#### Scenario: No documentation page
- **WHEN** an external integrator looks for how to use this SDK
- **THEN** no page on the site documents `MyPay.open()`, its parameters, or the legacy `data-*` attributes — the only documentation is the comment block at the top of `app/api/embed/route.ts`

#### Scenario: Homepage snippet is stale
- **WHEN** a visitor views the homepage's `CodeSnippetDemo` component
- **THEN** it shows `/qr/{token}` and `/pay/{token}` URL examples that do not match any real route (there is no `/qr/` route, and `/pay/{token}` 301-redirects to `/{token}`), instead of documenting the working `MyPay.open()` SDK
