# UPAY — Product Brief
*Version 0.1 · Last updated June 2026 · Status: Pre-build iteration*

---

## The One-Line

A payment identity for solo operators and small merchants in India — zero fees, zero middlemen, zero platform owning your data.

---

## Why This Exists

UPI made sending money free. It did not make *collecting* money easy.

A merchant today has two real options: accept a static QR from their bank (free, but dumb — no records, no links, no way to specify an amount) or sign up for a payment gateway like Razorpay (smart, but takes 2% of every transaction and holds four years of your financial history on their servers).

The Karnataka GST event of July 2025 made this real: state tax authorities subpoenaed transaction data directly from PhonePe, Google Pay, and Paytm — four years of records — and issued notices to 14,000 small traders. Hundreds of merchants physically removed their QR codes and put up "Cash Only" signs. They didn't go back to cash because cash is better. They went back because **they don't own their digital records, and they felt that.**

UPAY exists for the merchant who wants digital payments but refuses to hand their financial history to a platform that can be forced to give it away.

---

## Who This Is For

### Persona 1 — The WhatsApp Seller
Runs a business entirely over Instagram DMs and WhatsApp. Sells handmade products, food, clothing, plants, art. Takes orders manually, shares UPI ID in chat, mentally tracks who paid. Volume: 30–200 orders/month, ₹200–₹3,000 per order. No GST registration. No business bank account. Possibly uses a personal account with a family member's name on it.

**What they feel:** Every payment is a small act of trust with a stranger. They have no proof of receipt, no way to send a "please pay exactly this amount" request, and no record that isn't a scrolled-up WhatsApp thread.

### Persona 2 — The Independent Service Provider
Tutor, graphic designer, photographer, freelance developer, event planner. Invoices over WhatsApp or email. Gets paid via UPI, sometimes in parts, sometimes late, sometimes wrong amounts. Monthly volume ₹20,000–₹2L. May have GST, may not.

**What they feel:** Reconciliation is a monthly nightmare. Clients pay ₹4,999 when they owe ₹5,000. They don't include any note. Three clients pay on the same day and the bank statement is useless. A notebook is their ledger.

### Persona 3 — The Micro-D2C Brand
2–5 person team selling on Instagram/WhatsApp, maybe a basic Linktree page. Not yet on Shopify or a marketplace. Wants to look professional when collecting payment but Razorpay integration requires a developer, GST, and company bank account. Volume: ₹50,000–₹5L/month.

**What they feel:** They've outgrown sharing a UPI ID in a DM but haven't crossed the threshold where a proper payment gateway makes sense. There is nothing in between.

---

## Who This Is NOT For

Being explicit about non-users is as important as defining users. UPAY will fail if it tries to serve these segments.

**Large e-commerce businesses.** If you're on Shopify, WooCommerce, or doing ₹1Cr+/month, you need refunds, disputes, chargebacks, GST invoicing, GSTIN reconciliation, and payment routing across multiple accounts. Razorpay and Cashfree exist for you. UPAY is not competing here.

**Businesses that need to accept international payments.** UPI is India-only. Full stop.

**Businesses that need a payment gateway API.** If your developer is integrating payments into your app's checkout flow, they need webhooks, SDKs, server-to-server confirmation, and a PA-licensed intermediary. That's not UPAY.

**Businesses that need escrow or held funds.** Platforms where the payer pays the platform and the platform releases to the seller (Swiggy model, Uber model) require fund intermediation. UPAY cannot and should not do this.

**Merchants who want to avoid all digital records.** Some merchants went back to cash precisely because they don't want any trail — legitimate or not. UPAY still creates a merchant-side ledger. If a merchant wants zero record, even in their own hands, we aren't their product.

**Customers.** UPAY is a tool for the person collecting money, not the person paying. The paying customer never needs an account, never downloads anything, never knows UPAY exists. This is not a consumer product.

---

## What This App Is Not

These are firm exclusions, not deferred features. They define the product boundary.

