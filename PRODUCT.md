# Product

## Register

product

## Users

Small merchants and self-employed professionals in India — shop owners, freelancers, kabadiwalas, freelancers, small business owners. They use their phone as their primary device. They are payment-technology novices; they have a UPI app on their phone but don't think of themselves as "tech people." Their core job: generate a payment link or QR code and share it with a customer, fast, without losing confidence in the process. Trustworthiness of the interface directly affects whether a customer pays.

## Product Purpose

UPIDirectPay lets any merchant collect UPI payments with zero commission by generating shareable links and QR codes that deep-link directly into the customer's UPI app (Google Pay, PhonePe, Paytm, BHIM). The merchant pastes their VPA, sets an optional amount, and gets a URL. The customer scans or taps and pays instantly — money lands in the merchant's bank account with no intermediary.

Core success metric: a merchant creates a link and a customer completes a payment.

## Brand Personality

**Friendly · Modern · Approachable**

The tone is warm but competent — like a helpful neighbourhood bank teller who speaks simply. Not startup-flashy, not corporate-cold. Every screen should feel like it was made by someone who genuinely wants the merchant to succeed. Copy is plain English, never jargon. The product is zero-commission and that is always front and centre.

## Anti-references

- **AI-slop gradients.** Purple→blue diagonal gradients and violet-on-dark hero sections. These signal "prototype written by AI," not "payment product I trust with my money." Any gradient use must be subtle and purposeful, not decorative.
- **Purple-heavy palette.** Violet and purple as a dominant brand colour. The product needs to feel trustworthy and financial, not playful or psychedelic. If purple appears, it must be a single restrained accent, not the primary brand colour.
- **Overused typefaces.** Inter (ubiquitous in AI output), Roboto (Google default), Fraunces, Geist, Space Grotesk. Pick something with genuine personality — a typeface that could not appear in an AI generation without being a deliberate choice.
- **Warm-cream body backgrounds.** The entire near-white warm-neutral band (cream / sand / parchment) is the 2026 AI default. A payment product needs either a true neutral white, a brand-tinted off-white, or a mid-tone background — never an accidental warm-beige.
- **Bounce and elastic easing.** `cubic-bezier(0.34, 1.56, 0.64, 1)` and CSS `animate-bounce` feel dated and cheap. Real objects decelerate smoothly. Use exponential ease-out only.
- **Decorative glassmorphism.** Blur-backed cards used decoratively rather than to solve a specific layering problem.
- **Identical card grids.** Cards with equal dimensions, repeating the same icon + heading + body pattern. Cards earn their place when they group related information meaningfully.

## Design Principles

1. **Trust is the product.** Every design decision either builds or erodes the merchant's confidence that this will work and their money is safe. If something feels uncertain or unfinished, fix it before shipping.
2. **Zero commission is the headline.** Not a footnote, not fine print. It should appear on every relevant screen as a plain fact, not a marketing claim.
3. **Plain English everywhere.** No payment jargon on merchant-facing screens. Say "Customers can pay using Google Pay, PhonePe, Paytm or BHIM" not "Supported PSPs include UPI NPSI-compliant apps."
4. **Mobile-first for the merchant.** The merchant creates links on their phone. Every workflow must be usable with one thumb.
5. **Clarity over density.** Prefer a clean single-column form over a compact two-column layout. White space is not wasted space — it signals professionalism.

## Accessibility & Inclusion

- WCAG 2.1 AA target. All interactive elements keyboard-accessible and screen-reader labelled.
- Form error messages must be specific ("Enter a valid VPA like yourname@oksbi") not generic ("Invalid input").
- Colour is never the sole means of conveying state — always paired with text or icon.
- Reduced-motion respected: no auto-playing ribbon animations, no bounce.
- Contrast: body text ≥ 4.5:1 against background; large text ≥ 3:1.
