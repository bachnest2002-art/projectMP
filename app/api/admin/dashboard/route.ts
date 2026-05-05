import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const activePortfolios = await prisma.portfolio.count({
      where: { is_active: true, created_by: user.id },
    })

    const inactivePortfolios = await prisma.portfolio.count({
      where: { is_active: false, created_by: user.id },
    })

    const nearingEnd = await prisma.portfolio.findMany({
      where: {
        is_active: true,
        end_date: {
          lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        },
        created_by: user.id,
      },
      include: { user: { select: { mobile: true, email: true } } },
    })

    const noInitialValue = await prisma.portfolio.findMany({
      where: {
        is_active: true,
        initial_value: null,
        created_by: user.id,
      },
      include: { user: { select: { mobile: true, email: true } } },
    })

    return NextResponse.json({
      activePortfolios,
      inactivePortfolios,
      nearingEnd,
      noInitialValue,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}