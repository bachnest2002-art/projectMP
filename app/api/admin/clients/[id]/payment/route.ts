import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bank_name, payment_date, account_number, utr_number } = await request.json()
    const userId = parseInt(params.id)

    await prisma.user.update({
      where: { id: userId, role: 'customer' },
      data: {
        bank_name,
        payment_date: new Date(payment_date),
        account_number,
        utr_number,
      },
    })

    return NextResponse.json({ message: 'Payment details updated' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment details' }, { status: 500 })
  }
}