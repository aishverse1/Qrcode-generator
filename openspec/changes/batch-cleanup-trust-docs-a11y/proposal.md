## Why

The independent codebase review (and follow-up founder discussion) surfaced a batch of small, independent, low-risk cleanups that are each individually uncontroversial: fake trust signals that misrepresent verification status, a reconciliation claim the code doesn't back up, a fully orphaned/dead parallel payment flow with stale documentation pointing at it, duplicated per-app link-builder logic, a WCAG accessibility violation, a brittle origin-detection hack, and a fully-client-side "recent links" convenience so a merchant doesn't lose a link if they close the tab. None of these require a product/security design decision (unlike VPA verification, which is a separate change pending legal research) — they're all "just do it" fixes once written down.

## What Changes

- Remove "Secured by NPCI" and "✓ Verified" badges from the homepage and `QrCard` (nothing is actually verified); render the real "not affiliated with NPCI/UPI" disclaimer that currently sits unused in `components/Footer.tsx` instead of the dead component.
- URL-encode the `vpa` parameter everywhere it's interpolated into a `upi://` or `intent://` link string (defense-in-depth; currently safe only because `isValidVpa`'s charset happens not to need encoding).
- Remove the false "trackable remark code for reconciliation" claim from homepage copy, and delete the unused `generateRemarkCode()` function from `lib/upi.ts` (dead code, never invoked). The remark stays the constant `'UPIDirectPay'`.
- **BREAKING**: Delete `app/pay/page.tsx` and `app/api/pay/route.ts` entirely. Confirmed dead/orphaned — nothing in the live app links to them; the homepage only ever generates `/{slug}` links via `/api/merchant/create`. Anyone who bookmarked or embedded a raw `/pay?pa=...` URL directly (outside the product's own generated links) will lose that flow.
- Rewrite `components/CodeSnippetDemo.tsx` (and any related homepage copy) to document the real integration path — the `/{slug}` shareable link and the `MyPay.open({slug})` embed SDK from `/api/embed` — instead of the stale `/qr/{token}` and `/pay/{token}` examples.
- Consolidate the duplicated per-app UPI intent-link builder logic (the `UPI_APPS` array with `buildLink` functions for GPay/PhonePe/Paytm/BHIM) that's currently copy-pasted between `components/QrCard.tsx` and `components/MobileRedirect.tsx` into one shared helper in `lib/upi.ts`.
- Fix `app/layout.tsx` viewport meta to remove `maximumScale`/`userScalable: false` (restores pinch-zoom; WCAG 2.1 SC 1.4.4 violation).
- Add a lightweight, no-backend, client-side "recent links" list: after a successful `/api/merchant/create` call, store `{token, businessName, amount, createdAt}` in `localStorage` from the homepage, and render a "Recent links" section linking to `/{token}`.
- Fix `lib/upi.ts`'s `getCleanOrigin()` to use `process.env.NEXT_PUBLIC_BASE_URL` as the primary source instead of a hardcoded Vercel project-name string-replace hack, falling back to `window.location.origin`.
- Rename `lib/token.ts`'s `createSignedPaymentToken`/`verifySignedPaymentToken` to `createPaymentToken`/`verifyPaymentToken`, since nothing is actually signed — the old names implied HMAC/cryptographic verification that never existed. Delete the unused `TOKEN_SECRET` from `.env.example`.
- Bump the token generator from `nanoid(6)` to `nanoid(8)` (matching what the code's own comment already claimed), and switch the Firestore write from `.set()` to a create-only operation with retry-on-collision (up to 3 attempts), so a token collision can no longer silently overwrite an existing link's data.

**Explicitly out of scope for this change**: VPA ownership verification/disclaimer copy (pending legal research, separate change), and Firestore security rules (deferred).

## Capabilities

### New Capabilities
- `link-history`: client-side (localStorage-only) tracking of recently-created payment links on the homepage, so a merchant can find a link again after closing the tab, without any account or server-side persistence.

### Modified Capabilities
- `payment-link-creation`: the remark-code requirement changes from "always `'UPIDirectPay'`, described elsewhere as trackable" to "always `'UPIDirectPay'`, with no reconciliation claim made anywhere in the product." The token-storage requirement changes from `nanoid(6)` with no collision handling and misleadingly-named functions, to `nanoid(8)` with create-only writes, retry-on-collision, and accurately-named functions.
- `slug-payment-page`: the QR card rendering requirement changes to remove fake trust badges and render the real disclaimer; the per-app button requirement changes to use a shared link-builder instead of a duplicated one; VPA interpolation into deep links is now defensively encoded.
- `embed-widget`: the discoverability requirement changes from "no documentation page, stale homepage snippet" to "homepage snippet documents the real `/{slug}` + `MyPay.open()` integration path."

### Removed Capabilities
- `adhoc-pay-link`: removed in full. **Reason**: confirmed dead code with zero live traffic path (nothing in the app links to `/pay` or `/api/pay`); the product's actual scope is the slug-based link + embed SDK, not a query-param ad-hoc flow. **Migration**: none needed for in-product users (nothing points here); anyone who had manually constructed a raw `/pay?pa=...&pn=...` URL outside the product will need to instead create a proper link via the homepage or `/api/merchant/create`.

## Impact

- Files touched: `app/page.tsx` (trust badges, remark copy, recent-links UI, code snippet), `app/layout.tsx` (viewport meta), `components/QrCard.tsx` (badges, encoding, shared builder), `components/MobileRedirect.tsx` (shared builder), `components/Footer.tsx` (now rendered instead of dead), `components/CodeSnippetDemo.tsx` (rewritten), `lib/upi.ts` (encoding, `getCleanOrigin`, shared per-app builder, delete `generateRemarkCode`), `lib/token.ts` (rename + collision retry), `app/api/merchant/create/route.ts` and `app/[slug]/page.tsx` (updated call sites), `.env.example` (drop `TOKEN_SECRET`).
- Files deleted: `app/pay/page.tsx`, `app/api/pay/route.ts`.
- No Firestore schema changes. `payment-link-creation`'s API response shape (`token`, `payUrl`, etc.) is unchanged — only the internal function names and token length/collision behavior change.
