import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { user_id: user.id, is_active: true },
      include: { stocks: true },
    })

    if (!portfolio || !portfolio.initial_value) {
      return NextResponse.json({ error: 'Portfolio not set up' }, { status: 404 })
    }

    // Mock calculations - in real app, calculate from data
    const data = {
      startDate: portfolio.start_date.toISOString().split('T')[0],
      initialValue: portfolio.initial_value,
      currentValue: portfolio.current_value || portfolio.initial_value,
      absoluteProfit: (portfolio.current_value || portfolio.initial_value) - portfolio.initial_value,
      absoluteReturns: ((portfolio.current_value || portfolio.initial_value) / portfolio.initial_value - 1) * 100,
      cagr: 10, // mock
      nifty50Returns: 8,
      nifty50Cagr: 7,
      niftySmallcap50Returns: 12,
      niftySmallcap50Cagr: 9,
      mdd: -5,
      mddRecovery: 3,
      returnToMdd: 2,
      calmarRatio: 2,
      returnsGraph: [], // mock
      industryPie: [], // mock
      trades: portfolio.stocks.length,
      winRate: 60,
      riskReward: 1.5,
      avgHolding: 30,
      profitFactor: 1.2,
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio overview' }, { status: 500 })
  }
}