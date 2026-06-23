import { nanoid } from 'nanoid'

const TOKEN_SECRET = process.env.TOKEN_SECRET || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

export function generateToken(): string {
  return nanoid(10)
}

export function createOpaqueToken(merchantUid: string, txId: string): string {
  const payload = `${merchantUid}:${txId}:${Date.now()}`
  const base = Buffer.from(payload).toString('base64url')
  const signature = Buffer.from(`${base}${TOKEN_SECRET}`).toString('base64url').slice(0, 8)
  return `${base}-${signature}`
}

/** Encode payment data into a URL-safe base64 string */
export function encodePaymentData(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
}): string {
  return btoa(JSON.stringify(data))
}

/** Decode payment data from a base64 URL param */
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