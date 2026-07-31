## Why

Today, `middleware.ts` redirects every mobile visitor to `/{slug}` straight into a `upi://` deep link with no fallback. If the visitor has no UPI app installed (or is in an in-app browser that blocks custom schemes, e.g. Instagram/LinkedIn), the redirect silently fails and they're stuck on a blank screen with no way to recover — no QR code, no "download a UPI app" prompt, nothing. `components/MobileRedirect.tsx` already implements a countdown + app-picker fallback UI for exactly this case, but it is dead code: nothing in the app renders it. This is the single most common real-world dead end in the product today and the fix requires no new design, only reconnecting existing code.

## What Changes

- Middleware no longer performs a hard server-side redirect straight to `upi://` for mobile visitors. Instead it lets the page render, and the mobile deep-link attempt (plus fallback) happens client-side.
- `app/[slug]/page.tsx` renders `MobileRedirect` on mobile instead of relying on the middleware redirect, so a failed/unhandled deep link falls back to visible UI (countdown, "open in GPay/PhonePe/Paytm/BHIM" buttons, QR code) instead of a blank page.
- Desktop and embed rendering paths are unchanged.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `slug-payment-page`: the "Mobile Deep-Link Redirect" requirement changes from an unconditional server-side redirect with no fallback, to a client-side deep-link attempt with a visible fallback UI when no app handles it.

## Impact

- `middleware.ts` — remove the unconditional mobile `NextResponse.redirect(upiLink)` branch.
- `app/[slug]/page.tsx` — render `MobileRedirect` for mobile requests instead of (or alongside) `QrCard`.
- `components/MobileRedirect.tsx` — becomes live code; no logic changes expected, but verify its existing countdown/fallback behavior against current requirements.
- No API, schema, or Firestore changes. No impact on `payment-link-creation`, `adhoc-pay-link`, or `embed-widget` capabilities.
