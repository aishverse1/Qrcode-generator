## REMOVED Requirements

### Requirement: Query-Param Validation
**Reason**: The `adhoc-pay-link` capability (`/pay` + `/api/pay`) is fully orphaned — nothing in the live product links to it; the homepage only ever generates `/{slug}` links via `/api/merchant/create`. The product's actual scope is the slug-based link plus the embed SDK, not a query-param ad-hoc flow.
**Migration**: None needed for in-product users. Anyone who had manually constructed a raw `/pay?pa=...&pn=...` URL outside the product must instead create a proper link via the homepage or `POST /api/merchant/create`.

### Requirement: Mobile Auto-Redirect
**Reason**: Same as above — this requirement only existed to serve the now-removed `/pay` route.
**Migration**: The slug-based `/{slug}` route's mobile handling (see `slug-payment-page` capability) is the supported mobile flow.

### Requirement: Desktop QR View
**Reason**: Same as above.
**Migration**: The slug-based `/{slug}` route's `QrCard` rendering (see `slug-payment-page` capability) is the supported desktop flow.

### Requirement: Server-Side QR/JSON Endpoint
**Reason**: `GET /api/pay` only ever served the now-removed `/pay` page's QR image; it has no other caller.
**Migration**: None — the slug page generates its QR client-side via the `qrcode` package and never depended on this endpoint.
