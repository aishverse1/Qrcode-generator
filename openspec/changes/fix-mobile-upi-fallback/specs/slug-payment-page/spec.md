## MODIFIED Requirements

### Requirement: Mobile Deep-Link Redirect
On mobile user agents, the system SHALL attempt the `upi://` deep link client-side and fall back to a visible in-app-picker UI if no app handles it within a short window, instead of performing an unconditional server-side redirect with no fallback.

#### Scenario: Mobile visitor with a valid token
- **WHEN** `middleware.ts` detects a mobile user agent requesting `/{slug}`, the slug is not reserved, and `embed=true` is not set
- **THEN** the middleware passes the request through (`NextResponse.next()`) instead of redirecting server-side
- **AND** `app/[slug]/page.tsx` renders `MobileRedirect` with the fetched payment data

#### Scenario: Deep link opens successfully
- **WHEN** `MobileRedirect` mounts and immediately navigates to the `upi://` (or Android `intent://`) link
- **THEN** the browser hands off to the installed UPI app and the countdown UI is abandoned along with the page (no visible change needed, since the tab is backgrounded)

#### Scenario: No UPI app handles the link
- **WHEN** 3 seconds pass after the deep-link attempt with no app taking over (the page is still visible)
- **THEN** the UI transitions from "launching" (spinner + countdown) to a "fallback" state listing GPay/PhonePe/Paytm/BHIM as individually tappable options, plus a generic "Open in Any UPI App" button
- **AND** the merchant name, VPA, and amount remain visible throughout both states

#### Scenario: Mobile visitor with unknown token
- **WHEN** the token is not found in Firestore
- **THEN** the middleware calls `NextResponse.next()`, allowing `app/[slug]/page.tsx` to call `notFound()` — unchanged from current behavior

#### Scenario: Desktop or embed request is unaffected
- **WHEN** the user agent is not mobile, or the query string contains `embed=true`
- **THEN** the middleware passes the request through and `[slug]/page.tsx` renders `QrCard` as before — unchanged from current behavior
