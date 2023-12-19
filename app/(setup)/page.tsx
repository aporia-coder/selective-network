import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'
import { Profile } from '@prisma/client'
import InitialModal from '@/components/modals/initial-modal'

const SetupPage = async () => {
  const profile: Profile = await initialProfile()

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) redirect(`/servers/${server.id}`)

  return <InitialModal />
}

export default SetupPage
