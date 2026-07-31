---
target: homepage + QrCard + MobileRedirect
total_score: 24
p0_count: 1
p1_count: 2
timestamp: 2026-07-31T10-37-15Z
slug: omponents-qrcard-tsx-components-mobileredirect-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Homepage success-screen QR (`page.tsx:536`) renders a blank box with no loading spinner, unlike `QrCard.tsx` |
| 2 | Match System / Real World | 2 | "NPCI-compliant UPI deep-link" jargon leaks into merchant-facing copy (`page.tsx:810`) |
| 3 | User Control and Freedom | 3 | Confirm→Edit back path and overlay close both work; solid |
| 4 | Consistency and Standards | 1 | `page.tsx` hardcodes radii/greens instead of `--radius-*` tokens and status colors `QrCard.tsx`/`MobileRedirect.tsx` already use correctly |
| 5 | Error Prevention | 3 | Real-time VPA validation + confirm step gate submission well |
| 6 | Recognition Rather Than Recall | 4 | Bank-handle quick-insert chips + filtered `@`-autocomplete with full keyboard nav — genuinely strong |
| 7 | Flexibility and Efficiency | 2 | Recent links are tracked but never used to pre-fill a repeat merchant's form |
| 8 | Aesthetic and Minimalist Design | 2 | Dev code-tabs panel bolted onto the "you're done!" success moment adds unwarranted density |
| 9 | Error Recovery | 3 | VPA error copy matches PRODUCT.md's own example; but generic "Something went wrong." fallback (`page.tsx:182`) violates the plain-specific-error rule |
| 10 | Help and Documentation | 1 | No VPA explainer for first-timers; "Privacy Policy" text is inert (`pointerEvents:none` container) |
| **Total** | | **24/40** | **Acceptable — solid interaction design, gaps cluster in consistency/docs/jargon** |

## Anti-Patterns Verdict

**LLM assessment**: Against the *literal* PRODUCT.md anti-references, this is disciplined — no purple-dominant palette, no banned typefaces (Manrope is a deliberate, non-default choice), true white body background not warm-cream, no bounce/elastic easing, no decorative glassmorphism. But holistically it composes as a generic 2024-2025 SaaS/fintech template shape: 3D-tilt hero mockup + floating notification chips + radial glow blob + infinite marquee footer + sticky-scroll step visuals + big-number stat band. It's the *combination*, not the individual choices, that reads as templated. Also: emoji used as UI icons (🔗🌐⚡⚙️, ✓/✕) sit right next to a proper hand-built SVG icon set in the same file — a classic quickly-assembled/AI-generated tell.

**Deterministic scan**: `detect.mjs` found 1 finding across the 3 target files — `app/page.tsx:707`, `layout-transition` (warning): `transition: width` animates a layout property directly, causing thrash/jank; should use `transform`/`grid-template-rows` instead. Pre-existing, not introduced by recent work. No false positives to flag; the LLM review caught everything else this pass touches (consistency, jargon, emoji icons) that the deterministic scanner isn't built to detect.

**Visual overlays**: Not available this run — no browser automation tooling (`chromium-cli`) is installed in this environment, so the live-injection overlay step was skipped entirely. This critique is code-level (styles/structure/copy/states), not a rendered-page visual pass.

## Overall Impression

The core interaction design is genuinely better than average — the VPA input (autocomplete, quick-insert chips, real-time validation) and the mobile deep-link fallback are both thoughtfully built for a payment-novice audience. What's dragging the score down isn't bad taste, it's **inconsistency and a misjudged completion moment**: the success screen hands every merchant a developer code panel immediately after their first success, `page.tsx`'s inline styles drift from the design tokens `QrCard.tsx` already uses correctly, and a couple of trust-critical details (a real Privacy Policy link, a plain "your money goes straight to your bank" statement) are missing exactly where a nervous first-time user needs them most. The single biggest opportunity: make the success screen's *first* accomplishment purely about "the link works, here it is, share it" — and move the code/embed stuff behind a deliberate, opt-in disclosure.

## What's Working

1. **VPA input UX** (`page.tsx:269-308`) — real-time check/✕ icon, quick-insert bank-suffix chips, filtered autocomplete with full `role=listbox`/`aria-expanded`/keyboard support. A well-built solution to the exact "what do I type after @" novice anxiety this audience has.
2. **MobileRedirect flow** — correctly branches Android `intent://` vs iOS `upi://`, times out gracefully into a full per-app fallback list, with a spinner + progress bar + live countdown that delivers real reassurance at the single highest-stakes moment in the product (the payer waiting to see if their bank app opens).
3. **Disciplined anti-reference avoidance** — Manrope instead of the banned typefaces, true white instead of cream, exponential ease-out everywhere, restrained blue rather than purple-dominant. Someone clearly checked this against PRODUCT.md's list.

## Priority Issues

**[P0] Dead "Privacy Policy" link**
- **Why it matters**: `page.tsx:719-730` wraps the footer row in `pointerEvents: 'none'` (line 724), so "Privacy Policy" is inert decorative text, not a real link. For a product whose #1 stated design principle is "trust is the product," a fake legal/trust link is a severe, disproportionate trust-eroder the moment a wary first-timer taps it and nothing happens.
- **Fix**: Make it a real `<a>`; scope `pointerEvents: none` to only the decorative dot separators, not the whole row.
- **Suggested command**: `/impeccable harden`

