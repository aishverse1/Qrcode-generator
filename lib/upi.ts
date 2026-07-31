// UPI deep-link builder + VPA validator (NPCI compliant)

export const MOBILE_UA_REGEX = /Android|iPhone|iPod|iPad|Mobile|webOS|BlackBerry|Opera Mini|IEMobile|Kindle/i

export function buildUpiLink(params: {
  vpa: string
  businessName: string
  amount?: number | null
  remarkCode: string
}): string {
  const { vpa, businessName, amount, remarkCode } = params
  const encodedVpa = encodeURIComponent(vpa)
  const encodedName = encodeURIComponent(businessName)
  const encodedRemark = encodeURIComponent(remarkCode)

  // NPCI UPI deep-link format
  let link = `upi://pay?pa=${encodedVpa}&pn=${encodedName}&tn=${encodedRemark}&cu=INR`
  if (amount && amount > 0) {
    link += `&am=${amount.toFixed(2)}`
  }
  return link
}

export function isValidVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa)
}

export function getCleanOrigin(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (typeof window === 'undefined') return 'https://upidirectpay.com'
  return window.location.origin
}

/** Per-app UPI intent-link builders, shared by QrCard and MobileRedirect. */
export const UPI_APPS = [
  {
    name: 'Google Pay',
    shortName: 'GPay',
    brandColor: '#4285F4',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end` : `gpay://upi/pay?${qs}`
    }
  },
  {
    name: 'PhonePe',
    shortName: 'PhonePe',
    brandColor: '#5F259F',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=com.phonepe.app;end` : `phonepe://pay?${qs}`
    }
  },
  {
    name: 'Paytm',
    shortName: 'Paytm',
    brandColor: '#00B9F1',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=net.one97.paytm;end` : `paytmmp://pay?${qs}`
    }
  },
  {
    name: 'BHIM UPI',
    shortName: 'BHIM',
    brandColor: '#00784A',
    buildLink: (vpa: string, name: string, amount: number | null, isAndroid: boolean) => {
      const qs = `pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&cu=INR${amount ? `&am=${amount.toFixed(2)}` : ''}`
      return isAndroid ? `intent://pay?${qs}#Intent;scheme=upi;package=in.org.npci.upiapp;end` : buildUpiLink({ vpa, businessName: name, amount, remarkCode: 'UPIDirectPay' })
    }
  },
]

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

