## MODIFIED Requirements

### Requirement: `MyPay.open()` SDK
The script SHALL expose `window.MyPay.open(opts)` for host pages to call directly, using a created link's slug. Raw `pa`/`pn`/`am` mode is removed along with the deleted `adhoc-pay-link` capability it depended on.

#### Scenario: Open by slug (desktop)
- **WHEN** `open({ slug })` is called on a non-mobile browser
- **THEN** the SDK injects a modal overlay with an iframe pointed at `{BASE}/{slug}?embed=true`

#### Scenario: Open by slug (mobile)
- **WHEN** `open({ slug })` is called on a mobile browser
- **THEN** the SDK navigates the top-level window to `{BASE}/{slug}` directly (no iframe/modal)

#### Scenario: Missing slug
- **WHEN** `open()` is called with no arguments, or without a `slug`
- **THEN** the SDK logs a console warning and does nothing — raw `pa`/`pn`/`am` invocation is no longer supported, since it depended on the now-deleted `/pay` route

#### Scenario: Modal dismissal
- **WHEN** the modal is open
- **THEN** it can be closed via the close button, clicking the overlay background, or pressing Escape

### Requirement: Legacy Auto-Widget Mode
If the embedding `<script>` tag carries `data-slug`/`data-token`, the SDK SHALL auto-render a floating "Pay with UPI" button. `data-pa` is no longer supported.

#### Scenario: Auto-render trigger
- **WHEN** the script tag has `data-slug` or `data-token` set
- **THEN** on DOM ready, a fixed-position button is injected (bottom-right) that calls `MyPay.open({ slug })` on click

#### Scenario: Pure SDK mode
- **WHEN** the script tag has neither `data-slug` nor `data-token`
- **THEN** no button is auto-rendered; only `window.MyPay` is exposed for manual use

### Requirement: Discoverability
The homepage SHALL document the real, working integration path for third-party embedding.

#### Scenario: Homepage snippet documents the real SDK
- **WHEN** a visitor views the homepage's `CodeSnippetDemo` component
- **THEN** it shows how to use the `/{slug}` shareable link and the `MyPay.open({ slug })` embed SDK from `/api/embed` — not the stale `/qr/{token}` and `/pay/{token}` URL examples, which are removed

#### Scenario: No dedicated integrator documentation page (unchanged)
- **WHEN** an external integrator looks for exhaustive SDK documentation (all `MyPay.open()` options, legacy `data-*` attributes)
- **THEN** none exists yet beyond the corrected homepage snippet and the inline code comments in `app/api/embed/route.ts` — a full `/developers` page remains out of scope for this change
