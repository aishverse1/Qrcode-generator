// lib/firestore.ts
import { db } from './firebase-admin'
import { Merchant, Transaction } from '@/types'

// ── Merchants ──────────────────────────────────────────

export async function getMerchant(uid: string): Promise<Merchant | null> {
  const doc = await db.collection('merchants').doc(uid).get()
  if (!doc.exists) return null
  return doc.data() as Merchant
}

export async function createMerchant(merchant: Merchant): Promise<void> {
  await db.collection('merchants').doc(merchant.uid).set(merchant)
}

export async function updateMerchant(uid: string, data: Partial<Merchant>): Promise<void> {
  await db.collection('merchants').doc(uid).update(data)
}

// ── Transactions ───────────────────────────────────────

export async function getTransaction(remarkCode: string): Promise<Transaction | null> {
  const snap = await db.collection('transactions')
    .where('remarkCode', '==', remarkCode)
    .limit(1)
    .get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { ...doc.data(), id: doc.id } as Transaction
}

export async function getTransactionsByMerchant(merchantUid: string): Promise<Transaction[]> {
  const snap = await db.collection('transactions')
    .where('merchantUid', '==', merchantUid)
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Transaction)
}

export async function createTransaction(tx: Transaction): Promise<void> {
  // Store createdAt as Firestore Timestamp for orderBy to work
  await db.collection('transactions').doc(tx.id).set({
    ...tx,
    createdAt: tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt),
  })
}

export async function updateTransaction(id: string, data: Partial<Transaction>): Promise<void> {
  await db.collection('transactions').doc(id).update(data)
}

export async function getTransactionByToken(token: string): Promise<Transaction | null> {
  const snap = await db.collection('transactions')
    .where('token', '==', token)
    .limit(1)
    .get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { ...doc.data(), id: doc.id } as Transaction
}