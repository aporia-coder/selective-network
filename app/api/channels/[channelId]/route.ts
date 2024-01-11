import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    if (!serverId) return new NextResponse('Missing ID', { status: 400 })
    if (!channelId) return new NextResponse('Missing ID', { status: 400 })

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
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('channelId error', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}
