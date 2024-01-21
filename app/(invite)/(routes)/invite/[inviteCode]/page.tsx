import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { redirect } from 'next/navigation'

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await getCurrentUserProfile()

  if (!params.inviteCode) redirect('/')

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      profileId: profile?.id,
    },
  })

  if (existingServer) redirect(`/servers/${existingServer.id}`)

  if (profile?.id) {
    const server = await db.server.update({
      where: {
        inviteCode: params.inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile?.id,
            },
          ],
        },
      },
    })
    if (server) redirect(`/servers/${server?.id}`)
  }

  return null
}

export default InviteCodePage
