import { MESSAGE_BATCH } from '@/app/settings'
import { db } from '@/lib/db'
import { Message } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const cursor = searchParams.get('cursor')

    if (!channelId) {
      return new NextResponse('Missing Channel ID', { status: 400 })
    }

    let messages: Message[] = []

    if (!cursor) {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
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
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        cursor: {
          id: cursor,
        },
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
    console.log('GET_MESSAGES', error)
  }
}
