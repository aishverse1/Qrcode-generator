## 1. Trust Signals

- [x] 1.1 Remove "Secured by NPCI" text from `app/page.tsx` (~line 714).
- [x] 1.2 Remove the two "✓ Verified" badges from `app/page.tsx` (~lines 861, 897). (Also removed the "UPAY-7X2K" fake per-link remark code badge in the same mockup, since it made the same false reconciliation claim as task 2.1.)
- [x] 1.3 Reviewed `components/Footer.tsx` — deviated from the plan: the page's real `<footer>` (line ~957) already has its own matching marquee styling (same content, different CSS classes than `Footer.tsx`'s Tailwind/dark-navy styling); swapping in `Footer.tsx` verbatim would have looked visually inconsistent. Instead added the disclaimer text directly to the existing footer copy and deleted the now-fully-redundant `Footer.tsx`.
- [x] 1.4 (Superseded by 1.3's approach — disclaimer merged into the existing footer instead of swapping components.)
- [x] 1.5 Verified — no trust badges present in `components/QrCard.tsx` or `components/MobileRedirect.tsx`.

## 2. Remark Code Claim

- [x] 2.1 Removed the "Each transaction gets a trackable remark code for reconciliation" line from `app/page.tsx` (~line 794).
- [x] 2.2 Deleted the unused `generateRemarkCode()` function from `lib/upi.ts`.

## 3. Delete Ad-hoc Pay Link

- [x] 3.1 Delete `app/pay/page.tsx`.
- [x] 3.2 Delete `app/api/pay/route.ts`.
- [x] 3.3 Grepped and found two real consequences beyond docs: (a) the embed SDK's `MyPay.open({ pa, pn, am })` raw mode (`app/api/embed/route.ts`) pointed its desktop iframe at the deleted `/pay?pa=...` route — removed that raw mode entirely (SDK + legacy widget's `data-pa` support), only `open({ slug })` remains; updated `specs/embed-widget/spec.md` delta accordingly. (b) `/pay` now falls through to the `app/[slug]/page.tsx` dynamic route instead of being shadowed by the deleted static page — its `generateMetadata` queried Firestore before checking `RESERVED_PATHS`, causing a 500 (pre-existing latent bug, newly exposed). Fixed by adding the same `RESERVED_PATHS` check to `generateMetadata`.

## 4. Fix Developer-Facing Docs

- [x] 4.1 Rewrote `components/CodeSnippetDemo.tsx`'s HTML and JavaScript tabs to show the real integration path (embed SDK via `<script src="/api/embed">` + `MyPay.open({ slug })`, and the real `/api/merchant/create` → `token` → `MyPay.open({slug: token})` flow), instead of `/qr/{token}` and `/pay/{token}` examples. Left the "Shareable Link" and "UPI Protocol" tabs as-is (already accurate / just educational).
- [x] 4.2 Fixed the stale `/pay/{token}` URL in the homepage's step-2 visual mockup (~line 869) to the real `/{token}` format.

## 5. Consolidate Per-App Link Builders

- [x] 5.1 Extracted the `UPI_APPS` array (GPay/PhonePe/Paytm/BHIM `buildLink` functions) from `components/QrCard.tsx` into a shared export in `lib/upi.ts`. Used `MobileRedirect`'s richer shape (`name` full + `shortName` short) since `QrCard` needed a rename (`app.name` → `app.shortName`) for its button labels/logo lookup anyway.
- [x] 5.2 Updated `components/QrCard.tsx` to import and use the shared array; updated its button label and `APP_LOGOS` lookup to use `app.shortName` instead of the old short `app.name`.
- [x] 5.3 Updated `components/MobileRedirect.tsx` to import and use the same shared array instead of its own copy (no rename needed — it already used the full `name` field).

## 6. VPA Encoding

- [x] 6.1 In `lib/upi.ts`'s `buildUpiLink`, wrapped `vpa` in `encodeURIComponent()`.
- [x] 6.2 In the shared per-app builder (`UPI_APPS` in `lib/upi.ts`), wrapped `vpa` in `encodeURIComponent()` in each app's `buildLink`.
- [x] 6.3 Grepped for remaining inline `pa=${vpa}` constructions and encoded the two `universalLink` builders in `components/QrCard.tsx` and the one in `components/MobileRedirect.tsx` (the "Open in Any UPI App" / Android intent fallback, separate from the per-app `UPI_APPS` builders). `app/page.tsx`'s code-snippet demo data is illustrative text only (`ravi@oksbi` as a string literal), not a real link build — left as-is.

