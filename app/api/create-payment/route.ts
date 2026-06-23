import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { generateRemarkCode } from '@/lib/upi'

export async function POST(req: NextRequest) {
  try {
    const { merchantUid, amount } = await req.json()

    if (!merchantUid) {
      return NextResponse.json({ error: 'merchantUid is required' }, { status: 400 })
    }

    const id = `TX-${nanoid(6).toUpperCase()}`
    const remarkCode = generateRemarkCode()
    const token = nanoid(10)

    return NextResponse.json({
      id,
      remarkCode,
      token,
      amount: amount || null,
      status: 'pending',
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}