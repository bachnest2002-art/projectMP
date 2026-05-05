import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { start_date, end_date, is_complimentary } = await request.json()
    const userId = parseInt(params.id)

    const customer = await prisma.user.findUnique({
      where: { id: userId, role: 'customer' },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    if (!is_complimentary && (!customer.bank_name || !customer.account_number || !customer.utr_number)) {
      return NextResponse.json({ error: 'Payment details required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        user_id: userId,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        is_complimentary,
        created_by: user.id,
      },
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(params.id)

    const portfolios = await prisma.portfolio.findMany({
      where: { user_id: userId },
    })

    return NextResponse.json({ portfolios })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}