import { MESSAGE_BATCH } from '@/app/settings'
import { db } from '@/lib/db'
import { DirectMessage } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const cursor = searchParams.get('cursor')

    if (!conversationId) {
      return new NextResponse('Missing Conversation ID', { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (!cursor) {
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
        },
        take: MESSAGE_BATCH,
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
        },
        cursor: {
          id: cursor,
        },
        take: MESSAGE_BATCH,
        skip: 1,
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id
    }

    return NextResponse.json({
      messages,
      nextCursor,
    })
  } catch (error) {
    console.log('GET_DIRECT_MESSAGES', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
