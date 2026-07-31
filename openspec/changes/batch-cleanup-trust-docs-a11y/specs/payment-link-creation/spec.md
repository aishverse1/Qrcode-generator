## MODIFIED Requirements

### Requirement: Create Payment Link
`POST /api/merchant/create` SHALL accept `{ vpa, businessName, amount }` and, if valid, create a persisted payment record and return a shareable slug.

#### Scenario: Valid request
- **WHEN** a caller POSTs a well-formed `vpa` and non-empty `businessName`
- **THEN** the system generates an 8-character `nanoid` token, writes `{ vpa, businessName, amount, remarkCode: 'UPIDirectPay', createdAt }` to the Firestore `payments/{token}` document
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
- **THEN** the system creates the link regardless of whether the caller controls that VPA — there is no OTP, penny-drop, or auth check tying a caller identity to the VPA (tracked separately, pending legal-hedging research)

### Requirement: Token Storage and Lookup
Payment link data SHALL be stored and retrieved from a single Firestore collection, `payments`, keyed by the token, with collision-safe writes.

#### Scenario: Server-side create
- **WHEN** `createPaymentToken` is called (server-only, via `firebase-admin`)
- **THEN** it generates `nanoid(8)` and writes the document using a create-only operation that fails if a document already exists at that id

#### Scenario: Token collision retries
- **WHEN** the generated token already exists as a Firestore document
- **THEN** the system generates a new token and retries, up to 3 attempts total, instead of silently overwriting the existing link's data

#### Scenario: Server-side verify
- **WHEN** `verifyPaymentToken(token)` is called from a page/server component
- **THEN** it reads `payments/{token}` via the Firebase Admin SDK and returns `null` if the document does not exist

#### Scenario: Token naming reflects reality
- **WHEN** the functions are named `createPaymentToken` / `verifyPaymentToken`
- **THEN** no signing, HMAC, or secret-based verification is implied or occurs — the token is simply an unguessable Firestore document id; anyone who can read/guess a valid token can read its data

### Requirement: Remark Code
Every payment record SHALL store a `remarkCode` used as the UPI transaction note (`tn` param). The product SHALL NOT claim per-link reconciliation capability it does not have.

#### Scenario: Remark is constant, not per-link
- **WHEN** a payment link is created via `/api/merchant/create`
- **THEN** `remarkCode` is always the literal string `'UPIDirectPay'`

#### Scenario: No reconciliation claim
- **WHEN** any product copy (homepage or elsewhere) describes the remark code
- **THEN** it does not claim the remark is trackable, per-link, or usable for reconciliation — no such claim exists anywhere in the product, and the unused per-link generator function is removed rather than left as dead code implying an unshipped feature
