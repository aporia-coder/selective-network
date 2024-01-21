import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { redirect } from 'next/navigation'

const ServerPage = async ({
  params: { serverId },
}: {
  params: { serverId: string }
}) => {
  const profile = await getCurrentUserProfile()

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') return null

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}

export default ServerPage
