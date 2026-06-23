import { nanoid } from 'nanoid'
import { db } from './firebase-admin'

/**
 * Payment data stored in Firestore, keyed by a random 8-char token.
 * No HMAC needed — data lives server-side, token is just a random lookup key.
 */
export interface StoredPaymentData {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  createdAt: number
}

/**
 * Create a payment token and store data in Firestore.
 * URL becomes /pay/{token} where token is an 8-char random string.
 */
export async function createSignedPaymentToken(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}): Promise<{ token: string }> {
  const token = nanoid(8)

  await db.collection('payments').doc(token).set({
    ...data,
    createdAt: Date.now(),
  })

  return { token }
}

/**
 * Verify a payment token by looking it up in Firestore.
 * Returns the payment data if found, null otherwise.
 */
export async function verifySignedPaymentToken(token: string): Promise<{
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
} | null> {
  const doc = await db.collection('payments').doc(token).get()

  if (!doc.exists) return null

  const data = doc.data() as StoredPaymentData

  return {
    vpa: data.vpa,
    businessName: data.businessName,
    amount: data.amount,
    remarkCode: data.remarkCode,
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
