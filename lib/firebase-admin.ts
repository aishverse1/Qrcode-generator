import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let _db: ReturnType<typeof getFirestore> | null = null

function getDb() {
  if (_db) return _db

  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
    if (!serviceAccount) {
      throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT is not set')
    }
    initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    })
  }

  _db = getFirestore()
  return _db
}

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop)
  },
})
