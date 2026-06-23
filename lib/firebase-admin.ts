import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getDb() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
    if (!serviceAccount) {
      throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT is not set')
    }
    initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    })
  }
  return getFirestore()
}

export const db = getDb()
