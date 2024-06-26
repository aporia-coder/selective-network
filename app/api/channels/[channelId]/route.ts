import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const profile = await getCurrentUserProfile()

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

export async function PATCH(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const profile = await getCurrentUserProfile()

    if (!serverId) return new NextResponse('Missing ID', { status: 400 })
    if (!channelId) return new NextResponse('Missing ID', { status: 400 })
    if (name === 'general')
      return new NextResponse(`Channel name cannot be 'general'`, {
        status: 400,
      })

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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
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
