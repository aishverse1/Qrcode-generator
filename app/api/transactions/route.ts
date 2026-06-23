import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const remarkCode = searchParams.get('remarkCode')

  // In production: query Firestore
  // const tx = await getTransaction(remarkCode)

  // Demo response
  return NextResponse.json({
    remarkCode,
    status: 'pending',
    // tx data would be returned here
  })
}