**Not a payment gateway.** Money never passes through UPAY's infrastructure. UPAY does not hold funds, does not act as an intermediary, does not settle to merchants. It generates the instruction for the customer's UPI app to pay the merchant's bank directly.

**Not a competitor to UPI apps.** We do not have a wallet. We do not process the payment. We are not PhonePe or GPay.

**Not a bookkeeping or accounting tool.** We are not Zoho Books, QuickBooks, or a GST filing tool. We might show the merchant what came in. We are not responsible for telling them what to do with it.

**Not a marketplace.** UPAY is not a platform where merchants get discovered by customers. There is no storefront, no browse feature, no merchant directory.

**Not a subscription business (at MVP).** The product should work without asking a merchant for a credit card or a monthly commitment. Monetization, if any, comes later.

**Not a tool for regulated financial services.** UPAY cannot be used to collect loan repayments, insurance premiums, or any payment type that falls under RBI's regulated categories for payment aggregators.

---

## The Core Needs
*These are problems, not solutions. We should be able to brainstorm 3 different ways to solve each one.*

---

### Need 1: Prove that the merchant owns what they claim to own

Before any customer ever sees a payment page, we need to be confident that the person who set up the UPAY account actually controls the bank account money is going to. If we skip this, someone can set up an UPAY account using someone else's UPI ID and collect money on their behalf — the merchant's brand, someone else's bank account.

The problem: Formal KYC (Aadhaar, PAN, cancelled cheque) kills adoption for the exact segment we're building for. But zero verification enables fraud.

What does success look like? A merchant who legitimately owns their UPI ID can onboard in under 5 minutes. A fraudster trying to use someone else's UPI ID is stopped.

---

### Need 2: The customer must be able to pay the exact right amount to the exact right person, without any manual effort

When a merchant sends "pay me on WhatsApp", the customer has to: remember the amount, find the merchant's UPI ID, type the amount, type a note, hit pay. Every step is a drop-off. Wrong amounts arrive. Wrong people get paid. No notes get added. The merchant can't tell one payment from another.

The problem: UPI as a protocol supports pre-filling all these fields. But the merchant has no way to generate that pre-filled instruction as a shareable link without technical knowledge, and no existing tool makes this easy.

What does success look like? The merchant specifies an amount and a label. The customer clicks a link and sees a pre-filled payment request. On mobile, their UPI app opens directly with everything filled in. On desktop, they see a QR and can scan it with any UPI app. No manual entry. No room for error.

---

### Need 3: The merchant must be able to match each payment to a specific order or customer

UPI deposits appear in a bank account as a credit. The sender's name and UPI ID are sometimes visible, sometimes not. The amount is there. A note is sometimes there, sometimes missing. When five customers all pay ₹500 on a Tuesday, the merchant's bank statement is useless for reconciliation.

