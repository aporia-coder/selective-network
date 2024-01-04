import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// make an error handler
export async function DELETE(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    if (!memberId) return new NextResponse('Missing ID', { status: 400 })
    if (!serverId) return new NextResponse('Missing ID', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse('MEMBER_ID_ERROR', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    const { role } = await req.json()

    if (!profile) return new NextResponse('Unauthorised', { status: 401 })
    if (!serverId) return new NextResponse('Missing ID', { status: 400 })
    if (!memberId) return new NextResponse('Missing ID', { status: 400 })

    const server = await db.server.update({
      // check for admin (only admin can see this modal of the FE anyway)
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              // make sure admin of server (profile.id === profileId) can't update themselves. A server needs to have an admin, so this check ensures the admin can't change their role through the API
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      // need to include members related to the server and the profile related to these members as we depend on this data being rendered in the manage members modal
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBER_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