## 7. Accessibility: Pinch-Zoom

- [x] 7.1 In `app/layout.tsx`, removed `maximumScale` and `userScalable: false` from the viewport export.

## 8. Recent Links (client-side history)

- [x] 8.1 Added `lib/linkHistory.ts` with `getRecentLinks`/`addRecentLink`, storing `{ token, businessName, amount, createdAt }` under `upay:recent-links`, capped at 20 entries.
- [x] 8.2 Wired into `app/page.tsx`'s `handleCreateSuccess` (replacing the old inline `onSuccess` callback), called after a successful `/api/merchant/create` response.
- [x] 8.3 Rendered a "Recent links" section on the homepage (business name, amount or "Open amount", link to `/{token}`); section is hidden entirely when the list is empty (simplest valid option per the spec's "hidden or empty-state" allowance).
- [x] (Found during implementation) Removed two more instances of the fake `UPAY-7X2K` per-link remark code badge that task 2 missed: one in the homepage's "Visual 3" journey mockup (`app/page.tsx`), and the `tn=` example value in `CodeSnippetDemo.tsx`'s "UPI Protocol" tab — both replaced/removed to stay consistent with "no reconciliation claim exists anywhere in the product."

## 9. Origin Detection Fix

- [x] 9.1 In `lib/upi.ts`'s `getCleanOrigin()`, now checks `process.env.NEXT_PUBLIC_BASE_URL` first, falls back to `window.location.origin`; deleted the hardcoded Vercel project-name regex/replace logic.

## 11. Token Rename (item 8)

- [x] 11.1 Renamed `createSignedPaymentToken` → `createPaymentToken` and `verifySignedPaymentToken` → `verifyPaymentToken` in `lib/token.ts`.
- [x] 11.2 Updated call sites: `app/api/merchant/create/route.ts` (import + call), `app/[slug]/page.tsx` (import + 2 call sites in `generateMetadata` and `SlugPage`).
- [x] 11.3 Deleted the unused `TOKEN_SECRET` line from `.env.example`.
- [x] 11.4 Updated `lib/token.ts`'s docstrings to drop the stale "/pay/{token}" URL reference and the signing implication.

## 12. Nanoid Length + Collision Retry (item 9)

- [x] 12.1 Bumped token generation from `nanoid(6)` to `nanoid(8)` in `lib/token.ts` (matches the pre-existing but previously-inaccurate docstring claim).
- [x] 12.2 Switched the Firestore write from `.set()` to `.create()` (fails if the doc exists) inside a retry loop, up to 3 attempts, instead of silently overwriting on collision.
- [x] 12.3 Confirmed the middleware's `{4,12}` slug matcher and `[slug]/page.tsx`'s `RESERVED_PATHS` check don't need updating for the new 8-char length (already within range).

## 10. Verification

- [x] 10.1 Ran `npx tsc --noEmit` — clean, no errors.
- [x] 10.2 Loaded the homepage via curl: confirmed no "Secured by NPCI"/"Verified"/"UPAY-7X2K" strings in the rendered HTML, confirmed the disclaimer ("Not affiliated with NPCI") is present, confirmed remark-code overclaim copy is gone, confirmed `CodeSnippetDemo` shows the `/api/embed` + `MyPay.open()` example.
- [ ] 10.3 **Blocked** — same pre-existing environment limitation as the previous change: `.env.local` has placeholder Firebase Admin credentials, so `/api/merchant/create` 500s ("Failed to parse private key") regardless of this change. Could not manually create a real link to verify "Recent links" end-to-end. Code review: `handleCreateSuccess` is wired correctly and only runs on `res.ok`.
- [x] 10.4 Confirmed `/pay` → 404 (after fixing the `generateMetadata` reserved-path gap found during this check) and `/api/pay` → 404.
- [ ] 10.5 **Blocked** — same Firebase credential limitation; can't load a real `/{slug}` page to click-test the per-app buttons. Code review: `QrCard.tsx` and `MobileRedirect.tsx` both import the same `UPI_APPS` from `lib/upi.ts` and call `app.buildLink(vpa, businessName, amount, isAndroid)` identically to before.
- [x] 10.6 Ran `openspec validate batch-cleanup-trust-docs-a11y --strict` — see below.
