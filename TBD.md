# TBD

Items intentionally left open, pending someone else's input before proceeding further.

## VPA URL-encoding — needs Aishwarya's review

`lib/upi.ts` and the deep-link builders now wrap `vpa` in `encodeURIComponent()` everywhere it's
interpolated into a `upi://` or `intent://` link (defense-in-depth — today's `isValidVpa` regex
happens to make this safe either way, but the encoding closes the gap if that regex is ever
loosened later). The mechanical fix has already been implemented and shipped in this batch.

What's still open: whether there's more to do here beyond the defensive encoding — e.g. whether
`isValidVpa`'s regex itself should be tightened/audited, or any other VPA-handling path needs a
closer look. Needs Aishwarya's sign-off before further changes in this area.

## Things to Explore

Not scheduled as changes yet — ideas to think through before they become proposals.

### Business name ↔ VPA identity match

Idea: when a merchant creates a link, check whether the `businessName` they entered matches the
account name actually registered against that VPA, and surface a mismatch warning (to the
merchant at creation time, and/or to the payer on the payment page) instead of trusting the
self-entered name outright.

Why it's interesting: it's a lighter-weight signal than full OTP/penny-drop verification (see
`payment-link-creation` capability's "No ownership verification" scenario) — it wouldn't prove
the creator *owns* the VPA, but it would catch typos, and make a phishing link that uses a VPA
with a clearly different registered name easier to spot.

Open questions before this becomes a proposal:
- Is there an actual API available to us for VPA→registered-name lookup (NPCI/PSP-provided
  "verify VPA" endpoints exist in the ecosystem, but access typically requires a PSP/bank
  tie-up — need to confirm what's actually reachable without one).
- If no such lookup is available, whether a weaker proxy (e.g. fuzzy string match against
  what the payer expects) is worth building at all, or just noise.
- UX: is a mismatch a hard block, a warning, or just informational?
- See the framing note below — this may end up lower priority than it first looked.

### Framing note: tipping/support model, not transaction model

Reframes how much verification effort (this item, and VPA ownership verification broadly) is
actually warranted. A platform like Razorpay verifies sellers because it's brokering a
*transaction* — money changes hands in exchange for a specific good/service/delivery promise, so
there's a real dispute-resolution and consumer-protection obligation on the platform. BuyMeACoffee
is the closer comparison for us: it's a *tipping/support* model — the payer already knows who
they intend to pay (a creator, a shop, a person) before they scan or click, there's no delivery
promise being brokered, and the platform isn't standing behind a transaction outcome. UPIDirectPay
sits in that same tipping/support category, not the marketplace/e-commerce one.

Practical effect: the disclaimer-based approach for VPA ownership (already settled, see the
legal-hedging research from this session) is proportionate to a tipping/support platform, not
under-built relative to what a Razorpay-style marketplace would need — full seller KYC would be
solving a problem this product doesn't actually have. Worth re-weighing the business-name↔VPA
match idea above against this framing before building it: it might be more effort than the actual
risk justifies for a tipping-style tool, versus something a transaction-brokering platform would
need.
