import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple engine logic
export async function POST(request: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's recommendations
    const recommendations = await prisma.recommendation.findMany({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: { stock: true },
    })

    // Group by action
    const buys = recommendations.filter(r => r.action === 'buy')
    const sells = recommendations.filter(r => r.action === 'sell')

    // Process sells first
    for (const sell of sells) {
      // Find portfolios with this stock
      const holdings = await prisma.portfolioStock.findMany({
        where: { stock_id: sell.stock_id, sell_date: null },
        include: { portfolio: true },
      })

      for (const holding of holdings) {
        // Sell logic - update sell_date, calculate profit, invest in Liquid BeES
        await prisma.portfolioStock.update({
          where: { id: holding.id },
          data: { sell_date: today, sell_price: 100 }, // mock price
        })

        // Update portfolio current_value
        const profit = (100 - holding.buy_price) * holding.quantity // mock
        await prisma.portfolio.update({
          where: { id: holding.portfolio_id },
          data: { current_value: { increment: profit } },
        })

        // Invest in Liquid BeES - mock
      }
    }

    // Then buys
    for (const buy of buys) {
      // Find active portfolios
      const portfolios = await prisma.portfolio.findMany({
        where: { is_active: true },
      })

      for (const portfolio of portfolios) {
        if (!portfolio.current_value) continue

        const maxStocks = 50
        const currentStocks = await prisma.portfolioStock.count({
          where: { portfolio_id: portfolio.id, sell_date: null },
        })

        if (currentStocks >= maxStocks) continue

        const capitalPerStock = portfolio.current_value / 50
        // Buy if enough capital
        // Mock buy
        await prisma.portfolioStock.create({
          data: {
            portfolio_id: portfolio.id,
            stock_id: buy.stock_id,
            quantity: Math.floor(capitalPerStock / 100), // mock price
            buy_price: 100,
            buy_date: today,
          },
        })

        // Update current_value
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { current_value: { decrement: capitalPerStock } },
        })
      }
    }

    return NextResponse.json({ message: 'Engine run completed' })
  } catch (error) {
    return NextResponse.json({ error: 'Engine run failed' }, { status: 500 })
  }
}