## Purpose

Lets a merchant find a payment link they created earlier without an account or server-side storage, by keeping a client-side (localStorage) list of recently-created links on the homepage.

## ADDED Requirements

### Requirement: Record Created Links Locally
After a successful `/api/merchant/create` call, the homepage SHALL store the link's details in the browser's `localStorage`.

#### Scenario: Successful creation is recorded
- **WHEN** `/api/merchant/create` responds `200` with `{ token, businessName, amount, ... }`
- **THEN** the homepage appends `{ token, businessName, amount, createdAt }` to a `localStorage`-backed list

#### Scenario: No server-side persistence
- **WHEN** a link is recorded
- **THEN** nothing is written to Firestore beyond what `/api/merchant/create` already writes — this history exists only in the creating browser's `localStorage`, is not synced across devices, and is lost if the user clears site data

### Requirement: Recent Links Display
The homepage SHALL render a "Recent links" section listing locally-recorded links.

#### Scenario: List rendered
- **WHEN** the homepage loads and the local list is non-empty
- **THEN** it renders each entry with the business name, amount (or "Open amount"), and a link to `/{token}`

#### Scenario: Empty state
- **WHEN** the local list is empty (first visit, or cleared storage)
- **THEN** the "Recent links" section is hidden or shows an empty-state message instead of an empty list
