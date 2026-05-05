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

    const { date, file_path } = await request.json()

    const bhavcopy = await prisma.bhavcopy.create({
      data: {
        date: new Date(date),
        file_path,
        uploaded_by: user.id,
      },
    })

    return NextResponse.json({ bhavcopy })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload bhavcopy' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'ra') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bhavcopies = await prisma.bhavcopy.findMany({
      where: { uploaded_by: user.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ bhavcopies })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bhavcopies' }, { status: 500 })
  }
}