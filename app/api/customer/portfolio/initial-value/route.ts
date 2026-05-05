import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { initial_value } = await request.json()

    if (initial_value < 500000) {
      return NextResponse.json({ error: 'Minimum portfolio value is Rs. 500000' }, { status: 400 })
    }

    // Find active portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { user_id: user.id, is_active: true },
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'No active portfolio found' }, { status: 404 })
    }

    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { initial_value, current_value: initial_value },
    })

    // Invest in Liquid BeES
    // For simplicity, assume Liquid BeES is a stock with symbol 'LIQUIDBEES'
    // But since no stock created, skip for now.

    return NextResponse.json({ message: 'Portfolio value set' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set portfolio value' }, { status: 500 })
  }
}