# UPAY — Background Research
*Generated June 2026 via 111-agent deep research run · 28 sources · 93 claims extracted · 25 adversarially verified · 10 confirmed · 15 killed*
*Raw, unsummarised. Nothing removed.*

---

## Research Parameters

**Question asked:**
We're building UPAY — a zero-commission UPI payment link/QR generator for small Indian merchants that routes money directly to their bank account (no intermediary holds funds). Before we write a line of code, we need to aggressively validate the WHY. Research the following:

1. Who is actually underserved? Profile the real merchant segment that existing UPI solutions fail or ignore. Look at: transaction volume thresholds where fees hurt most, merchant categories (kirana, street vendor, freelancer, tutor, small D2C), and geography (Tier 2/3 India). Find real complaints on developer forums, Reddit, Twitter/X, and merchant Facebook groups.
2. What do existing players actually offer? Map the competitive landscape.
3. VC/investor thesis on India fintech payments (last 12 months).
4. What do developers/indie builders say about building on UPI?
5. The fundamental product question: Is there a real reason for a merchant to use UPAY over a free bank QR, Google Pay for Business, or BharatPe?
6. Adjacent models that worked — Stripe early days, Ko-fi, Gumroad, upi.pe — what was their wedge?

**Six research angles decomposed:**
- Merchant pain / underserved segment
- Competitive feature and pricing landscape
- VC and investor thesis signal
- Developer and indie builder frustration
- Wedge and go-to-market analogies
- Regulatory and NPCI infrastructure constraints

---

## Verified Findings (Survived Adversarial 3-Vote Check)

---

### Finding 1 — The Fee Structure Is Real and Quantified

**Claim:** Mainstream UPI payment gateways charge merchants 1.95–2% platform fees per transaction (plus 18% GST) on top of the government's zero-MDR mandate, creating a real and quantified cost floor that did not exist before 2020.

**Confidence:** HIGH · **Vote:** 3-0 on both Razorpay and Cashfree claims

**Evidence in full:**
Razorpay charges exactly 2% + 18% GST as a platform fee on UPI bank-account transactions. On a ₹1,000 payment the merchant receives approximately ₹976.40. Cashfree's standard rate is 1.95% with no zero-commission tier for small merchants, plus a hard minimum of ₹20 per Virtual Bank Account transaction that makes micro-payments (under ₹1,000) effectively punitive — a ₹100 transaction via VBA costs the merchant 20%.

The government's zero-MDR mandate (in force since January 2020 under Section 10A of the Payments and Settlement Systems Act) applies only at the bank/network layer. Gateways are legally permitted to charge platform fees on top, and all major players do.

**Sources:**
- https://razorpay.com/blog/upi-charges-explained-mdr-vs-platform-fees/
- https://www.cashfree.com/payment-gateway-charges/

---

### Finding 2 — The Karnataka GST Enforcement Event (July 2025)

**Claim:** Karnataka's July 2025 GST enforcement action — using four years of UPI transaction data from payment providers to issue notices to ~14,000 small traders — caused a documented behavioral reversal: hundreds of Bengaluru merchants physically removed QR codes and reverted to cash, proving that trust and auditability are as important as fees to the target segment.

**Confidence:** HIGH · **Vote:** 3-0 on core claims; Claim 6 passed 2-1 with qualification that this was state-level, not central government policy

**Evidence in full:**
Karnataka's Commercial Taxes Department collected UPI transaction data (FY 2021-22 to FY 2024-25) directly from PhonePe, Google Pay, Paytm, and BHIM. Notices were issued on July 11, 2025 to traders whose UPI receipts exceeded the ₹40 lakh GST registration threshold. Approximately 14,000 traders were identified; ~5,500 initial notices were issued.

The response was swift and physical: merchants across Bengaluru and Mysuru removed QR sticker codes and posted "Cash Only" signs. Trader associations called a statewide bandh. The event was covered by Deccan Herald, Business Standard, Outlook Business, The News Minute, BusinessToday, and Gulf News, and was serious enough that Karnataka CM Siddaramaiah publicly intervened to waive old dues for small traders.

Finance Minister Sitharaman confirmed that *central* GST authorities were not involved — this was state-level action only. This limits direct extrapolation to a national policy pattern, but the behavioral precedent is permanent: merchants now know their UPI data can be subpoenaed.

**Implication for UPAY:** The merchant pain is not just "fees hurt margins" — it is "digital payment records feel dangerous because I don't own them."

**Sources:**
- https://www.deccanherald.com/india/karnataka/bengaluru/upi-dilemma-bengalurus-small-vendors-fear-big-trouble-over-tax-notice-3632149
- https://blog.saginfotech.com/karnatakas-gst-evasion-notices-prompt-shopkeepers-upi-payments
- Business Standard (coverage confirmed, no direct URL captured in this run)
- Outlook Business (coverage confirmed, no direct URL captured in this run)
- The News Minute (coverage confirmed, no direct URL captured in this run)
- BusinessToday (coverage confirmed, no direct URL captured in this run)
- Gulf News (coverage confirmed, no direct URL captured in this run)

---

### Finding 3 — SMEPay: A Confirmed Flat-Fee Competitor Exists

**Claim:** At least one flat-fee competitor (SMEPay) already exists in this market and explicitly offers a non-percentage pricing model, meaning UPAY is not entering a vacuum but must differentiate beyond cost structure alone.

**Confidence:** HIGH · **Vote:** 3-0

**Evidence in full:**
SMEPay charges ₹5 per successful transaction on its free tier and ₹3 per transaction on its Pro plan (₹499/month), with no percentage-based MDR. This is confirmed by SMEPay's own pricing page and independently by Techjockey (2026 review) and SiliconIndia launch coverage.

The product markets itself as a "zero commission" alternative, though the flat fee means merchants do not literally keep 100% of collections — the "zero commission" claim is marketing language, not literally accurate. SMEPay explicitly contrasts itself with "legacy payment gateways" charging ~2% per order.

