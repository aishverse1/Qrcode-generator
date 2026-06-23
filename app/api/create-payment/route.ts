import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { generateRemarkCode } from '@/lib/upi'

export async function POST(req: NextRequest) {
  try {
    const { vpa, businessName, amount } = await req.json()

    if (!vpa || !businessName) {
      return NextResponse.json({ error: 'vpa and businessName are required' }, { status: 400 })
    }

    // Dynamic import so firebase-admin only loads at runtime, not build time
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    const { getFirestore } = await import('firebase-admin/firestore')

    if (getApps().length === 0) {
      const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
      if (!serviceAccount) {
        return NextResponse.json({ error: 'FIREBASE_ADMIN_SERVICE_ACCOUNT not configured' }, { status: 500 })
      }
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      })
    }

    const db = getFirestore()
    const remarkCode = generateRemarkCode()
    const token = nanoid(8)

    await db.collection('payments').doc(token).set({
      vpa,
      businessName,
      amount: amount ?? null,
      remarkCode,
      createdAt: Date.now(),
    })

    return NextResponse.json({ token })
  } catch (err) {
    console.error('create-payment error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
