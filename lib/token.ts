import { nanoid } from 'nanoid'

// ── Types ─────────────────────────────────────────────────

export interface StoredPaymentData {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  createdAt: number
  merchantUid?: string
}

// ── Dynamic Firestore helpers ─────────────────────────────

async function getDb() {
  const { initializeApp, getApps, cert } = await import('firebase-admin/app')
  const { getFirestore } = await import('firebase-admin/firestore')
  if (getApps().length === 0) {
    const { readFileSync } = await import('fs')
    const path = await import('path')
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json')
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    initializeApp({ credential: cert(serviceAccount) })
  }
  return getFirestore()
}

// ── Token create / verify ─────────────────────────────────

/**
 * Create a payment token and store data in Firestore.
 * URL becomes /pay/{token} where token is an 8-char random string.
 */
export async function createSignedPaymentToken(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  merchantUid?: string
}): Promise<{ token: string }> {
  const db = await getDb()
  const token = nanoid(6)

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
  merchantUid?: string
} | null> {
  const db = await getDb()
  const doc = await db.collection('payments').doc(token).get()

  if (!doc.exists) return null

  const data = doc.data() as StoredPaymentData

  return {
    vpa: data.vpa,
    businessName: data.businessName,
    amount: data.amount,
    remarkCode: data.remarkCode,
    merchantUid: data.merchantUid,
  }
}