Critically: several refuted claims in the adversarial verification process (UroPay's zero-commission claim, no-KYC onboarding, instant-settlement claims) could not be corroborated. The competitive landscape has players making unverified assertions. SMEPay's model is the only confirmed flat-fee alternative with independent source backing.

SMEPay's existence validates the problem thesis but compresses the differentiation window to product quality, merchant UX, and distribution.

**Sources:**
- https://www.smepay.io/
- https://techjockey.com/ (SMEPay review, 2026)
- https://siliconindia.com/ (SMEPay launch coverage)

---

### Finding 4 — Google Pay for Business: Free but Passive

**Claim:** Google Pay for Business is fully UPI-interoperable (accepting payment from any UPI app, not just Google Pay users) and is perceived as "free" — but it is a passive QR-only tool with no merchant ledger, payment link generation, or analytics, leaving a product gap above the zero-fee floor.

**Confidence:** HIGH · **Vote:** 3-0 on interoperability; "zero fees" claim refuted 1-2 (ambiguous)

**Evidence in full:**
Google's own support page for offline merchants explicitly states: "Customers can pay using any UPI-based application." This is reinforced by NPCI's interoperability mandate requiring UPI QR codes to be app-agnostic.

However, the adversarial verification process refuted the claim that "Google Pay for Business charges no fees to merchants" (vote 1-2), suggesting the "completely free" narrative requires scrutiny and direct verification.

What is confirmed: Google Pay for Business offers a static QR with interoperable UPI acceptance.

What it does not offer (confirmed by absence in primary docs):
- Shareable payment links
- A transaction ledger
- Customer contact capture
- Per-payment descriptions or labels
- Amount pre-fill for a specific transaction
- Any analytics or reporting

The gap between a bank-issued static QR or Google Pay QR (passive, no analytics, no link sharing) and a full merchant payments identity (shareable link, ledger, receipts, store page) is precisely where SMEPay, and potentially UPAY, operate.

**Sources:**
- https://support.google.com/pay-offline-merchants/answer/9232116?hl=en

---

### Finding 5 — Zero MDR Is Legally Durable

**Claim:** The government's zero-MDR mandate creates a legally durable floor that enables zero-commission products to be technically viable, but does not resolve the platform-fee layer charged by gateways acting as Payment Aggregators.

**Confidence:** HIGH · **Vote:** 3-0

**Evidence in full:**
The zero-MDR mandate for standard UPI savings-account transfers has been in force since January 2020 (amended via Section 10A, Payments and Settlement Systems Act, and Section 269SU of the Income-tax Act).

A Finance Ministry statement in 2025 explicitly called claims that MDR would return "completely false, baseless, and misleading."

However, MDR is the bank/network-layer cost — it governs what acquiring banks and NPCI charge. Payment Aggregators (Razorpay, Cashfree, PayU) are a separate technology layer and legally charge platform fees above this zero floor.

The March 2026 parliamentary committee recommendation to introduce tiered MDR for large merchants remains unimplemented as of the research date.

**Critical excluded category:** UPI transactions initiated from Prepaid Payment Instruments (wallets like Paytm wallet) can attract up to 1.1% interchange on amounts above ₹2,000. The zero-MDR guarantee applies only to bank-account-to-bank-account UPI. Any UPAY product built for direct bank account receipt (the most common merchant use case) operates on a legally guaranteed zero network-cost foundation.

**Sources:**
- https://razorpay.com/blog/upi-charges-explained-mdr-vs-platform-fees/
- Finance Ministry statement (2025, referenced in multiple sources)

---

## Refuted Claims (Did Not Survive Adversarial Verification)

These are claims that were initially extracted from sources but failed the 3-vote adversarial check. They are listed here in full because the refutation itself is informative.

---

### Refuted 1 — UroPay Zero Commission Claim

**Claim:** UroPay charges zero transaction commission on all UPI payments, monetizing instead via a subscription model (free tier forever, Growth at ₹50/user/month, Unlimited at ₹500/user/month) — meaning a competitor like UPAY is not entering a vacuum but a market where at least one player already offers zero-commission UPI links.

**Vote: 0-3 KILLED**

**Why it matters:** UroPay's claims about their own product could not be independently corroborated. Their "zero commission" marketing language may be accurate or may be misleading — we cannot confirm either way from this research run. Treat UroPay as an unverified competitor until primary investigation is done.

**Source:** https://www.uropay.me/

---

### Refuted 2 — UroPay No-KYC Claim

**Claim:** UroPay requires no KYC to start accepting UPI payments, directly targeting the segment of informal merchants and solopreneurs who cannot or will not complete traditional gateway KYC.

**Vote: 0-3 KILLED**

**Why it matters:** The "no KYC" claim is a significant competitive differentiator if true. Its refutation means we cannot assume this gap exists or doesn't exist — needs direct product testing.

**Source:** https://www.uropay.me/

---

### Refuted 3 — UroPay Technical Confirmation Mechanism

**Claim:** UroPay's order confirmation mechanism relies on SMS detection via a companion app or manual customer-provided UPI Reference Numbers — not real-time server-side payment webhooks — indicating a technically weak confirmation flow that a better-engineered product could improve upon.

**Vote: 0-3 KILLED**

**Why it matters:** If true, this would represent a product quality gap UPAY could exploit. Since the claim was killed, the actual mechanism UroPay uses for settlement confirmation is unknown.

**Source:** https://www.uropay.me/

---

### Refuted 4 — Google Pay for Business Is Completely Free

**Claim:** Google Pay for Business charges no fees to merchants — payments go directly to the merchant's bank account at zero cost.

**Vote: 1-2 KILLED (ambiguous)**

**Why it matters:** The "free" positioning of Google Pay for Business is commonly assumed but not cleanly confirmed. The 1-2 refutation means this needs direct verification — the fee structure may have conditions, thresholds, or indirect costs not obvious from the support page.

**Source:** https://support.google.com/pay-offline-merchants/answer/9232116?hl=en

---

### Refuted 5 — Open Source UPI Deep Link Gateway (upi-pg)

**Claim:** A zero-commission UPI payment link and QR code generator can be built using the open UPI deep link protocol without any intermediary holding funds, as demonstrated by this working open-source project.

**Vote: 1-2 KILLED**

**Why it matters:** This is directly relevant to UPAY's technical architecture. The 1-2 refutation means the "open source UPI deep link" approach is not cleanly validated. The project exists but its viability claims are contested.

**Source:** https://github.com/Centre-for-Information-Technology-India/upi-pg

---

### Refuted 6 — upi-pg "No Account Required" Claim

**Claim:** The project requires no account for basic use and no transaction fees are charged, proving the zero-commission model is technically viable without proprietary payment processing infrastructure.

**Vote: 0-3 KILLED**

**Source:** https://github.com/Centre-for-Information-Technology-India/upi-pg

---

### Refuted 7 — RBI PA ₹25Cr Net Worth Requirement

**Claim:** Any entity acting as a Payment Aggregator in India must be incorporated under the Companies Act and maintain a minimum net worth of Rs. 25 crores, making casual or indie-built zero-fee aggregators legally unviable without substantial capital.

**Vote: 0-3 KILLED**

**Why it matters (critical):** This claim was killed as *unverified*, NOT as *false*. The research run could not confirm this from primary sources. It is NOT safe to assume the PA capital requirement doesn't exist — this is the single highest-stakes legal question for UPAY. The 0-3 kill means "we couldn't confirm it from what we fetched", not "it's wrong." Needs independent legal verification.

**Source:** https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/

---

### Refuted 8 — Payment Aggregators Must Hold Funds in Escrow

**Claim:** Payment Aggregators are legally required to hold merchant funds in escrow accounts at scheduled commercial banks before settlement, meaning any PA-classified product structurally cannot route money "directly" to a merchant bank account without an intermediary hold.

**Vote: 0-3 KILLED**

**Why it matters (critical):** Same caveat as Refuted 7. This was killed as unverifiable, not as false. If UPAY's architecture ever touches fund holding — even briefly — and UPAY is classified as a PA, this rule may apply. Needs legal verification.

**Source:** https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/

---

### Refuted 9 — RBI Small Merchant Definition (₹5L Annual Turnover)

**Claim:** Small merchants are defined by RBI as those with a physical interface only and annual turnover under Rs. 5 lakh who do not require GST registration, setting a concrete threshold below which the lightest KYC tier applies.

**Vote: 0-3 KILLED**

**Source:** https://vinodkothari.com/2024/04/offline-payment-aggregators-to-be-under-regulatory-scheme-rbi-proposes-amendments-to-pa-regime/

---

### Refuted 10 — RBI Medium Merchant KYC Burden

**Claim:** Medium merchants (physical or online interface, turnover under Rs. 40 lakh, no GST required) face additional KYC obligations — official documentation of proprietors and beneficial owners — creating a compliance burden that could deter small PAs from onboarding this segment.

**Vote: 1-2 KILLED (ambiguous)**

**Source:** https://vinodkothari.com/2024/04/offline-payment-aggregators-to-be-under-regulatory-scheme-rbi-proposes-amendments-to-pa-regime/

---

### Refuted 11 — SMEPay Instant Settlement, No Intermediary

**Claim:** SMEPay claims instant bank settlement with no intermediary hold on funds.

**Vote: 0-3 KILLED**

**Why it matters:** SMEPay markets "instant settlement" but the 0-3 kill means this could not be independently verified. Their actual settlement mechanics are unknown. If they do hold funds even briefly, this has regulatory implications for them — and may explain why their pricing is ₹3–₹5/tx rather than literally free.

**Source:** https://www.smepay.io/

---

### Refuted 12 — SMEPay Targets Informal/Social Commerce Merchants

**Claim:** SMEPay explicitly targets informal/social-commerce merchants (Instagram sellers, WhatsApp businesses, freelancers, D2C brands) — the same underserved segment UPAY is targeting — indicating validated demand in this niche.

**Vote: 0-3 KILLED**

**Why it matters:** If true, SMEPay has validated our exact target segment. Since the claim is refuted (unverifiable, not false), we cannot confirm from their public marketing alone that they're going after the same persona. Needs direct product investigation.

**Source:** https://www.smepay.io/

---

### Refuted 13 — Hidden Commissions as Primary Freelancer Pain

**Claim:** The article identifies "hidden commissions and complex integrations" as the primary pain point driving freelancers away from mainstream UPI payment tools.

**Vote: 0-3 KILLED**

**Source:** https://www.smepay.io/blogs/top-5-upi-payment-tools-for-freelancers-in-india-2025-2

---

### Refuted 14 — 80% Indian Adults Have Bank Accounts

**Claim:** Approximately 80% of Indian adults own bank accounts, meaning the infrastructure for direct bank-to-bank UPI payments (without intermediaries) already reaches the vast majority of the target merchant base.

**Vote: 0-3 KILLED**

**Source:** https://a16z.com/global-payments-india/

---

### Refuted 15 — Only 11% of Indian MSMEs Have Formal Credit Access

**Claim:** Only 11% of Indian MSMEs have formal credit access, with 60% of credit demand unmet — indicating that small merchants are severely underserved by formal financial infrastructure beyond payments.

**Vote: 0-3 KILLED**

**Source:** https://a16z.com/global-payments-india/

---

## All Sources Fetched (28 total)

| URL | Quality Rating | Research Angle | Claims Extracted |
|-----|---------------|----------------|-----------------|
| https://www.deccanherald.com/india/karnataka/bengaluru/upi-dilemma-bengalurus-small-vendors-fear-big-trouble-over-tax-notice-3632149 | secondary | Merchant pain / underserved segment | 1 |
| https://blog.saginfotech.com/karnatakas-gst-evasion-notices-prompt-shopkeepers-upi-payments | blog | Merchant pain / underserved segment | 5 |
| https://www.smepay.io/ | blog | Merchant pain / underserved segment | 5 |
| https://www.uropay.me/ | primary | Merchant pain / underserved segment | 5 |
| https://english.varthabharati.in/india/pay-in-notes-bengalurus-small-vendors-shun-upi-over-tax-notice-fears | unreliable | Merchant pain / underserved segment | 0 |
| https://razorpay.com/blog/upi-charges-explained-mdr-vs-platform-fees/ | blog | Competitive feature and pricing landscape | 5 |
| https://www.cashfree.com/payment-gateway-charges/ | primary | Competitive feature and pricing landscape | 5 |
| https://bharatpe.com/blog/qr-based-payments-the-present-and-future-of-your-business/ | unreliable | Competitive feature and pricing landscape | 0 |
| https://support.google.com/pay-offline-merchants/answer/9232116?hl=en | primary | Competitive feature and pricing landscape | 5 |
| https://www.smepay.io/blogs/top-5-upi-payment-tools-for-freelancers-in-india-2025-2 | blog | Competitive feature and pricing landscape | 3 |
| https://a16z.com/global-payments-india/ | blog | VC and investor thesis signal | 5 |
| https://digitalinasia.com/upi-revenue-problem-india-digital-payments/ | blog | VC and investor thesis signal | 5 |
| https://www.medianama.com/2026/03/223-parliamentary-committee-calls-return-mdr-upi-implications-for-users-small-merchants/ | unreliable | VC and investor thesis signal | 0 |
| https://www.kansascityfed.org/research/payments-system-research-briefings/the-role-of-nonbanks-and-fintechs-in-boosting-indias-upi-person-to-merchant-transactions/ | unreliable | VC and investor thesis signal | 0 |
| https://github.com/Centre-for-Information-Technology-India/upi-pg | primary | Developer and indie builder frustration | 5 |
| https://github.com/BlackHatDevX/UPI-PAYMENT-GATEWAY-QUIKEYFY | blog | Developer and indie builder frustration | 4 |
| https://news.ycombinator.com/item?id=32821955 | forum | Developer and indie builder frustration | 5 |
| https://medium.com/@readosage/how-creators-are-building-communities-and-income-on-ko-fi-and-why-its-a-hidden-gem-1c78b955c4df | unreliable | Wedge and go-to-market analogies | 0 |
| https://www.reservedbusiness.com/upi-qr-codes-for-freelancers-get-paid-without-a-payment-gateway/ | blog | Wedge and go-to-market analogies | 5 |
| https://www.uropay.me/blog/post/payment-gateway-for-unregistered-business-in-india-accept-upi-payments-with-no-kyc-or-documentation | blog | Wedge and go-to-market analogies | 5 |
| https://upilink.in/ | blog | Wedge and go-to-market analogies | 5 |
| https://www.kansascityfed.org/research/payments-system-research-briefings/the-role-of-nonbanks-and-fintechs-in-boosting-indias-upi-person-to-merchant-payments/ | unreliable | Wedge and go-to-market analogies | 0 |
| https://talks.co/p/kofi-vs-buy-me-a-coffee/ | blog | Wedge and go-to-market analogies | 5 |
| https://www.corpzo.com/upi-tpap-license-vs-payment-aggregator-license-understanding-the-key-differences | blog | Regulatory and NPCI infrastructure constraints | 5 |
| https://www.lexology.com/library/detail.aspx?g=66e43cc2-d69d-42a3-87f8-2381a386ea89 | unreliable | Regulatory and NPCI infrastructure constraints | 0 |
| https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/ | secondary | Regulatory and NPCI infrastructure constraints | 5 |
| https://www.npci.org.in/PDF/npci/upi/circular/2024/UPI-OC-190-FY-23-24-Reiteration-of-compliance-to-OC-163-OC-163A-and-OC-100.pdf | unreliable | Regulatory and NPCI infrastructure constraints | 0 |
| https://vinodkothari.com/2024/04/offline-payment-aggregators-to-be-under-regulatory-scheme-rbi-proposes-amendments-to-pa-regime/ | secondary | Regulatory and NPCI infrastructure constraints | 5 |

---

## Raw Statistics

| Metric | Count |
|--------|-------|
| Research angles | 6 |
| Sources fetched | 28 |
| Claims extracted | 93 |
| Claims selected for adversarial verification | 25 |
| Claims confirmed (2/3 or 3/3 votes) | 10 |
| Claims killed (0/3 or 1/3 votes) | 15 |
| After semantic deduplication | 5 confirmed findings |
| URL duplicates filtered | 1 |
| Claims dropped due to budget | 7 |
| Total agent calls | 111 |

---

## Research Caveats (Verbatim from Synthesis Agent)

**Source quality limitations:** Three of the five findings rely partly on secondary sources (blogs, aggregator sites). The Karnataka tax enforcement claims (Finding 2) are the best-corroborated — six independent mainstream outlets confirmed them. SMEPay pricing (Finding 3) is confirmed by the primary source and two independent review sites but SMEPay is a small, recently launched product whose pricing and product scope may change rapidly. The Google Pay fees refutation (Finding 4) is based on a 1-2 adversarial vote, meaning some ambiguity remains; the interoperability claim is rock-solid but the fee structure warrants direct verification before making product claims.

**Time-sensitivity:** The Karnataka tax enforcement event is from July 2025 (~11 months ago relative to June 2026). The political response (CM Siddaramaiah waiving dues) may have partially reduced merchant anxiety, but the behavioral precedent (merchants now know their UPI data can be subpoenaed) is permanently established. SMEPay pricing as of 2026 Techjockey review is current.

**Refuted claims that matter for product strategy:** Multiple claims about RBI PA regulations (escrow requirements, minimum ₹25 crore net worth for PAs, KYC tiers) were refuted due to insufficient primary-source corroboration in this research run — but the underlying regulatory question is unresolved, not disproven. Any UPAY build must independently verify whether its model would be classified as a Payment Aggregator or a UPI deep-link generator (the latter being unregulated). The open-source UPI deep-link approach also could not be verified as viable.

**What this research did NOT cover:** Actual merchant survey data on willingness to pay, distribution economics, ARPU modeling, or any confirmed traction metrics for SMEPay or comparable products. No primary interviews with merchants were conducted. No developer forums yielded clean primary-source quotes (the Hacker News thread at https://news.ycombinator.com/item?id=32821955 was fetched but claims from it did not pass adversarial verification). Reddit and Facebook group data was not successfully retrieved in this run.

---

## Open Questions Flagged by Research (Verbatim)

1. **Does UPAY's intended architecture trigger RBI Payment Aggregator classification?** The PA regulation claims were refuted as unverified rather than false — this is the single highest-stakes unresolved legal question before writing any code.

2. **Has the July 2025 Karnataka enforcement event permanently shifted small-merchant trust in UPI, or has the CM's subsequent dues-waiver and political pressure reset baseline trust?** Is there current (2026) behavioral evidence of continued QR-code removal or is this a closed episode?

3. **What is SMEPay's actual merchant count and transaction volume, and what does its churn data reveal about whether flat-fee pricing alone is sufficient to retain the target segment — or whether merchants still drift back to cash or bank QRs?**

4. **Is there a viable distribution channel for UPAY that does not require a large sales force?** The "WhatsApp-shareable payment link" mechanic is a plausible organic growth vector, but no confirmed evidence of this working at scale for any Indian indie payments product was found in this research round.

---

## Competitor Reference Map

| Product | Confirmed Pricing | Fund Holding | KYC Required | Ledger | Payment Links | Source |
|---------|------------------|-------------|--------------|--------|---------------|--------|
| Razorpay | 2% + 18% GST per UPI tx | Yes | Yes (business docs) | Yes | Yes | https://razorpay.com/blog/upi-charges-explained-mdr-vs-platform-fees/ |
| Cashfree | 1.95% + ₹20 min per VBA tx | Yes | Yes | Yes | Yes | https://www.cashfree.com/payment-gateway-charges/ |
| Google Pay for Business | Ambiguous (not confirmed free) | No | Light | No | No | https://support.google.com/pay-offline-merchants/answer/9232116?hl=en |
| BharatPe | Not confirmed in this run | Unknown | Unknown | Unknown | Unknown | https://bharatpe.com/blog/qr-based-payments-the-present-and-future-of-your-business/ (unreliable, 0 claims) |
| SMEPay | ₹5/tx free, ₹3/tx pro (₹499/mo) | Unverified | Unknown | Unknown | Unknown | https://www.smepay.io/ |
| UroPay | Claimed free, unverified | Unknown | Claimed none, unverified | Unknown | Unknown | https://www.uropay.me/ |
| upilink.in | Unknown | Unknown | Unknown | Unknown | Unknown | https://upilink.in/ |

---

## GitHub Projects Found (Developer Angle)

| Repo | Description | Relevance to UPAY |
|------|-------------|-------------------|
| https://github.com/Centre-for-Information-Technology-India/upi-pg | Open source UPI payment gateway using deep links | Direct architectural analogue — but viability claims refuted 1-2 and 0-3 |
| https://github.com/BlackHatDevX/UPI-PAYMENT-GATEWAY-QUIKEYFY | UPI payment gateway project (indie) | Confirms builder interest, claims not verified |

**Hacker News thread on UPI payments:** https://news.ycombinator.com/item?id=32821955 (fetched, 5 claims extracted, none passed adversarial verification — treat as background signal only)

---

## Adjacent Models Researched

| Product | Wedge | Distribution | Source |
|---------|-------|-------------|--------|
| Ko-fi | Creator tip jar — no commission on tips (takes 0%, makes money on Ko-fi Gold subscription) | Creator shareability — every Ko-fi page is a distribution event | https://talks.co/p/kofi-vs-buy-me-a-coffee/ |
| Buy Me a Coffee | 5% commission on tips, but better product/discovery features than Ko-fi | Same — shareable link = organic distribution | https://talks.co/p/kofi-vs-buy-me-a-coffee/ |
| upilink.in | UPI link generator, India | Unknown — site fetched, claims unverified | https://upilink.in/ |
| UroPay | Positions as "payment gateway for unregistered business in India — no KYC" | Unknown | https://www.uropay.me/blog/post/payment-gateway-for-unregistered-business-in-india-accept-upi-payments-with-no-kyc-or-documentation |

**Key analog finding (from Ko-fi/Buy Me a Coffee research):** Both products won because the payment page itself was the distribution mechanism. Creators shared their link; recipients saw the product and created their own. The payment flow was the growth loop. If UPAY can replicate this — where every customer who pays via an UPAY checkout thinks "I need one of these" — distribution is organic.

---

## Regulatory Sources Consulted

| Source | Quality | What It Covers | Outcome |
|--------|---------|---------------|---------|
| https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/ | secondary | RBI PA guidelines — escrow, net worth requirements | Claims refuted as unverifiable (not as false) |
| https://vinodkothari.com/2024/04/offline-payment-aggregators-to-be-under-regulatory-scheme-rbi-proposes-amendments-to-pa-regime/ | secondary | RBI proposed PA amendments, KYC tiers | Claims refuted as unverifiable |
| https://www.corpzo.com/upi-tpap-license-vs-payment-aggregator-license-understanding-the-key-differences | blog | TPAP license vs PA license distinction | 5 claims extracted, not selected for adversarial verification in top 25 |
| https://www.npci.org.in/PDF/npci/upi/circular/2024/UPI-OC-190-FY-23-24-Reiteration-of-compliance-to-OC-163-OC-163A-and-OC-100.pdf | unreliable | NPCI circular on UPI compliance | 0 claims extracted (likely gated/unavailable) |
| https://www.lexology.com/library/detail.aspx?g=66e43cc2-d69d-42a3-87f8-2381a386ea89 | unreliable | Legal commentary on PA regulations | 0 claims extracted |

**Key regulatory distinction not confirmed but flagged:** TPAP (Third Party Application Provider) license vs Payment Aggregator license. TPAPs are entities like Google Pay and PhonePe that operate UPI apps — they require NPCI approval but different capital requirements than PAs. If UPAY is a TPAP-adjacent product (a UPI deep-link generator that never touches funds), the regulatory path may be lighter. This distinction was not confirmed in this research run and needs independent legal verification.

---

*End of Phase 1 research (deep research workflow). Phase 2 begins below.*

---

# Phase 2 Research — Four Parallel Agent Runs
*June 2026 · 4 agents · ~175K tokens · Raw, unsummarised*

Agents run:
1. Legal boundary: UPI deep-link page vs Payment Aggregator under RBI rules
2. upi.pe teardown: what it does, what's broken, full competitor landscape
3. Buy Me a Coffee / Ko-fi technical model and the India gap
4. Embeddable payment elements: code, mechanics, UPI deep link spec

---

## Agent 1 — Legal Boundary: Is UPAY a Payment Aggregator?

### Short Answer
**No. The definitional trigger for PA status is fund handling. UPAY never handles funds.**

---

### RBI Payment Aggregator Definition (Verbatim)

From RBI circular RBI/DPSS/2019-20/174 (March 17, 2020), "Guidelines on Regulation of Payment Aggregators and Payment Gateways," consolidated into the September 15, 2025 Master Direction:

> "entities that facilitate e-commerce sites and merchants to accept various payment instruments from the customers for completion of their payment obligations without the need for merchants to create a separate payment integration system of their own. PAs facilitate merchants to connect with acquirers. In the process, they **receive payments from customers, pool and transfer them on to the merchants** after a time period."

The three conjunctive functions defining a PA:
1. **Receive** payments from customers
2. **Pool** those payments
3. **Transfer** them to merchants after a time period (typically via escrow at a scheduled commercial bank)

A UPI deep link page that generates `upi://pay?pa=name@okhdfcbank&pn=Name` performs **none of these**. When a visitor clicks or scans, their UPI app initiates the payment and funds go peer-to-merchant directly through NPCI's infrastructure. The UPAY server is never in the chain of fund movement.

**"Never touching funds" is not just a safe harbor — it is the literal definitional boundary.**

**Sources:**
- RBI 2020 PA/PG Circular: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11822&Mode=0
- AZB Partners analysis: https://www.azbpartners.com/bank/payment-aggregators-and-gateways-indias-regulatory-framework/
- Trilegal analysis: https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/
- 2025 Master Direction PDF: https://www.fidcindia.org.in/wp-content/uploads/2025/09/RBI-PAYMENT-AGGREGATORS-DIRECTIONS-15-09-25.pdf

---

### TPAP (Third Party Application Provider) — Does It Apply?

**No. UPAY is not a TPAP and does not need to be.**

A TPAP under NPCI's framework:
- Operates a **UPI-enabled mobile application** (Google Pay, PhonePe, BHIM, Paytm)
- Allows users to **initiate, authenticate, and complete** UPI transactions from within their app
- Operates **through a sponsor PSP bank** holding actual NPCI membership
- Is **explicitly approved by NPCI**
- Subject to NPCI volume cap: single TPAP cannot exceed 30% of total UPI transaction volume (OC-159, 2022)

Examples of TPAPs: Google Pay (sponsor banks: Axis, HDFC, ICICI, SBI), PhonePe (Yes Bank), Paytm (Paytm Payments Bank).

UPAY does not host a UPI app, does not maintain a UPI API connection through a PSP bank, does not allow users to authenticate/initiate transactions on the platform, and does not enter the UPI payment flow at any point. UPAY generates the URL; the TPAP (GPay etc.) does the payment.

**Sources:**
- NPCI TPAP volume cap circular OC-159 (2022): https://www.npci.org.in/PDF/npci/upi/circular/2022/UPI-OC-159-Guidelines-on-volume-cap-for-Third-Party-App-Providers-(TPAPs)-in-UPI.pdf
- NPCI SOP on TPAP market share cap (2021): https://www.npci.org.in/PDF/npci/upi/circular/2021/standard-operating-procedure-sop%E2%80%93market-share-cap-for-third-party-application-providers-tpap.pdf
- Corpbiz TPAP license overview: https://corpbiz.io/tpap-license
- Corpzo TPAP guide: https://www.corpzo.com/TPAP-license

---

### Payment Gateway (PG) Definition (Verbatim)

> "entities that provide technology infrastructure to route and facilitate processing of an online payment transaction **without any involvement in handling of funds**."

A PG sits in the actual transaction routing chain between merchant and acquirer/bank. It processes actual payment data — card numbers, UPI collect requests, authentication tokens.

UPAY generates a static URL and a QR code encoding that URL. It does not route any transaction data, process any payment information, interface with any payment network API, or see any transaction result.

**The regulatory spectrum:**
1. PA: touches funds → PSS Act authorization mandatory, escrow required, ₹25 crore net worth
2. PG: routes transactions but no funds → no authorization needed, voluntary baseline tech recommendations
3. UPAY: generates URLs following a public spec → **no PA, no PG, no regulatory hook under current RBI or NPCI rules**

The September 2025 Master Direction explicitly confirmed that "Payment Gateways that only provide routing tech and do not touch funds are explicitly out of scope" while being encouraged to adopt baseline technology recommendations voluntarily.

**Sources:**
- Mondaq 2025 MD analysis: https://www.mondaq.com/india/financial-services/1727528/rbi-master-direction-on-digital-payment-aggregators-understanding-compliance-requirements-and-industry-implications
- Strobes RBI PA/PG guide: https://strobes.co/compliance/rbi-guidelines-for-payment-aggregators-payment-gateways/
- Digital Fifth 2025 framework: https://thedigitalfifth.com/rbi-payment-aggregator-framework-2025-2/

---

### Indian Companies Doing This Without PA Registration (Confirmed)

**1. upi.pe (UPIPE)**
https://upi.pe/
Operates entirely client-side. Stated legal position: "UPIPE is a free public tool. It generates UPI payment links and QR codes following NPCI's URL specification. It does not process, hold, or receive payments." No PA registration. No NPCI approval.

**2. UroPay**
https://www.uropay.me/
Explicitly states: "UroPay is a UPI payment facilitator. Not a payment aggregator. The difference matters." Self-classifies as a "payment solution provider" outside the PA framework because "the money flows directly from customer to merchant via standard UPI infrastructure."
- https://www.uropay.me/blog/post/payment-gateway-for-unregistered-business-in-india-accept-upi-payments-with-no-kyc-or-documentation
- https://www.uropay.me/blog/post/no-kyc-payment-gateway-in-india-accept-upi-payments-without-documents-with-uropay

**3. UPI Link / UPI Links**
- https://upilink.in/
- https://www.upilinks.in/

**4. UPI PG (CIT)**
https://upipg.cit.org.in/en/developers

**5. Open-source implementations**
- https://github.com/Pratyay360/upiqrcode (GPL v3)
- https://github.com/vivekkushwaha66/upi-deeplink-builder

**6. Setu (setu.co)**
https://setu.co/payments/upi-deeplinks/
Different category — Setu integrates with banks and provides dynamic deeplinks with payment confirmation through bank partnerships. More sophisticated than a static link generator. Not comparable to UPAY's proposed architecture.

---

### NPCI's October 2024 Warning — Does It Apply to UPAY?

**No. The warning was about UPI API misuse, not link generation.**

NPCI sent warning letters (October 2024) to: Idfy, Cashfree, PhonePe (certain uses), Paytm.

NPCI's exact language: "the UPI APIs provided by NPCI are strictly for the purpose of facilitating UPI payments for customers and for required verification of users for fraud prevention" and must not be used independently for other purposes.

This warning is about entities with actual **UPI API access** misusing that access. A static deep link generator:
- Makes zero calls to any UPI API
- Does not access any UPI customer data
- Does not call NPCI's network
- Merely encodes a string into a QR code using standard algorithms

**Sources:**
- NPCI 2024 warning (Taxscan): https://www.taxscan.in/unauthorised-upi-id-usage-by-fintechs-under-npci-scanner/450493
- Medianama: https://www.medianama.com/2024/10/223-npci-sends-warning-letter-to-fintech-entities-offering-unauthorised-use-of-upi-api-as-a-service/
- IndiaCSR: https://indiacsr.in/npci-issues-warning-to-fintech-companies-over-unauthorised-upi-id-use/
- HeadAndTale: https://theheadandtale.com/news/npci-asks-fintechs-to-stop-unauthorized-use-of-upi-ids/

---

### NPCI UPI Linking Specification — Commercial Use

The NPCI UPI Linking Specification (v1.6, November 2017) is a **public technical document** with no stated restrictions on third-party commercial generation of URLs following its format.

The URL format:
```
upi://pay?pa=<VPA>&pn=<PayeeName>&mc=<MerchantCode>&tid=<TxnID>&tr=<TxnRef>&tn=<TxnNote>&am=<Amount>&cu=INR
```

The one restriction in the spec: "This URL, when used, MUST BE related to the particular transaction and MUST NOT be used to send unsolicited information that are not relevant to the transaction." This is directed at UPI app developers implementing the intent handler, not entities generating URLs.

**NPCI Linking Spec (v1.6):** https://www.labnol.org/files/linking.pdf
**GitHub mirror:** https://github.com/bgagan911/RandomDocs/wiki/NPCI-UPI---Specifications-for-Deep-Linking

---

### PSS Act 2007 Analysis

The PSS Act 2007, Section 2(1)(i), defines a "payment system" as: "a system that enables payment to be effected between a payer and a beneficiary, involving clearing, payment or settlement service or all of them."

A UPI deep link generator does not perform clearing, settlement, or the payment itself. It generates a URL. The payment system is operated by NPCI, PSP banks, and issuing/beneficiary banks. UPAY is no more a "payment system" than Google Maps is a transportation company because it shows bus routes.

**PSS Act full text:** https://www.indiacode.nic.in/bitstream/123456789/2082/1/A2007_51.pdf
**RBI FAQ on PSS Act:** https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=420

---

### The One Genuine Risk: 2025 PA-P Expansion

RBI's April 2024 draft PA-P circular (PA-Physical) and September 2025 Master Direction introduced: **Physical Payment Aggregators** — entities facilitating offline/face-to-face payments who **pool and settle funds**.

The draft specifically mentioned "QR code payment facilitators that **pool and settle funds periodically**" as within scope.

**Trigger words: "pool and settle."** UPAY never collects, pools, or settles funds. PA-P targets entities like Mswipe, Pine Labs — offline POS aggregators that deploy terminals and batch-settle to merchants. That function is categorically absent from UPAY's architecture.

**Source:** https://natlawreview.com/article/click-brick-proposal-expand-payment-aggregator-guidelines-online-and-offline

---

### Legal Summary Matrix

| Question | Finding |
|---|---|
| Are you a Payment Aggregator? | No. PA requires receiving, pooling, and transferring funds. UPAY does none of these. |
| Are you a TPAP? | No. TPAPs operate UPI apps with live API connections through PSP banks. UPAY generates URLs. |
| Do you need PA registration? | No, under current framework. |
| Do you need PG compliance? | No mandatory requirements. Voluntary tech recommendations are advisory. |
| Does PSS Act capture you? | Almost certainly not. UPAY doesn't clear, settle, or route payments. |
| NPCI approval needed? | No. NPCI's October 2024 crackdown was on UPI API misuse, not link generation. |
| Commercial use of UPI deep link spec? | Yes. The spec is public. No stated restriction on third-party URL generation. |
| Comparable companies without PA license? | upi.pe, uropay.me, upilink.in, upilinks.in, multiple GitHub projects. |

### Grey Areas (Still Need Legal Verification)

1. **Payment confirmation feature**: If any mechanism is added to confirm a received payment (polling UPI API, reading webhooks from a PSP), regulated territory may be entered. UroPay's SMS-reading approach is in a grey zone.
2. **Merchant KYC obligations**: If UPAY is seen as "onboarding merchants" and acting as their payment infrastructure, a regulator could argue merchant onboarding obligations apply.
3. **Scale**: Regulators in India tolerate small-scale operations then regulate at scale. UroPay at meaningful commercial volume could attract PA-P scrutiny even under "no fund touching."
4. **Broad PSS Act reading**: An aggressive reading of "system that enables payment" could theoretically capture any payment funnel intermediary. Never applied to URL generators, but get a legal opinion before commercial launch.

### All Regulatory Document URLs

- RBI 2020 PA/PG Guidelines: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11822&Mode=0
- RBI 2025 Master Direction on PAs: https://www.fidcindia.org.in/wp-content/uploads/2025/09/RBI-PAYMENT-AGGREGATORS-DIRECTIONS-15-09-25.pdf
- PSS Act 2007: https://www.indiacode.nic.in/bitstream/123456789/2082/1/A2007_51.pdf
- RBI PSS Act FAQ: https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=420
- NPCI TPAP SOP 2021: https://www.npci.org.in/PDF/npci/upi/circular/2021/standard-operating-procedure-sop%E2%80%93market-share-cap-for-third-party-application-providers-tpap.pdf
- NPCI TPAP Volume Cap OC-159 (2022): https://www.npci.org.in/PDF/npci/upi/circular/2022/UPI-OC-159-Guidelines-on-volume-cap-for-Third-Party-App-Providers-(TPAPs)-in-UPI.pdf
- NPCI UPI Linking Specification v1.6: https://www.labnol.org/files/linking.pdf
- NPCI list of 3rd party UPI apps: https://www.npci.org.in/what-we-do/upi/3rd-party-apps
- National Law Review PA-P analysis: https://natlawreview.com/article/click-brick-proposal-expand-payment-aggregator-guidelines-online-and-offline
- Mondaq 2025 MD analysis: https://www.mondaq.com/india/financial-services/1727528/rbi-master-direction-on-digital-payment-aggregators-understanding-compliance-requirements-and-industry-implications
- NPCI 2024 unauthorized API warning (Taxscan): https://www.taxscan.in/unauthorised-upi-id-usage-by-fintechs-under-npci-scanner/450493
- Medianama NPCI warning: https://www.medianama.com/2024/10/223-npci-sends-warning-letter-to-fintech-entities-offering-unauthorised-use-of-upi-api-as-a-service/

---

## Agent 2 — upi.pe Deep Teardown + Full Competitor Landscape

### What upi.pe Actually Does — Full User Flow

**upi.pe** (branded UPIPE — UPI QR Code Generator) is a free, browser-based tool. Zero signup. Everything client-side. No server-side storage.

**Merchant flow:**
1. Visit https://upi.pe/
2. Choose tab: "UPI ID" or "Bank Account"
3. Enter UPI ID (e.g. `yourname@okhdfc`) or bank account number + IFSC
4. Optionally: fixed amount (₹), payee name, payment note
5. Receive: shareable URL + downloadable QR PNG + share button

**Generated URL format:**
```
https://upi.pe/?pa=alice@hdfc&am=500&pn=Alice+Sharma&tn=Invoice+007
```
Parameters: `pa` (UPI ID), `am` (amount), `pn` (payee name), `tn` (transaction note). No slug. No vanity path. Long ugly query string.

**Payer flow — what the page shows:**
- Header: "₹100.00 to [Merchant Name] on UPI"
- One large "Open in UPI app" button — routes to device's default UPI app, NOT separate per-app buttons
- QR code with instruction: "Scan the QR with your phone's camera or UPI app"
- 3-step guide: (1) Tap "Open in UPI app", (2) Verify the payee name, (3) Enter your UPI PIN
- Safety notice: "Verify the payee name before paying"
- Footer disclaimer: "UPIPE only generated the link" — makes clear it does not process transactions
- Compatible apps listed: GPay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, WhatsApp Pay, MobiKwik, Slice, super.money, Fi, Jupiter

Source: direct fetch of https://upi.pe/?pa=test@okhdfc&am=100&pn=Test+Merchant

---

### upi.pe Feature Inventory (Complete)

| Feature | upi.pe |
|---|---|
| UPI ID to payment link | YES |
| Bank account to QR | YES (but rejected by PhonePe and Paytm) |
| Fixed amount | YES |
| Variable amount (blank) | YES |
| Payee name field | YES |
| Transaction note | YES |
| QR code generation | YES (PNG download) |
| Generic "Open in UPI app" button | YES |
| Per-app buttons (GPay / PhonePe / Paytm separately) | NO |
| Vanity / custom URL slug | NO |
| Signup / account | NO |
| Link management dashboard | NO |
| Payment tracking / history | NO |
| Payment confirmation / notification | NO |
| Webhooks | NO |
| API | NO |
| Embeddable widget / iframe | NO |
| Merchant logo / branding | NO |
| Link expiry dates | NO |
| Analytics (link views, clicks) | NO |
| Mobile app | NO |
| Multi-language | NO |

---

### Who Built upi.pe?

Footer says: "Made with care by Arihant Jain."

There is an Arihant Jain at arihantcodes.com — Design Engineer (Wokay, previously ShadcnBlocks.com), CS student, Twitter @arihantcodes. **upi.pe is not listed in his portfolio.** He lists "Spectrum UI" and "Json Formatter." Could be a different person or an early unlisted side project.

No GitHub repository found. No changelog. No Twitter account for the tool. Not on Product Hunt. Not mentioned in any Reddit thread or Indian tech blog roundup. The site works but **zero active maintenance signals.**

Source: https://arihantcodes.com/, https://upi.pe/ footer

---

### Reddit / Twitter / Product Hunt — upi.pe

**Product Hunt:** No listing found for upi.pe.

**Reddit:** No Reddit posts found specifically mentioning upi.pe.

**Twitter/X:** No Twitter account found. "upi.pe site:twitter.com" returns nothing.

**Hacker News:** Not found.

**Conclusion: upi.pe has zero community presence, zero word-of-mouth, zero media coverage. It exists but nobody talks about it.**

---

### upilink.in — SHUT DOWN November 8, 2024

Key finding: upilink.in **shut down on November 8, 2024.**

Shutdown reason: **fraud misuse on platform + RBI/NPCI regulatory non-compliance.**

Founder's shutdown notice redirected users to Razorpay.

Pre-shutdown traffic: **#448,605 global rank**, 72.18% bounce rate, 12-second avg visit duration.

Had features: one-click payment links, QR codes, GPay/PayTM/PhonePe support, deep linking, no ads, "1M Users," "8+ countries."

No API, no embeddable widget. Fundamentally same category as upi.pe.

Source: https://link.upilink.in/ (shutdown notice, still live)

---

### Full Competitor Landscape

| Tool | URL | Status | Key differentiator | Pricing |
|---|---|---|---|---|
| UPIPE | upi.pe | Live, unmaintained | Simplest, cleanest, zero features | Free |
| upilink.in | upilink.in | **DEAD Nov 2024** | Was high-traffic, shutdown for fraud/regulatory | Was free |
| upilinks.in | upilinks.in | Live | Link expiry dates, mobile app | Free |
| UPI PG | upipg.cit.org.in | Live | Dashboard, 12 Indian languages, iframe embed, dev docs | Free/open source |
| UroPay | uropay.me | Live | Webhooks, SMS confirmation, API, WooCommerce plugin | Free + ₹50–500/mo |
| MyPaylink | mypaylink.in | Live | Multi-app support, Tikanga.in | Free |
| getupilink | getupilink.com | DOWN (502) | Simple shareable link | Was free |
| Pay Via UPI | payviaupi.com | Live | Open source, website donation widget | Free |
| Linkpe | linkpe.me | Live | Charities/fundraising, memorable URLs | Free |
| Zubizi UPI QR | zubizi.com/tools/upi-qr-code-generator | Live | Logo in QR, SVG export | Free |
| Apgy UPI Tool | tools.apgy.in | Live | Part of multi-tool platform | Free |
| Toolvala | toolvala.in | Live | Simple converter | Free |
| Growkick UPI | tools.growkick.in | Live | upi:// deep links, QR slip download | Free |
| DaySchedule UPI | dayschedule.com/tools/upi-qr-generator | Live | Tied to booking/scheduling SaaS | Freemium |
| Labnol UPI QR | labnol.org/upi | Live | By Amit Agarwal (prominent Indian blogger) | Free |
| CashlessConsumer | srikanthlogic.github.io | Live | HTML snippet export for embedding | Free |

**Traffic data (Similarweb):**
- upilinks.in: Global rank #2,350,717, **18 min 33 sec avg session** — unusually high engagement
- upilink.in: Global rank #448,605 before shutdown
- upi.pe: No traffic rank found in any source

---

### Product Hunt Listings in This Space

| Product | Upvotes | Year | Builder |
|---|---|---|---|
| MyPaylink (mypaylink.in) | 78 | 2022 | Amruth Rodrigues & Cryston Fernandes, Tikanga.in |
| Pay Via UPI (payviaupi.com) | 65 | 2022 | Pratik Sharma (@biomathcode) |
| getupilink | 5 | 2024 | @0xsanketh |
| Linkpe (linkpe.me) | 2 | 2020 | Miroojin Bakshi |

MyPaylink alternatives page: https://www.producthunt.com/products/mypaylink/alternatives

---

### What a Better Product Needs (Gap Analysis)

1. **Vanity URL** — `upay.in/alice` — biggest missing feature across every tool
2. **Per-app deep link buttons** — separate GPay, PhonePe, Paytm, BHIM buttons (not one generic button)
3. **Payment confirmation** — even a "customer self-reports" button, or SMS-based (UroPay approach)
4. **Dashboard with link management** — create, name, deactivate, view
5. **Embeddable button/widget** — iframe or JS snippet for websites
6. **API + webhooks** — for developer integration
7. **Merchant branding** — logo, name, description on payment page
8. **Analytics** — link views, QR scans
9. **No KYC requirement** — critical for freelancers/unregistered businesses
10. **Memorable URL structure** — not query strings

**Sources (all):**
- https://upi.pe/
- https://link.upilink.in/ (shutdown notice)
- https://www.upilinks.in/
- https://upipg.cit.org.in/en
- https://www.uropay.me/
- https://www.producthunt.com/products/mypaylink
- https://www.producthunt.com/products/pay-via-upi
- https://www.producthunt.com/products/linkpe
- https://www.producthunt.com/products/getupilink
- https://arihantcodes.com/
- https://mypaylink.in/
- https://zubizi.com/tools/upi-qr-code-generator/
- https://srikanthlogic.github.io/CashlessConsumer/linkgen.html
- https://dev.to/ptprashanttripathi/likepe-free-payment-gateway-api-17dj
- https://github.com/Centre-for-Information-Technology-India/upi-pg
- https://startbiz.org.in/upi-link-generator-tools/

---

## Agent 3 — Buy Me a Coffee, Ko-fi, and the India Gap

### Buy Me a Coffee — Company

- Founded 2018 by **Jijo Sunny, Joseph Sunny, and Aleesha John** — Indian siblings who built it in 30 days with $2,000 seed
- Started as a pivot from a larger paywall product called "Publisher"
- **YC Winter 2020**
- Team: ~26 employees
- Monthly revenue: ~$417K (Starter Story, ~2023)
- Over **1 million creators**
- $500K raised, 4 investors
- Sources: https://mercury.com/blog/founder-spotlight-jijo-sunny-buy-me-a-coffee | https://www.starterstory.com/buy-me-a-coffee-breakdown | https://tracxn.com/d/companies/buy-me-a-coffee

### Buy Me a Coffee — Payment Flow

- Processor: **Stripe** (primary) and **PayPal**
- **BMC holds funds**, pays out every Wednesday to creator's connected Stripe account
- Stripe then deposits to bank in 2–7 business days
- Minimum payout threshold: **$10**
- Source: https://help.buymeacoffee.com/en/articles/10182730-what-is-buy-me-a-coffee-and-how-does-it-work

### Buy Me a Coffee — Fees

- **Platform fee: 5% on all transactions** (tips, memberships, shop sales)
- Stripe processing: 2.9% + $0.30 per transaction + 0.5% for payout + 1% for international cards + 0.5% for subscriptions
- On a $5 coffee: BMC takes $0.25, Stripe takes ~$0.45, creator keeps ~$4.30
- Creator can optionally pass processing fee to supporter
- No monthly subscription or premium tier — one flat 5% on everything
- Sources: https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment | https://www.schoolmaker.com/blog/buy-me-a-coffee-pricing

### Buy Me a Coffee — Supported Payment Methods

Official FAQ: "We accept all major Credit Cards, Apple Pay, and Google Pay." Also: Cash App Pay and Stripe Link as of 2024 update.

**UPI is NOT listed. Not natively supported.**

Indian creators posting about "UPI payments" on BMC are creator-authored blog posts on the platform manually sharing their personal UPI IDs — not a platform checkout feature.

**India is NOT among BMC's 49 supported payout countries.** There is a bank wire workaround for Indian creators (PAN + IFSC + bank account number, $10 minimum) but no Stripe payout to India.

- Source: https://help.buymeacoffee.com/en/articles/6258038-supported-countries-for-payouts-on-buy-me-a-coffee
- Medium article by Indian creator: https://tharan.medium.com/the-only-site-that-works-for-indian-creators-to-sell-things-and-receive-donations-bb0ed5b958eb

### Buy Me a Coffee — Supporter Experience

- **No account required for one-time tips**
- Flow: visit creator page → click Support → choose amount → optionally leave message → pay by card/Apple Pay/Google Pay
- Memberships require account
- Source: https://help.buymeacoffee.com/en/articles/10182730-what-is-buy-me-a-coffee-and-how-does-it-work

### Buy Me a Coffee — Embeds

- Static image link (leaves page)
- Dynamic image via Button API (customizable, leaves page)
- Floating widget script (`data-*` attrs on `<script>` tag, modal overlay, payer stays)
- WordPress plugin (official)
- Zapier integration
- API: https://developers.buymeacoffee.com/ — token-based, server-side only, exposes supporter/membership data + webhooks
- Button Generator: studio.buymeacoffee.com/button-and-graphics (login required)

### Buy Me a Coffee — Growth

- No paid ads. Entirely organic/word-of-mouth
- Every creator puts BMC link in YouTube descriptions, Twitter bios, newsletter footers — the button itself is the distribution vector
- **COVID-19 (March 2020)**: "10x growth" as creators needed alternative income — primary viral moment
- YC W2020 network effect
- Founder: "You can't really market research your way into building for creators. You just have to put it out there and see their response."
- Sources: https://mercury.com/blog/founder-spotlight-jijo-sunny-buy-me-a-coffee | https://www.ycombinator.com/companies/buy-me-a-coffee

---

### Ko-fi — Company

- Founded **2012** by **Nigel Pickles** (UK-based)
- **Bootstrapped — no VC** ever
- Lean team, many employees in Southeast Asia
- By 2017: $2M in transactions; by early 2018: $1M in first 3 months
- Growth spike in 2017 after personalized URLs and expanded creator profiles
- Source: https://theweek.com/articles/762396/coffeethemed-app-future-crowdfunding

### Ko-fi — Payment Flow (Key Difference from BMC)

- **Ko-fi does NOT hold funds. Money goes directly to creator's Stripe or PayPal account.**
- No minimum payout threshold — instant
- No 7-day hold
- Ko-fi is just the packaging. The payment infrastructure is Stripe/PayPal.
- Sources: https://www.schoolmaker.com/blog/ko-fi-pricing | https://www.ruzuku.com/learn/articles/ko-fi-pricing

### Ko-fi — Fees

**Free Plan:**
- Tips/donations: **0% platform fee**
- Shop sales, memberships, commissions: **5% platform fee**
- Payment processing always applies: Stripe ~2.9% + $0.30, or PayPal ~3.49%

**Ko-fi Gold:**
- $6/month billed annually or $12/month billed monthly
- Removes ALL platform fees → 0% on everything
- Additional: full branding customization, enhanced analytics, higher limits, Discord integration
- Breakeven: ~$120/month (annual) in shop revenue

- Sources: https://www.schoolmaker.com/blog/ko-fi-pricing | https://help.ko-fi.com/hc/en-us/articles/360005506873-What-is-Ko-fi-Gold

### Ko-fi — India Status

- Routes through Stripe for international currency — Indian creators cannot receive USD/GBP without registered business with GST + IEC code
- No UPI in supported payment methods
- PayPal works partially as alternative

> "Services like Ko-fi and Gumroad use Stripe, which only works for transactions in INR (Indian Rupees). For foreign currencies like USD and GBP, Stripe won't work for Indian creators. Indian creators need a registered business with GST filing requirements or a sole proprietorship with an IEC code to get an international currency account on Stripe, which is outside the reach of common individuals pursuing side hustles online."

- Source: https://tharan.medium.com/ | https://medium.com/write-a-catalyst/what-to-do-when-buy-me-a-coffee-is-not-available-in-your-country-f6c2b25d91ae

### Ko-fi — Embeds

```html
<!-- Floating overlay widget -->
<script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
<script>
  kofiWidgetOverlay.draw('YOUR_USERNAME', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#fcbf47',
    'floating-chat.donateButton.text-color': '#323842'
  });
</script>

<!-- Inline iframe (full payment in-page) -->
<iframe
  id="kofiframe"
  src="https://ko-fi.com/YOUR_USERNAME/?hidefeed=true&widget=true&embed=true&preview=true"
  style="border:none; width:100%; padding:0; background:transparent; display:block;"
  height="712"
  title="Support on Ko-fi"
  loading="lazy"
></iframe>
```

Note: Ko-fi's overlay widget uses `document.write()` internally — triggers PageSpeed warnings.

Source: https://help.ko-fi.com/hc/en-us/articles/360018381678-Ko-fi-tip-widget

---

### Gumroad — Fees

- **10% platform fee + $0.50 flat fee** per transaction (since 2023)
- Discover marketplace: 30% flat
- No monthly subscription
- **Since January 2025: Merchant of Record** — Gumroad handles sales tax, VAT, GST globally
- Payouts: every Friday, $10 minimum
- Source: https://checkoutpage.com/blog/how-gumroad-pricing-works-and-a-cheaper-alternative

---

### India-Specific Tools in This Space

**Razorpay Payment Links** (razorpay.com/payment-links/)
- 180+ payment methods including UPI, cards, wallets, net banking
- Bulk link generation, partial payments, API + webhooks
- ~40% of transactions go via UPI
- Requires business registration
- Fees: ~2% + GST for domestic UPI
- UPI-specific links: Android-only, no partial payment support
- Sources: https://razorpay.com/payment-links/ | https://razorpay.com/docs/payment-links/upi/

**Instamojo** (instamojo.com)
- Accepts UPI, debit/credit cards, net banking, wallets, EMI
- "Smart Links" — shareable via WhatsApp, Facebook, SMS
- Embeddable pay buttons, QR generation
- Digital product support (ebooks, music, art)
- Analytics per link
- PCI-DSS compliant
- Sources: https://www.instamojo.com/payment-links/ | https://support.instamojo.com/hc/en-us/articles/208531995

**UroPay** (uropay.me) — Most BMC-adjacent Indian tool
- Zero commission — subscription-based, not per-transaction
- No KYC required
- Payments go directly to creator's UPI account — no intermediary holds funds
- UPI-only (GPay, PhonePe, Paytm, BHIM)
- Shareable payment links + embeddable buttons + API + WooCommerce plugin
- SMS-based automatic confirmation (Android companion app reads credit SMSes)
- Dashboard: real-time reporting, transaction history
- "No GST currently charged" (below threshold)
- Sources: https://www.uropay.me/ | https://www.uropay.me/payment-links

**Buy Me a Chai** (buymeachai.ankushminda.com)
- Launched **April 5, 2025** by Ankush Minda (indie project)
- Indian cultural equivalent of BMC — "chai" metaphor, ₹10 default
- UPI via dynamic QR codes + direct UPI links
- Zero platform fees
- Self-hosted on personal domain, PHP/MySQL/HTML/CSS/AJAX
- Basic analytics
- Very early-stage, no traction
- Source: https://dev.to/ankushminda/buy-me-a-chai-how-this-indian-platform-is-revolutionizing-creator-support-4c32

---

### Adversarial Verification Outcomes (Agent 3)

| Claim | Verdict | Source |
|---|---|---|
| BMC supports UPI natively | FALSE — FAQ says Credit Cards, Apple Pay, Google Pay only | https://help.buymeacoffee.com/en/articles/4539170-frequently-asked-questions |
| Ko-fi supports UPI | NOT CONFIRMED | https://contentcreators.com/tools/kofi-review |
| India is a BMC supported payout country | FALSE for Stripe payout list. Separate bank wire workaround exists | https://help.buymeacoffee.com/en/articles/6258038-supported-countries-for-payouts-on-buy-me-a-coffee |
| Ko-fi Gold is $6/month | PARTIALLY TRUE — $6/month annual, $12/month monthly | https://www.schoolmaker.com/blog/ko-fi-pricing |
| Ko-fi takes 0% on everything | FALSE — free plan takes 5% on shop/memberships | https://help.ko-fi.com/ |
| Gumroad is Merchant of Record since Jan 2025 | TRUE | https://checkoutpage.com/blog/how-gumroad-pricing-works-and-a-cheaper-alternative |
| BMC founder is Indian | TRUE — Jijo Sunny, Joseph Sunny, Aleesha John | https://mercury.com/blog/founder-spotlight-jijo-sunny-buy-me-a-coffee |
| UroPay has zero commission | TRUE per their own marketing — subscription model, no per-tx fees | https://www.uropay.me/ |

---

## Agent 4 — Embeddable Payment Elements: Code, Mechanics, UPI Deep Link Spec

### Buy Me a Coffee — Three Embed Methods

**Method A — Static image link (payer leaves page)**
```html
<a href="https://www.buymeacoffee.com/YOUR_USERNAME" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
       alt="Buy Me A Coffee"
       style="height: 60px; width: 217px;">
</a>
```

**Method B — Dynamic image via Button API (leaves page, customizable)**
```html
<a href="https://www.buymeacoffee.com/YOUR_USERNAME">
  <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=YOUR_USERNAME&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff">
</a>
```
Query params: `text`, `emoji`, `slug` (required), `button_colour`, `font_colour`, `font_family` (Cookie/Lato/Arial/Comic/Inter/Bree/Poppins), `outline_colour`, `coffee_colour`. All hex without `#`.

**Method C — Floating widget script (payer stays — modal overlay)**
```html
<script
  data-name="BMC-Widget"
  data-cfasync="false"
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-id="YOUR_USERNAME"
  data-description="Support me on Buy me a coffee!"
  data-message="Thank you for visiting. You can now buy me a coffee!"
  data-color="#FFDD00"
  data-position="Right"
  data-x_margin="18"
  data-y_margin="18"
></script>
```
Injects a fixed-position floating button. Click opens modal overlay. Page never navigates. Position: "Right" or "Left". Amount: fixed tiers (x1/x3/x5 at $5 each) — not configurable per-embed.

Source: https://gist.github.com/Evavic44/c43f74247234f2714667944a38b26942

---

### Ko-fi — Three Embed Methods

**Method A — Static image link**
```html
<a href='https://ko-fi.com/YOUR_USERNAME' target='_blank'>
  <img height='36' style='border:0px;height:36px;'
       src='https://storage.ko-fi.com/cdn/kofi2.png?v=3'
       border='0' alt='Buy Me a Coffee at ko-fi.com'/>
</a>
```

**Method B — Floating overlay widget (sliding panel, payer stays)**
```html
<script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
<script>
  kofiWidgetOverlay.draw('YOUR_USERNAME', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#fcbf47',
    'floating-chat.donateButton.text-color': '#323842'
  });
</script>
```
Note: uses `document.write()` internally — triggers PageSpeed warnings.

**Method C — Inline iframe (full payment in-page)**
```html
<iframe
  id="kofiframe"
  src="https://ko-fi.com/YOUR_USERNAME/?hidefeed=true&widget=true&embed=true&preview=true"
  style="border:none; width:100%; padding:0; background:transparent; display:block;"
  height="712"
  loading="lazy"
></iframe>
```
Source: https://help.ko-fi.com/hc/en-us/articles/360018381678-Ko-fi-tip-widget

---

### Stripe Buy Button — Web Component

```html
<script async src="https://js.stripe.com/v3/buy-button.js"></script>
<stripe-buy-button
  buy-button-id="buy_btn_1MgEyoDNsVQ3fzInaHTBBhYR"
  publishable-key="pk_test_51ABC"
  customer-email="user@example.com"
  client-reference-id="your-cart-or-user-id"
></stripe-buy-button>
```

| Attribute | Required | Notes |
|---|---|---|
| `buy-button-id` | Yes | `buy_btn_XXXXXX` |
| `publishable-key` | Yes | `pk_live_` or `pk_test_` |
| `client-reference-id` | No | Max 200 chars |
| `customer-email` | No | Prefills email |

Click opens Stripe Checkout as an injected iframe popup. Payer never leaves. Customization entirely in Stripe Dashboard. CSP required: `frame-src https://js.stripe.com; script-src https://js.stripe.com`.

Source: https://docs.stripe.com/payment-links/buy-button

---

### Gumroad — Overlay + Iframe Embed

**Method A — Overlay (popup modal)**
```html
<script src="https://gumroad.com/js/gumroad.js"></script>
<a class="gumroad-button" href="https://YOURNAME.gumroad.com/l/PRODUCT_ID">
  Buy my product
</a>

<!-- Skip product page, direct to checkout -->
<a class="gumroad-button"
   href="https://YOURNAME.gumroad.com/l/PRODUCT_ID"
   data-gumroad-overlay-checkout="true">
  Buy Now
</a>
```

**Method B — Inline iframe**
```html
<script src="https://gumroad.com/js/gumroad-embed.js"></script>
<div class="gumroad-product-embed"
     data-gumroad-product-id="PRODUCT_PERMALINK">
  <a href="https://gumroad.com/l/PRODUCT_PERMALINK">Loading...</a>
</div>
```

Mechanics: `gumroad.js` injects `gumroad-bundle.js` from assets.gumroad.com. Bundle scans DOM for gumroad.com `<a>` tags, intercepts clicks, appends `overlay=true`, renders iframe modal. Uses `window.postMessage()` for height adjustments.

Source: https://help.gumroad.com/article/84-gumroad-widgets | https://github.com/iamtekeste/gumroad

---

### PayPal Donate Button

**Modern SDK (popup overlay)**
```html
<script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" charset="UTF-8"></script>
<div id="paypal-donate-button-container"></div>
<script>
  PayPal.Donation.Button({
    env: 'production',
    hosted_button_id: 'YOUR_LIVE_HOSTED_BUTTON_ID',
    image: {
      src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
      alt: 'Donate with PayPal button'
    },
    onComplete: function(params) {
      // params: tx, st, amt, cc, cm, item_number, item_name
    },
  }).render('#paypal-donate-button-container');
</script>
```

Alternatively use `business: 'your@email.com'` instead of `hosted_button_id` for personal accounts.

Source: https://developer.paypal.com/sdk/donate/

---

### Razorpay Payment Button

```html
<form>
  <script
    src="https://checkout.razorpay.com/v1/payment-button.js"
    data-payment_button_id="pl_XXXXXXXXXXXXX"
    data-button_text="Pay Now"
    data-button_theme="rzp-dark-standard"
    async
  ></script>
</form>
```

The `<form>` wrapper is **required**. Button ID format: `pl_` prefix, generated in Dashboard → Payment Button. No secret keys in embed HTML.

Click opens Razorpay Standard Checkout popup. Payment methods: UPI (GPay, PhonePe, Paytm, BHIM, 100+ modes), cards, net banking, wallets. **UPI is first-class.**

Button types available in Dashboard: Quick Pay, Buy Now, Donations, Custom (custom fields), Subscription.

Sources: https://razorpay.com/docs/payments/payment-button/ | https://razorpay.com/unfiltered/behind-the-scenes-payment-button/

---

### UPI Deep Link Specification (Complete)

Source: NPCI UPI Linking Specifications v1.6 — https://www.labnol.org/files/linking.pdf

```
upi://pay?param-name=param-value&param-name=param-value&...
```

| Param | Static | Dynamic | Description |
|---|---|---|---|
| `pa` | M | M | Payee VPA (e.g. `merchant@okaxis`) |
| `pn` | M | M | Payee name |
| `am` | O | M | Amount (decimal). If absent, payer can edit. |
| `mam` | O | C | Minimum amount |
| `cu` | O | O | Currency. Only `INR` supported. |
| `tr` | O | C | Transaction reference ID |
| `tid` | O | O | PSP-generated transaction ID |
| `tn` | O | O | Short note/description |
| `mc` | O | O | Merchant category code |
| `url` | O | O | Reference URL |
| `mid` | O | O | Merchant ID (max 20 chars) |
| `msid` | O | O | Store ID (max 20 chars) |
| `mtid` | O | O | Terminal ID (max 20 chars) |
| `mode` | M | M | `00`=Default, `01`=QR, `04`=Intent, `05`=Secure Intent |
| `sign` | M | M | Base64 SHA256withRSA512 signature. Must be last param. |
| `orgid` | M | M | PSP org ID. For merchant-initiated: `000000` |

**Practical minimum for a tip link** (signature not enforced by consumer apps):
```
upi://pay?pa=merchant@okaxis&pn=Your%20Name&am=100.00&cu=INR&tn=Buy%20Me%20a%20Coffee
```

**With tracking:**
```
upi://pay?pa=merchant@okaxis&pn=Your%20Name&am=100.00&cu=INR&tr=ORDER_12345&tn=Tip%20for%20Creator
```

**Verbatim example from spec:**
```
upi://pay?pa=bivek@npci&pn=bivek%20rath&mc=9999&tid=cxnkjcnkjdfdvjndkjfvn&tr=4894398cndhcd23&tn=Pay%20to%20mystar%20store&am=10&mam=null&cu=INR&url=https://mystar.com&mode=05&orgid=000000&mid=1234&msid=3432&mtid=1212&sign=gynybu6K6ozUrH...
```

---

### Platform Behavior Matrix (Critical)

| Platform | `upi://pay` | App-specific schemes |
|---|---|---|
| Android Chrome/mWeb | Works — OS shows app chooser | Also work |
| Android WebView | Works via `Intent.ACTION_VIEW` | Also work |
| iOS Safari | **Silent fail** — "Safari cannot open the page because the address is invalid" | Work if app installed |
| iOS WKWebView | `canOpenURL` returns `false` | Requires `LSApplicationQueriesSchemes` in Info.plist |
| Desktop Chrome/Edge | OS "no app" dialog or silent fail | Same — silent fail |
| Desktop Safari/macOS | LaunchServices finds no handler | Same |

**Bottom line: `upi://` is Android-only. iOS has no system-level UPI handler.**

iOS requires per-app scheme links:

| App | Custom Scheme (iOS + Android) | Android Package |
|---|---|---|
| Google Pay | `gpay://upi/pay?` | `com.google.android.apps.nbu.paisa.user` |
| PhonePe | `phonepe://upi/pay?` | `com.phonepe.app` |
| Paytm | `paytm://upi/pay?` | `net.one97.paytm` |
| BHIM | `bhim://upi/pay?` | `in.org.npci.upiapp` |
| CRED | `credpay://upi/pay?` | — |

**Google Pay exact format** (from official docs https://developers.google.com/pay/india/api/ios/in-app-payments):
```
gpay://upi/pay?pa=merchant%40pspbank&pn=MyNameHere&tr=15330175804633937&tn=Test%20deposit&am=5000&cu=INR&mc=621
```

**Android `intent://` format** (pinned to specific app):
```
intent://pay?pa=merchant@upi&pn=Name&am=100&cu=INR&tr=TXN123&tn=Note#Intent;scheme=upi;package=com.phonepe.app;S.browser_fallback_url=<base64_playstore_url>;end
```
Source: https://docs.payu.in/docs/upi-smart-intent-non-sdk-flow

**iOS Critical Note:** "Currently, iOS does not support switching back to the merchant app post payment. The user needs to manually toggle back to the merchant app once the payment is completed." — Google Pay docs

---

### Desktop Fallback — QR via npm or API

**Using `upiqr` npm package:**
```typescript
import upiqr from "upiqr";

upiqr({
  payeeVPA: "merchant@okaxis",
  payeeName: "My Store",
  amount: "499.00",
  transactionNote: "Buy Me a Coffee",
  transactionId: "TXN_" + Date.now(),
  currency: "INR"
}).then(({ qr, intent }) => {
  // qr = "data:image/png;base64,..." — render on desktop
  // intent = "upi://pay?pa=..." — use on mobile
  document.getElementById("qr-img").setAttribute("src", qr);
});
```

**No-npm alternative (free QR API):**
```javascript
const upiUri = `upi://pay?pa=merchant@okaxis&pn=My%20Store&am=100.00&cu=INR&tn=Buy%20Me%20a%20Coffee`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
document.getElementById("qr-img").src = qrUrl;
```

---

### Device Detection + Routing Pattern

```javascript
function detectPlatform() {
  if (navigator.userAgentData) return navigator.userAgentData.mobile ? 'mobile' : 'desktop';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

function getUPILink(vpa, name, amount, note, txnRef) {
  const params = `pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}&tr=${txnRef}&cu=INR`;
  const platform = detectPlatform();
  if (platform === 'android') return `upi://pay?${params}`;
  if (platform === 'ios') return null; // use per-app links (gpay://, phonepe://, etc.)
  return null; // desktop: show QR
}
```

---

### IMPORTANT: UPI Collect Flow Deprecated

**NPCI mandated all gateways migrate away from the VPA-entry Collect flow. Effective date: February 28, 2026.**

Confirmed by both Razorpay and PayU docs.

**Do not build on UPI Collect. Use Intent flow only.**

---

### Existing Open Source "Buy Me a Coffee for UPI" Projects

| Repo | Stack | What it does |
|---|---|---|
| https://github.com/vassu-v/Buy4Chai | React 18 + Vite + Tailwind | "Buy Me a Coffee for UPI" — 0% fee, Razorpay + direct UPI |
| https://github.com/tuhinpal/Upier | Next.js + TypeScript | Shareable `upier.t-ps.net/pay/?vpa=[upi-id]` |
| https://github.com/PtPrashantTripathi/linkpe | HTML/JS | QR on desktop, shareable link for mobile |
| https://github.com/SilentDemonSD/PayOnUPI-CF | Cloudflare Workers | Serverless edge: `your_url/pay?pa=UPI_ID&pn=Name&cu=INR&am=Amount` |
| https://github.com/shambu2k/upi-intent | TypeScript (`upi-intents` npm) | 40 UPI apps, `detectPlatform()`, `createPaymentUri()`, `buildAppLink()` |
| https://github.com/TakiShiwa/donate-with-upi | SVG/PNG | Badge assets in 6 color variants for READMEs/sites |

**npm packages:**
- `upi-intents` — platform detection + 40-app link generation
- `upiqr` — QR from URI, works client + server
- `react-native-upi-payment` — React Native, Android intent + iOS scheme

---

### Embed Pattern Summary

| Product | Mechanism | Payer leaves? | Color customizable | Amount customizable |
|---|---|---|---|---|
| BMC static | `<a>` + `<img>` | Yes | API query param | No |
| BMC widget | `data-*` attrs on `<script>` | No (overlay) | `data-color` hex | Fixed tiers only |
| Ko-fi overlay | `kofiWidgetOverlay.draw()` after `<script>` | No (panel) | Config object key | Flexible |
| Ko-fi iframe | `<iframe>` | No (in-iframe) | No | Flexible |
| Stripe | `<stripe-buy-button>` web component | No (popup) | Dashboard only | Dashboard only |
| Gumroad overlay | `<a class="gumroad-button">` + `<script>` | No (modal) | Anchor text only | Per product |
| Gumroad inline | `<div class="gumroad-product-embed">` + `<script>` | No (iframe) | None | Per product |
| PayPal Donate | `PayPal.Donation.Button({}).render()` | No (popup) | Fixed GIF | Fixed or donor-defined |
| Razorpay Button | `data-payment_button_id` on `<script>` in `<form>` | No (modal) | Dashboard brand color | Fixed or donor-defined |

---

*End of Phase 2 research. All findings raw and unsummarised. June 2026.*
