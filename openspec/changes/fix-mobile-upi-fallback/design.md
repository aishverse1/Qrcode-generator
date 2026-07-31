## Context

See proposal.md - Why. Today `middleware.ts` does a hard server-side `NextResponse.redirect(upiLink)` for mobile visitors to `/{slug}`, before the page ever renders. `components/MobileRedirect.tsx` already contains a working client-side "attempt deep link → 3s countdown → app-picker fallback" flow, but nothing renders it — `app/[slug]/page.tsx` always renders `QrCard`, and the middleware never lets a mobile request reach the page in the first place (it exits via `NextResponse.redirect`).

## Goals / Non-Goals

**Goals:**
- Mobile visitors always land on a page that can recover if the deep link doesn't open an app, instead of a blank/failed navigation.
- Reuse `MobileRedirect` as-is; no new fallback UI to design.

**Non-Goals:**
- No changes to VPA verification, remark codes, or trust badges (separate changes).
- No changes to the `adhoc-pay-link` (`/pay`) or `embed-widget` flows — this change is scoped to the `/{slug}` route only.
- Not attempting to detect deep-link success/failure more precisely than `MobileRedirect`'s existing fixed 3-second timer (that heuristic already exists and this change doesn't try to improve it).

## Decisions

**Move the mobile redirect from middleware to the page component.** `middleware.ts` drops its mobile branch entirely (it already computes `isMobile` for the embed check — that stays) and simply falls through to `NextResponse.next()` for mobile requests, same as it already does for desktop. `app/[slug]/page.tsx` gains the mobile branch: when `isMobile` (re-derived server-side from the request's user-agent header via `headers()`) and not embed, render `<MobileRedirect vpa businessName amount remarkCode />` instead of `<QrCard .../>`.
  - Alternative considered: keep the middleware redirect but change its target to a client page that then shows fallback. Rejected — that's an extra hop (redirect to a redirect) for no benefit, and the page component can render the exact same data it already fetches via `verifySignedPaymentToken`.
  - Alternative considered: detect mobile client-side inside a single universal page component (always render `QrCard`, have it internally decide whether to also kick off `MobileRedirect` behavior). Rejected — bigger diff, and `MobileRedirect` vs `QrCard` are already cleanly separate today; keep that separation and just pick the right one server-side, matching how `embedMode` is already decided.

**Keep `MobileRedirect` logic unchanged.** It already handles Android `intent://` vs iOS custom-scheme links, the 3s countdown, and the app-picker. No code changes to that component are anticipated; tasks.md should include verifying its current behavior still matches the modified spec once wired in (e.g., confirm the 3-second timer, confirm all four app buttons render).

**Mobile detection stays regex-based (`MOBILE_UA_REGEX`), server-side via request headers.** Same regex already used in `middleware.ts`, `lib/upi.ts`, and `MobileRedirect`'s isAndroid check — no new detection mechanism introduced.

## Risks / Trade-offs

- **[Risk]** Removing the middleware redirect changes response time characteristics slightly — mobile visitors now always get a full page render (Firestore fetch + React render) instead of a redirect that's sometimes near-instant if the deep link opens fast. → Mitigation: this is the same page render already happening today for desktop visitors; no new latency source, and the middleware's Firestore REST fetch is removed entirely (page's own `verifySignedPaymentToken` server call replaces it), so there's no double-fetch.
- **[Risk]** `app/[slug]/page.tsx` needs a reliable server-side mobile check; if the user-agent header parsing differs subtly from middleware's, behavior could diverge between the two. → Mitigation: reuse the exact same `MOBILE_UA_REGEX` export from `lib/upi.ts` in both places (already the case for middleware; page.tsx needs to import and apply it to `headers().get('user-agent')`).
- **[Trade-off]** The 3-second fixed fallback timer is a blunt heuristic (a slow phone or slow app cold-start could trigger the fallback UI even though the app was about to open). This already exists in `MobileRedirect` today and is out of scope to tune here.

## Migration Plan

No data migration. Deploy is a single atomic code change (no feature flag needed — behavior is strictly additive/corrective, not a breaking change to any external contract). Rollback is a plain revert if needed.
