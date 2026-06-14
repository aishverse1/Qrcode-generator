# UPAY — Open Questions
*Running list of decisions the product can't move forward without answering.*
*Add answers here as we figure them out. Don't delete questions — mark them resolved.*

---

## Q1 — Identity verification without touching funds

**The tension:** The most obvious way to verify a merchant owns their UPI ID is to ask them to send us ₹1. But that means UPAY receives funds — which is the one thing that could pull us into PA territory under RBI's framework.

**What we know:** PA classification requires receiving, pooling, AND transferring. A single ₹1 receipt that we immediately return could still be argued as "receiving." Better not to find out.

**Alternative we're considering:** Generate a random transaction reference (`tr=UPAY_9482103`). Ask the merchant to make any UPI payment to themselves (or anyone) with that exact reference in the note field. We monitor nothing — we just ask them to screenshot it and we read the `tr` from the screenshot, or we simply trust that they did it and verify lazily (complaints-based). Or: skip verification entirely at MVP and handle fraud reactively.

**What we need to decide:** Which of these is the MVP approach?
- [ ] No verification at MVP — trust the UPI ID, handle abuse reactively
- [ ] ₹1 to a merchant-controlled bank (merchant pays themselves, we never receive)
- [ ] Something else

**Blocking:** Onboarding flow (S2/S3 in PRODUCT.md)

---

## Q2 — Vanity URL or query string?

**The tension:** Every competitor uses query strings (`upi.pe/?pa=alice@hdfc`). Nobody has built `upay.in/alice`. That single difference is the clearest product gap in the competitive landscape.

**What we know:** Vanity URLs require: username uniqueness enforcement, a server (not just static hosting), collision handling, potentially a username reservation system. Query strings work on a CDN with zero backend.

**What we need to decide:**
- Do we want `upay.in/alice` (requires backend, usernames, DB)?
- Or `upay.in/?pa=alice@hdfc` (static, zero infrastructure, ships in a day)?
- If vanity: first-come-first-served, or can you claim any slug?
- If vanity: what's the namespace? Just `@okhdfcbank` stripped? Or free-text?

**Blocking:** URL architecture, infrastructure decision, backend vs. static hosting

---

## Q3 — What do we build first?

**The tension:** We have a clear legal green light, a clear competitive gap, and a clear persona. But we could start from a dozen different places.

**Minimum viable product candidate:** A working `upay.in/username` page that:
- Takes a pre-configured UPI ID (hardcoded or from a URL param)
- Shows merchant name + amount
- Renders per-app deep-link buttons (GPay / PhonePe / Paytm / BHIM separately — not one generic button like upi.pe does)
- Shows a real scannable QR on desktop
- Works on Android, iOS (per-app links), and desktop (QR fallback)

That's it. No dashboard. No ledger. No verification. No backend. Ship it, share it, see if people use it.

**What we need to decide:**
- Is this the right first thing to build?
- Or do we need the dashboard/account system first to have something people can "own"?
- What is the one thing that would make someone share this with another merchant?

**Blocking:** Nothing — this is the first code decision

---

## Q4 — iOS per-app links or generic QR?

**The tension:** `upi://` silently fails on iOS. No system-level UPI handler exists. To make UPI work on iOS we need to show per-app scheme links (`gpay://`, `phonepe://`, `paytm://`, `bhim://`). But this means we need to know which UPI apps the user has installed — which we can't detect from a browser without attempting each link.

**What we know:** Best approach is to show all 4–5 major app buttons and let the user tap the one they use. If the app isn't installed, the OS shows an error. Acceptable UX.

**Alternative:** Skip iOS deep links entirely and just show the QR on both desktop and iOS. Let Android have the one-tap experience.

**What we need to decide:**
- Show per-app buttons on iOS (best UX for those who have the app, ugly for those who don't)?
- Show QR only on iOS + desktop (consistent, simpler)?
- Show per-app buttons on Android only, QR on everything else?

**Blocking:** Checkout page design (S10/S11 in PRODUCT.md)

---

## Q5 — Data architecture: where does the merchant ledger live?

**The tension:** If the ledger lives on UPAY's servers, we have the same Karnataka problem we were trying to solve — a subpoena to us gives authorities years of merchant transaction data. If it lives in the browser (localStorage), merchants lose data when they clear their browser or switch devices.

**Options:**
- Server-side (convenient, betrays the privacy premise)
- Browser localStorage only (zero backend, fragile, no multi-device)
- Encrypted client-side, key never leaves device (hard, but defensible)
- Export-only: we never store anything, merchant downloads a CSV after each session
- Not our problem at MVP: no ledger, just links

**What we need to decide:** MVP stance on this. Probably "no ledger at MVP" is the right call.

**Blocking:** Backend architecture, privacy promise

---

## Q6 — Monetization

**What we've ruled out:**
- Percentage-based fee on transactions (requires PA license if we're in the flow; if we're not in the flow, we can't collect it)
- Fund holding / float

**What's on the table:**
- Subscription: free tier (X links/month), paid tier (unlimited + analytics + custom branding)
- One-time payment for vanity URL claim
- Freemium: free forever for individuals, paid for teams/API access
- Never monetize — grow, raise, figure it out later

**What we need to decide:** Not blocking MVP, but shapes the free tier limits

---

*Last updated: June 2026*
*Questions answered: 0 / 6*
