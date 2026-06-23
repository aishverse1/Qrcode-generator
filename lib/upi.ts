// UPI deep-link builder + VPA validator (NPCI compliant)

export function buildUpiLink(params: {
  vpa: string
  businessName: string
  amount?: number | null
  remarkCode: string
}): string {
  const { vpa, businessName, amount, remarkCode } = params
  const encodedName = encodeURIComponent(businessName)
  const encodedRemark = encodeURIComponent(remarkCode)

  // NPCI UPI deep-link format
  let link = `upi://pay?pa=${vpa}&pn=${encodedName}&tn=${encodedRemark}&cu=INR`
  if (amount && amount > 0) {
    link += `&am=${amount.toFixed(2)}`
  }
  return link
}

export function isValidVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa)
}

export const BANK_HANDLES = [
  '@okhdfcbank',
  '@okaxis',
  '@ybl',
  '@paytm',
  '@oksbi',
  '@ibl',
]

export function generateRemarkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `UPAY-${suffix}`
}