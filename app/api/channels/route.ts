import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const profile = await getCurrentUserProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get('serverId')

    const { name, type } = await req.json()

    if (!serverId) return new NextResponse('Missing ID', { status: 400 })

    if (name === 'general')
      return new NextResponse(`Channel name cannnot be 'general'`)

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse('CHANNEL_ERROR', { status: 500 })
  }
}