The problem: Because UPAY never sits in the payment flow (money goes directly to the merchant's bank), we cannot intercept or annotate the transaction at the network level. We cannot confirm from our side that a specific payment has arrived.

What does success look like? The merchant's ledger shows a list of payment requests they created. Each one can be matched to an incoming payment — either automatically (if possible) or manually (with minimum effort). The merchant can say "this ₹500 from Tuesday was Priya's order for the plant" and have a permanent record of it.

---

### Need 4: The merchant's records should be theirs, not ours

The Karnataka enforcement event is the proof case. Four years of UPI data from PhonePe, Google Pay, and Paytm were handed to state tax authorities because those platforms held the data. The merchant had no say.

The problem: Every digital payment tool that creates a transaction ledger automatically becomes a surveillance database. The merchant never explicitly agreed that their sales history could be subpoenaed from a third-party platform.

What does success look like? If a government authority comes to UPAY with a subpoena, there is as little data as possible to hand over. The merchant's records should be accessible to the merchant and unreachable to anyone else — including us — to the greatest extent technically possible. This is an architectural decision, not a feature.

---

### Need 5: The checkout experience must feel legitimate to a customer who has never heard of UPAY

A customer receives a link. They don't know what UPAY is. They need to feel confident that clicking it and scanning the QR will not result in a scam. The merchant's credibility is transferred through the checkout page.

The problem: We cannot verify the merchant's legal identity. We cannot guarantee the merchant is who they say they are. But we still need the customer to trust the experience enough to complete a payment.

What does success look like? The customer sees the merchant's name, a clear amount, and a recognizable payment flow. Nothing on the page looks like a phishing attempt. The page loads fast on a slow mobile connection. The customer completes the payment and gets something that feels like a receipt.

---

### Need 6: Onboarding must take less than 5 minutes with no documents

The Razorpay API key application process requires: business type, legal name, PAN, GSTIN, bank account + IFSC, cancelled cheque, website URL. Most of our target users fail at step one — they don't have a registered business.

The problem: To make payments trustworthy, we need *some* signal of legitimacy from the merchant. But asking for documents loses the entire target segment.

What does success look like? A merchant with nothing more than a UPI ID and a mobile phone can set up UPAY and start sharing a payment link in under 5 minutes.

---

### Need 7: The payment link must work everywhere the merchant operates

Our target merchants are on Instagram, WhatsApp, Telegram, email, a basic website, printed flyers, and physical shops. A solution that only works in one channel is a solution they won't use.

The problem: Different surfaces need different formats. A WhatsApp message needs a URL. A physical shop needs a printable QR. An Instagram bio needs a short link. An invoice PDF needs something that looks professional.

What does success look like? One merchant account generates one payment identity that can be represented as a URL, a QR code, and an embeddable link — and all of them point to the same underlying payment endpoint.

---

### Need 8: The tool must be free enough to try and valuable enough to stay

SMEPay charges ₹3–₹5 per transaction. That's 0.06–0.1% at ₹5,000 per transaction — much better than 2%, but not zero. Our target user doesn't trust a new product enough to put a credit card down or pay per transaction without seeing value first.

The problem: If we charge nothing ever, we can't sustain the product. If we charge upfront, we lose the user before they experience value.

What does success look like? The merchant's first 30 days (or first 50 payments) cost them nothing. At the point where UPAY has demonstrably saved them time or money, a fee structure is introduceable. The free tier is generous enough that a true small merchant might never need to pay.

---

## The Flow

### Merchant Flow (One-Time Setup)

1. Merchant lands on UPAY — has heard about it from another merchant, a WhatsApp forward, or discovered it independently
2. Enters their UPI ID. We need to confirm they own it. *(How — see Need 1)*
3. Adds their name or business name, optionally a profile photo or logo
4. Gets their payment identity: a URL, a QR, and a short link
5. Optionally: connects a way for us to auto-detect incoming payments *(How — see Need 3)*
6. Shares the link. Done.

### Merchant Flow (Per Payment)

1. Creates a payment request — specifies amount, optionally a label ("March tuition", "Logo design deposit")
2. Gets a unique link/QR for that specific amount and label
3. Shares it with the customer
4. Waits for payment to arrive in their bank
5. Marks it as received in their ledger (manually or auto, depending on setup)
6. Has a permanent record of that transaction

### Customer Flow (Every Time)

1. Receives a link from a merchant they're already doing business with
2. Opens the link on mobile or desktop
3. Sees: merchant name, amount, what it's for
4. On mobile: one tap opens their UPI app (GPay, PhonePe, Paytm, BHIM — whichever they have) with everything pre-filled
5. On desktop: sees a QR, scans it with their phone's UPI app
6. Pays via their UPI app's standard PIN flow — UPAY never touches this step
7. Optionally: sees a receipt/confirmation page

### What We Are Not Involved In

The moment the customer's UPI app opens, UPAY is done. The transaction happens on NPCI's infrastructure, between two bank accounts. We have no visibility into whether the payment succeeded, failed, or was abandoned — unless the merchant has set up a method to tell us.

---

## Tentative Screens

*These are the surfaces we need, not the designs. Sequence and grouping may change.*

### Merchant Side

**S1 — Landing / Marketing Page**
Explains what UPAY does and who it's for. Primary CTA: "Set up your payment link." Must answer "why not just use GPay" in 10 words or less.

**S2 — Onboarding: UPI ID Entry**
Single field. Merchant types their UPI ID. We need to verify ownership. Minimal copy, maximum confidence.

**S3 — Onboarding: Ownership Verification**
Whatever mechanism we decide on for Need 1. This screen is the biggest open design question in the product.

**S4 — Onboarding: Profile Setup**
Name, business name, optional tagline or category. This is what the customer will see on the checkout page. Should feel like setting up a professional identity, not filling out a form.

**S5 — Payment Identity Dashboard (Home)**
The merchant's home screen. Shows: their permanent payment link, their QR code, and a summary of recent activity. Quick action: "Create a payment request."

**S6 — Create Payment Request**
Merchant specifies: amount (fixed or customer-specified), label/description, optional expiry. Gets a unique link for this specific request.

**S7 — Transaction Ledger**
List of payment requests created. Each row: label, amount, date created, status (pending / received / expired). Merchant can mark as received manually. Should be sortable and filterable.

**S8 — Settings / Profile**
Update UPI ID (requires re-verification), business name, notification preferences, data export.

**S9 — Gmail / Notification Link (Optional)**
If the merchant wants auto-detection of incoming payments, they connect something here. This is an optional upgrade, not required for the core product.

### Customer Side

**S10 — Checkout Page (Mobile)**
Sees: merchant name and logo/avatar, amount, what it's for. Single primary CTA that opens the customer's UPI app. Must load in under 2 seconds on 4G. Must work without JavaScript if possible.

**S11 — Checkout Page (Desktop)**
Same information as S10, but instead of a "pay now" button: a QR code the customer scans with their phone. Should regenerate periodically. Should never expose the merchant's raw UPI ID in the page source.

**S12 — Post-Payment Page (Customer)**
After the customer marks "I have paid" or after a timeout: a lightweight receipt. Shows what they paid for, when, how much. No UPAY account required to view this.

---

## Open Questions
*Things the product cannot move forward without answering. Not features — decisions.*

**Legal:** Does UPAY's architecture (no fund holding, pure UPI deep-link generation) require RBI Payment Aggregator registration? This needs a direct answer from a fintech lawyer before launch, not an assumption.

**Identity:** How do we prove a merchant owns their UPI ID without documents and without a paid API call? Whatever we decide here shapes onboarding entirely.

**Settlement confirmation:** Without being the payment intermediary, how do we confirm a payment happened? Three possible directions exist (email parsing, customer self-report, merchant manual mark). We haven't decided which to optimize for and which to deprioritize.

**Data architecture:** Where does the merchant's ledger actually live? If it lives on UPAY's servers, we have a Karnataka problem of our own. If it lives only in the merchant's browser, we have a durability problem. This decision has product and legal consequences.

**Distribution:** What is the exact first use case that causes a merchant to share an UPAY link? And when the customer receives it, what causes them to ask their own merchant friends "how do I get one?" We have a hypothesis (WhatsApp invoicing) but no confirmation.

**Monetization:** What is the fee structure once we have traction? Options include: flat fee per transaction, monthly subscription, free forever with a pro tier, or funded via float (holding pending payments briefly). We've ruled out percentage-based fees and fund holding — the rest is open.

---

## What We Know With Confidence

1. The fee pain is real — ₹20–₹24 per ₹1,000 at Razorpay is documented and verified
2. The trust pain is real — Karnataka's enforcement event is a behavioral signal, not just a news story
3. The product gap is real — nothing between "bank QR (dumb, free)" and "Razorpay (smart, expensive)" exists for this segment
4. SMEPay validates the niche but does not own it — our differentiation must be on data sovereignty and UX, not price
5. The customer-side experience requires zero UPAY account — this is a constraint, not a feature, and it must stay

---

*This document is a working brief, not a spec. Every section should be challenged. Especially the ones that feel obvious.*
