import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    if (req.method === 'PATCH') {
      const { id } = await req.json()

      if (!id) {
        return new NextResponse('Notification ID is required', { status: 400 })
      }

      const notification = await db.notification.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })

      return NextResponse.json(notification)
    }
  } catch (error) {
    console.log(error)
  }
}
