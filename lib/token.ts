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
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse((process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) as string)
    } else {
      const { readFileSync } = await import('fs')
      const path = await import('path')
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json')
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    }
    initializeApp({ credential: cert(serviceAccount) })
  }
  return getFirestore()
}

// ── Token create / verify ─────────────────────────────────

const TOKEN_LENGTH = 8
const MAX_CREATE_ATTEMPTS = 3

/**
 * Create a payment token and store data in Firestore.
 * URL becomes /{token}. Not cryptographically signed — the token is just
 * an unguessable Firestore document id; "create" means "wrote this doc".
 */
export async function createPaymentToken(data: {
  vpa: string
  businessName: string
  amount: number | null
  remarkCode: string
  merchantUid?: string
}): Promise<{ token: string }> {
  const db = await getDb()

  for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
    const token = nanoid(TOKEN_LENGTH)
    try {
      // .create() (not .set()) fails if the doc already exists, so a
      // collision retries with a fresh token instead of overwriting data.
      await db.collection('payments').doc(token).create({
        ...data,
        createdAt: Date.now(),
      })
      return { token }
    } catch (err: any) {
      if (err?.code === 6 /* ALREADY_EXISTS */ && attempt < MAX_CREATE_ATTEMPTS - 1) continue
      throw err
    }
  }
  throw new Error('Failed to generate a unique payment token')
}

/**
 * Look up a payment token in Firestore.
 * Returns the payment data if found, null otherwise.
 */
export async function verifyPaymentToken(token: string): Promise<{
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
