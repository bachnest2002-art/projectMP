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
    if (!user || (user.role !== 'admin' && user.role !== 'crm')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { comment } = await request.json()
    const userId = parseInt(params.id)

    const newComment = await prisma.comment.create({
      data: {
        user_id: userId,
        commenter_id: user.id,
        comment,
      },
    })

    return NextResponse.json({ comment: newComment })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    const user = await getUserFromToken(token!)
    if (!user || (user.role !== 'admin' && user.role !== 'crm')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(params.id)

    const comments = await prisma.comment.findMany({
      where: { user_id: userId },
      include: { commenter: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}