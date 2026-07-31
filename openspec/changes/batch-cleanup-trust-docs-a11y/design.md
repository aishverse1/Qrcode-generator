## Context

See proposal.md - Why. This change bundles 10 independent, low-risk fixes across `app/page.tsx` (1002 lines: hero copy at ~line 714 "Secured by NPCI", copy at ~line 794 "trackable remark code", verified badges at ~lines 861/897, plus the create-link form flow), `app/layout.tsx`, `components/QrCard.tsx`, `components/MobileRedirect.tsx`, `components/CodeSnippetDemo.tsx`, `components/Footer.tsx` (currently unrendered), `lib/upi.ts`, and `lib/token.ts` (plus its two call sites). None of these touch `middleware.ts` or the Firestore schema.

## Goals / Non-Goals

**Goals:**
- Each item in the proposal ships as a small, independently-reviewable diff within this one change.
- No behavior regression to `payment-link-creation`, `slug-payment-page`, or `embed-widget` beyond the specific deltas described.
- The token rename/collision-retry fix does not change `POST /api/merchant/create`'s external response shape — only internals.

**Non-Goals:**
- Not building VPA ownership verification or its disclaimer copy — separate change, pending legal research.
- Not adding Firestore security rules — deferred.
- Not building a full `/developers` documentation page — only fixing the existing homepage snippet to point at real routes.

## Decisions

**Delete `adhoc-pay-link` outright rather than deprecate-in-place.** Confirmed via grep that nothing in the live app (`app/`, `components/`, `lib/`) references `/pay` as a route or `/api/pay` as an endpoint — the homepage's create-link flow uses `/api/merchant/create` → `/{token}` exclusively. A soft-deprecation (keep the route, mark it legacy) would preserve dead code with no benefit; deleting is the lazy-correct move. Alternative considered: add a redirect from `/pay` to `/`. Rejected — no evidence any external party has ever linked to `/pay`, so a redirect protects against a hypothetical with real maintenance cost (another route to keep track of).

**Shared per-app link builder goes in `lib/upi.ts`, exported as data (an array of `{ name, shortName, brandColor, buildLink }`), imported by both `QrCard.tsx` and `MobileRedirect.tsx`.** This matches the existing pattern where `buildUpiLink` and `isValidVpa` already live there. Alternative considered: a new `lib/upiApps.ts` file. Rejected — one more file for one array; `lib/upi.ts` is already the home for UPI link logic.

**`getCleanOrigin()` fix is additive-safe.** Change the primary branch to check `process.env.NEXT_PUBLIC_BASE_URL` first; keep `window.location.origin` as the client-side fallback for local dev / previews where that env var isn't set. Drop the Vercel-project-specific regex entirely — once `NEXT_PUBLIC_BASE_URL` is set in production, the hack is unreachable dead logic anyway.

**`link-history` is `localStorage`-only, no new dependency.** A single homepage-local hook reads/writes a JSON array under one key (e.g. `upay:recent-links`), capped at a reasonable count (e.g. last 20) to avoid unbounded growth. No IndexedDB, no external state library — `localStorage` + `JSON.parse`/`stringify` is sufficient for a flat list this small.

**Collision retry uses Firestore's `.create()`, not a read-then-write check.** A read-check-then-set has a race window (two requests could both pass the check before either writes); `.create()` is atomic — it fails server-side if the document already exists, so the retry loop is race-safe without needing a transaction. Capped at 3 attempts (arbitrary but generous — at `nanoid(8)` length, collision odds are effectively zero; the cap exists only to avoid a pathological infinite loop, not because 3 is a meaningful number here).

**Rename is mechanical, not semantic.** `createPaymentToken`/`verifyPaymentToken` do exactly what `createSignedPaymentToken`/`verifySignedPaymentToken` did (same Firestore behavior) — only the name and the token length/collision-safety change. No caller-visible behavior changes beyond token length (6→8 chars, still within the existing `{4,12}` middleware matcher, so no matcher update needed).

**Trust badge removal and disclaimer swap happen together.** Removing "Secured by NPCI" (line ~714) and the two "✓ Verified" badges (lines ~861, ~897) from `app/page.tsx`, and replacing the current inline `<footer>` (line ~957) with the existing `components/Footer.tsx` (which already contains the real "not affiliated with NPCI/UPI" disclaimer) in one pass, so the page is never left in a state with neither the fake badges nor the real disclaimer.

## Risks / Trade-offs

- **[Risk]** Deleting `app/pay/page.tsx` and `app/api/pay/route.ts` is a **BREAKING** change for any URL built outside the product. → Mitigation: confirmed zero in-product references; proposal calls this out explicitly; acceptable given the product's actual scope per founder direction.
- **[Risk]** Swapping the inline `<footer>` for `components/Footer.tsx` could visually differ from the current design (different copy/layout). → Mitigation: review `Footer.tsx`'s current markup against the inline footer before swapping; adapt styling to match the existing page rather than importing a jarring visual mismatch.
- **[Trade-off]** `link-history` has no expiry/sync — a merchant switching browsers or devices loses their history. Documented as an explicit non-goal in the proposal (client-side-only is the deliberate minimal scope); a real fix would require accounts, which is out of scope.

## Migration Plan

No data migration. Single atomic deploy — no feature flags needed (all changes are corrective or additive, and the one breaking change — `/pay` removal — has no live traffic to break). Rollback via plain revert if needed.
