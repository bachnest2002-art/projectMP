import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// Simulate OTP sending
function sendOTP(mobile: string, email: string, otp: string) {
  // In real app, use Twilio and Nodemailer
  console.log(`OTP for ${mobile} and ${email}: ${otp}`)
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mobile, email, password } = await request.json()

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ mobile }, { email }] },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const hashedPassword = await import('@/lib/auth').then(m => m.hashPassword(password))

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'customer',
        mobile,
        otp,
        otp_expiry: otpExpiry,
      },
    })

    sendOTP(mobile, email, otp)

    return NextResponse.json({ userId: newUser.id, message: 'OTP sent' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      include: { comments: true, portfolios: true },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}