import { nanoid } from 'nanoid'
import { createHmac } from 'crypto'

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default-secret-change-in-production'

// In-memory store for payment data (keyed by token)
// In production, replace with Firestore or a proper database
const paymentStore = new Map<string, {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  createdAt: number
}>()

export function generateToken(): string {
  return nanoid(10)
}

/**
 * Create a tamper-proof signed payment token.
 * Returns { token, signature } — URL becomes /pay/{token}.{signature}
 */
export function createSignedPaymentToken(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}): { token: string; signature: string } {
  // Generate 8-char token
  const token = nanoid(8)

  // Store payment data server-side
  paymentStore.set(token, {
    ...data,
    createdAt: Date.now(),
  })

  // Sign the token with HMAC-SHA256
  const signature = createHmac('sha256', TOKEN_SECRET)
    .update(token)
    .digest('hex')
    .slice(0, 8)

  return { token, signature }
}

/**
 * Verify a signed payment token and return the payment data.
 * Returns null if token is invalid or tampered.
 */
export function verifySignedPaymentToken(token: string, signature: string): {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
} | null {
  // Compute expected signature
  const expectedSignature = createHmac('sha256', TOKEN_SECRET)
    .update(token)
    .digest('hex')
    .slice(0, 8)

  // Constant-time comparison to prevent timing attacks
  if (expectedSignature.length !== signature.length) return null
  let mismatch = 0
  for (let i = 0; i < expectedSignature.length; i++) {
    mismatch |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  if (mismatch !== 0) return null

  // Look up stored payment data
  const paymentData = paymentStore.get(token)
  if (!paymentData) return null

  return {
    vpa: paymentData.vpa,
    businessName: paymentData.businessName,
    amount: paymentData.amount,
    remarkCode: paymentData.remarkCode,
  }
}

/** Legacy base64 encode/decode — kept for backward compatibility */
export function encodePaymentData(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}): string {
  return btoa(JSON.stringify(data))
}

export function decodePaymentData(encoded: string): {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
} | null {
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return null
  }
}