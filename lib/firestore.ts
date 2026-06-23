import { Merchant, Transaction } from '@/types'

// In-memory store for demo (replace with Firestore in production)
const merchants = new Map<string, Merchant>()
const transactions = new Map<string, Transaction>()

export async function getMerchant(uid: string): Promise<Merchant | null> {
  return merchants.get(uid) || null
}

export async function createMerchant(merchant: Merchant): Promise<void> {
  merchants.set(merchant.uid, merchant)
}

export async function updateMerchant(uid: string, data: Partial<Merchant>): Promise<void> {
  const existing = merchants.get(uid)
  if (existing) {
    merchants.set(uid, { ...existing, ...data })
  }
}

export async function getTransaction(remarkCode: string): Promise<Transaction | null> {
  const all = Array.from(transactions.values())
  return all.find(tx => tx.remarkCode === remarkCode) || null
}

export async function getTransactionsByMerchant(merchantUid: string): Promise<Transaction[]> {
  const all = Array.from(transactions.values())
  return all
    .filter(tx => tx.merchantUid === merchantUid)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function createTransaction(tx: Transaction): Promise<void> {
  transactions.set(tx.id, tx)
}

export async function updateTransaction(id: string, data: Partial<Transaction>): Promise<void> {
  const existing = transactions.get(id)
  if (existing) {
    transactions.set(id, { ...existing, ...data })
  }
}

export async function getTransactionByToken(token: string): Promise<Transaction | null> {
  const all = Array.from(transactions.values())
  return all.find(tx => tx.token === token) || null
}