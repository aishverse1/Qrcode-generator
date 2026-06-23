import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function initFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0]

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!serviceAccount) {
    throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT is not set in environment variables')
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  })
}

initFirebaseAdmin()

export const db = getFirestore()
