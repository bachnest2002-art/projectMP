import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'ra') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stock_symbol, industry, action } = await request.json()

    let stock = await prisma.stock.findUnique({
      where: { symbol: stock_symbol },
    })

    if (!stock) {
      stock = await prisma.stock.create({
        data: { symbol: stock_symbol, industry },
      })
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        ra_id: user.id,
        stock_id: stock.id,
        action,
      },
    })

    return NextResponse.json({ recommendation })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add recommendation' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'ra') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { ra_id: user.id },
      include: { stock: true },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ recommendations })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}