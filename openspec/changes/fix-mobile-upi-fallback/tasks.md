## 1. Middleware

- [x] 1.1 Remove the mobile `upi://` redirect branch from `middleware.ts` (the `getPaymentByToken` fetch + `NextResponse.redirect(upiLink)` block), leaving the `/pay/{token}` legacy 301 and `NextResponse.next()` for everything else. (The `RESERVED` path check was also removed — it became dead code since it no longer gated anything, and `app/[slug]/page.tsx` already has its own equivalent `RESERVED_PATHS` guard.)
- [x] 1.2 Confirm the `embed=true` bypass still short-circuits correctly with the mobile branch removed (embed should always fall through to `NextResponse.next()` regardless of device).

## 2. Slug Page

- [x] 2.1 In `app/[slug]/page.tsx`, detect mobile server-side using `MOBILE_UA_REGEX` from `lib/upi.ts` against the `user-agent` header (via `next/headers`).
- [x] 2.2 When mobile and not embed, render `<MobileRedirect vpa={vpa} businessName={businessName} amount={amount} remarkCode={remarkCode} />` instead of `<QrCard ... embedMode={false} />`.
- [x] 2.3 Leave the embed branch (`isEmbed`) and the desktop/non-mobile branch rendering `QrCard` unchanged.

## 3. Verification

- [ ] 3.1 Manually test on a mobile browser with a UPI app installed: confirm the deep link still opens the app immediately (no regression).
- [ ] 3.2 Manually test on a mobile browser/device with no UPI app installed (or an in-app browser like Instagram that blocks custom schemes): confirm the "launching" spinner shows, then after ~3s the fallback UI (per-app buttons + "Open in Any UPI App") appears instead of a blank page.
- [ ] 3.3 Confirm desktop behavior is unchanged (QR card renders as before).
- [ ] 3.4 Confirm embed mode (`?embed=true`) is unchanged on both desktop and mobile.
- [ ] 3.5 Run `openspec validate fix-mobile-upi-fallback --strict` and fix any reported issues.