**[P1] Developer code panel shown to every merchant by default**
- **Why it matters**: `SuccessCodeTabs` (`page.tsx:334-439`) renders unconditionally in `SuccessCard` (lines 512-517) — raw JavaScript/HTML/"UPI Protocol" snippets appear immediately after a first-time, non-technical merchant creates their first link. Directly contradicts PRODUCT.md's "plain English everywhere" principle and dilutes the completion screen's emotional peak.
- **Fix**: Collapse behind an opt-in "Embed on your website (for developers)" disclosure, closed by default.
- **Suggested command**: `/impeccable distill`

**[P1] No loading indicator for the success-screen QR**
- **Why it matters**: `QrImage` (`page.tsx:536`) renders a bare empty `<div>` while the QR generates client-side, unlike `QrCard.tsx`'s spinner (lines 125-133). Right after "Your payment link is ready," a blank white box reads as broken, not loading.
- **Fix**: Reuse the spinner already built in `QrCard.tsx`.
- **Suggested command**: `/impeccable polish`

**[P2] Fragmented design-token discipline in the creation flow**
- **Why it matters**: `FormCard`/`SuccessCard` in `page.tsx` hardcode radii (11/12/14/22px) and at least three different greens (`#10B981`, `#059669`, plus the unused token `--status-settled-ink: #166534` sitting idle in `globals.css`) instead of the `--radius-sm/md/lg` and status tokens `QrCard.tsx`/`MobileRedirect.tsx` already consume correctly.
- **Fix**: Route `page.tsx`'s inline styles through the existing token set.
- **Suggested command**: `/impeccable audit`

**[P2] Jargon and generic error copy slip through**
- **Why it matters**: "NPCI-compliant UPI deep-link" (`page.tsx:810`) and the fallback error "Something went wrong." (`page.tsx:182`) both violate PRODUCT.md's own explicit rules — plain English, and specific (not generic) error messages.
- **Fix**: Reword the journey bullet to plain language already used elsewhere ("Works with GPay, PhonePe, Paytm and BHIM"); replace the network-error fallback with something actionable like "Couldn't create your link — check your connection and try again."
- **Suggested command**: `/impeccable clarify`

## Persona Red Flags

**Jordan (confused first-timer, payment-tech novice)**:
- Sees raw JS/HTML code immediately after creating a link (unconditional `SuccessCodeTabs`) — won't understand it, may worry something went wrong or that "this is for hackers."
- The confirm screen's only trust cue is "Commission: Zero — 0%" (`page.tsx:219`) — no plain statement like "your money goes straight to your bank"; Jordan has to infer safety exactly when least equipped to.
- Bank-handle chips (`@oksbi`, `@okhdfcbank`...) assume Jordan already knows their bank's UPI suffix — no "don't know your UPI ID? Check your GPay/PhonePe app" helper text exists anywhere.
- Invalid-VPA feedback is a thin 1.5px red border change plus a small ✕ glyph — easy to miss for someone unfamiliar with form-validation conventions.

**Sam (accessibility-dependent, screen reader / keyboard-only)**:
- Overlay close button `✕` (`page.tsx:686`) has no `aria-label` — a screen reader has only the glyph to announce.
- `--ink-4: #B3B3B3` on white is ~2.4:1 contrast — used for the "(optional)" label and footer/meta text — a clear WCAG AA failure (needs ≥4.5:1 for small text).
- `--ink-3: #787878` on white sits right at ~4.5:1, the bare minimum, used extensively at small sizes (11px uppercase field labels) — borderline, not comfortably compliant.
- Positive: `:focus-visible` (`globals.css:80-84`) is a real, solid, consistently-applied focus ring — this part is done right.

**Casey (distracted, thumb-only, interrupted mid-flow)**:
- No draft persistence — form state lives only in React `useState`; a backgrounded tab, refresh, or back-gesture wipes all typed input with zero warning.
- Overlay close button sits at `top:16, right:20` — the classic hardest-to-reach one-thumb zone, contradicting PRODUCT.md's own explicit "every workflow must be usable with one thumb" principle.
- MobileRedirect's fixed 3-second timeout has no page-visibility/app-launch detection — if the UPI app is slow to cold-start, the fallback UI can appear while the real app is still about to open.
- Quick-insert bank chips are small (`padding: 3px 10px`, 11px font) and tightly packed — under the ~44px touch-target guideline.

## Minor Observations

- `globals.css` duplicates the identical `@media (prefers-reduced-motion: reduce)` block verbatim twice (lines 139-149 and 848-858) — dead duplication.
- The infinite marquee footer adds no new information beyond repeating the hero's zero-commission claim, and is itself a recognizable "AI-template" flourish.
- `QrCard.tsx`'s quiet footer line "Powered by UPIDirectPay · Direct to bank · Zero commission" is a nice, low-key trust reinforcement worth preserving as-is.
- Stat band copy ("0%", "₹0", "<60s") is a good example of the plain, headline-forward zero-commission messaging PRODUCT.md asks for.

## Questions to Consider

1. What if `SuccessCodeTabs` were moved off the success screen entirely to a separate "embed on your site" area — how much would merchant time-to-share and confidence improve, given this audience has likely never seen a `<script>` tag?
2. What if the confirm and success screens each carried one plain sentence — "Money goes straight into your bank account, we never touch it" — would that single line do more for trust than the tilt/glow/floating-card hero system combined?
3. Given PRODUCT.md's own "usable with one thumb" principle, does the current top-right ✕ close button actually violate the product's own stated mobile-first rule in practice?
