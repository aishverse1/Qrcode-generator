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
