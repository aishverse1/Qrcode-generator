import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { generateRemarkCode } from '@/lib/upi'
import { db } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { vpa, businessName, amount } = await req.json()

    if (!vpa || !businessName) {
      return NextResponse.json({ error: 'vpa and businessName are required' }, { status: 400 })
    }

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
