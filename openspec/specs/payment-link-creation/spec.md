# Payment Link Creation Specification

## Purpose
Lets a merchant turn a UPI VPA + business name (+ optional fixed amount) into a short, shareable slug-based payment link, persisted server-side in Firestore.

## Requirements

### Requirement: Create Payment Link
`POST /api/merchant/create` SHALL accept `{ vpa, businessName, amount }` and, if valid, create a persisted payment record and return a shareable slug.

#### Scenario: Valid request
- **WHEN** a caller POSTs a well-formed `vpa` and non-empty `businessName`
- **THEN** the system generates a 6-character `nanoid` token, writes `{ vpa, businessName, amount, remarkCode: 'UPIDirectPay', createdAt }` to the Firestore `payments/{token}` document
- **AND** responds `200` with `{ success: true, token, payUrl: "/{token}", vpa, businessName, amount }`

#### Scenario: Missing or invalid VPA
- **WHEN** `vpa` is absent, not a string, or fails the pattern `^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$`
- **THEN** the system responds `400` with an error message and does not write to Firestore

#### Scenario: Missing business name
- **WHEN** `businessName` is absent, not a string, or empty after trimming
- **THEN** the system responds `400` with an error message

#### Scenario: Invalid amount
- **WHEN** `amount` is provided but is not a positive number after `parseFloat`
- **THEN** the system responds `400` with an error message

#### Scenario: No ownership verification
- **WHEN** any syntactically valid VPA is submitted
- **THEN** the system creates the link regardless of whether the caller controls that VPA — there is no OTP, penny-drop, or auth check tying a caller identity to the VPA

### Requirement: Token Storage and Lookup
Payment link data SHALL be stored and retrieved from a single Firestore collection, `payments`, keyed by the token.

#### Scenario: Server-side create
- **WHEN** `createSignedPaymentToken` is called (server-only, via `firebase-admin`)
- **THEN** it generates `nanoid(6)` and writes the document without checking for an existing token at that id (no collision retry)

#### Scenario: Server-side verify
- **WHEN** `verifySignedPaymentToken(token)` is called from a page/server component
- **THEN** it reads `payments/{token}` via the Firebase Admin SDK and returns `null` if the document does not exist

#### Scenario: Token naming is historical, not cryptographic
- **WHEN** the functions are named `createSignedPaymentToken` / `verifySignedPaymentToken`
- **THEN** no signing, HMAC, or `TOKEN_SECRET`-based verification actually occurs — the "signature" is only the fact that the token was written to Firestore by the create endpoint; anyone who can read/guess a valid token can read its data

### Requirement: Remark Code
Every payment record SHALL store a `remarkCode` used as the UPI transaction note (`tn` param).

#### Scenario: Remark is constant, not per-link
- **WHEN** a payment link is created via `/api/merchant/create`
- **THEN** `remarkCode` is always the literal string `'UPIDirectPay'` — the per-link code generator (`generateRemarkCode()`, format `UPAY-XXXX`) exists in `lib/upi.ts` but is never invoked by the create route
