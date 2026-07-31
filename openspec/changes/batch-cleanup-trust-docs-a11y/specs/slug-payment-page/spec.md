## MODIFIED Requirements

### Requirement: QR Card Rendering
`components/QrCard.tsx` SHALL render a client-side QR code encoding the UPI deep link, plus buttons to open specific UPI apps or copy the link. It SHALL NOT display trust signals implying verification that has not occurred.

#### Scenario: QR generation
- **WHEN** the component mounts with `vpa`, `businessName`, `amount`, `remarkCode`
- **THEN** it builds the deep link via `buildUpiLink(...)` and renders it as a data-URL QR code (240x240, black on white) using the `qrcode` package client-side

#### Scenario: Per-app buttons (non-embed only)
- **WHEN** `embedMode` is false
- **THEN** the card shows GPay/PhonePe/Paytm/BHIM buttons, each building an app-specific `intent://` (Android) or custom-scheme (`gpay://`, `phonepe://`, `paytmmp://`) URI via a single shared builder also used by `MobileRedirect`

#### Scenario: Copy link
- **WHEN** the user clicks "Copy Payment Link"
- **THEN** the current page URL (via `getCleanOrigin() + pathname`) is copied to the clipboard, with a 2-second "Copied!" confirmation

#### Scenario: No payment-status feedback
- **WHEN** the user completes or abandons the UPI app flow
- **THEN** the page has no mechanism to detect success/failure — there is no polling, webhook, or callback; the card never changes state after the app opens

#### Scenario: No false trust badges
- **WHEN** the card renders
- **THEN** it does not display "Secured by NPCI" or "✓ Verified" badges, since no verification of the merchant or VPA has occurred

#### Scenario: Real disclaimer shown
- **WHEN** the card (or the surrounding page) renders
- **THEN** it displays the actual "not affiliated with NPCI/UPI" disclaimer, instead of that disclaimer sitting in an unrendered component

## ADDED Requirements

### Requirement: Deep-Link VPA Encoding
Every place that interpolates a `vpa` into a `upi://` or `intent://` link string SHALL URL-encode it, not just rely on `isValidVpa`'s charset happening to be safe.

#### Scenario: VPA is encoded in all deep-link builders
- **WHEN** any UPI or app-specific intent link is constructed from a `vpa` value
- **THEN** the `vpa` is passed through `encodeURIComponent()` (or equivalent) before interpolation, consistent with how `businessName` and `remarkCode` are already encoded
