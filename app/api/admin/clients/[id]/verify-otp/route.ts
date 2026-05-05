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

    const { otp } = await request.json()
    const userId = parseInt(params.id)

    const customer = await prisma.user.findUnique({
      where: { id: userId, role: 'customer' },
    })

    if (!customer || customer.otp !== otp || customer.otp_expiry! < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { otp_verified: true, otp: null, otp_expiry: null },
    })

    return NextResponse.json({ message: 'OTP verified' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}