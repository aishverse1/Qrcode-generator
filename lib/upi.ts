// UPI deep-link builder + VPA validator (NPCI compliant)

export const MOBILE_UA_REGEX = /Android|iPhone|iPod|iPad|Mobile|webOS|BlackBerry|Opera Mini|IEMobile|Kindle/i

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
  // Google Pay / PhonePe / Paytm top handles
  '@oksbi',
  '@okhdfcbank',
  '@okaxis',
  '@okicici',
  '@ybl',          // PhonePe / Yes Bank
  '@ibl',          // PhonePe / IndusInd
  '@axl',          // PhonePe / Axis
  '@paytm',
  '@pthdfc',       // Paytm HDFC
  '@ptaxis',       // Paytm Axis
  '@ptsbi',        // Paytm SBI
  // Major bank handles
  '@sbi',
  '@hdfc',
  '@icici',
  '@axis',
  '@kotak',
  '@upi',          // BHIM
  '@apl',          // Amazon Pay
  '@waaxis',       // WhatsApp Pay Axis
  '@wahdfcbank',   // WhatsApp Pay HDFC
  '@rbl',
  '@idbi',
  '@federal',
  '@ikwik',        // MobiKwik
  '@freecharge',
]

export function generateRemarkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `UPAY-${suffix}`
}