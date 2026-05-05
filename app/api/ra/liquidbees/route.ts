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

    const { date, closing_rate } = await request.json()

    const liquidbees = await prisma.liquidBees.create({
      data: {
        date: new Date(date),
        closing_rate,
        uploaded_by: user.id,
      },
    })

    return NextResponse.json({ liquidbees })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update Liquid BeES' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'ra') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const liquidbees = await prisma.liquidBees.findMany({
      where: { uploaded_by: user.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ liquidbees })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Liquid BeES' }, { status: 500 })
  }
}