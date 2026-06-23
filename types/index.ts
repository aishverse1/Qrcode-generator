export interface Merchant {
  uid: string
  phone: string
  businessName: string
  email: string
  vpa: string
  createdAt: Date
}

export interface Transaction {
  id: string
  merchantUid: string
  remarkCode: string
  token: string
  amount: number | null
  payerName: string | null
  payerVpa: string | null
  status: 'pending' | 'settled' | 'expired' | 'failed'
  createdAt: Date
  settledAt: Date | null
}

export interface PaymentLink {
  token: string
  merchantUid: string
  amount: number | null
  remarkCode: string
  createdAt: Date
}