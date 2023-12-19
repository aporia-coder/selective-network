import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'
import { Profile } from '@prisma/client'

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

  return <>{profile ? <h1>{profile.name}</h1> : <h1>no profile</h1>}</>
}

export default SetupPage
