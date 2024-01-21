import ServerSidebar from '@/components/server/ServerSidebar'
import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { redirect } from 'next/navigation'

const ServerPageLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { serverId: string }
}) => {
  // could turn this into a hook since its repeated a lot? or handle with redux logic?
  const profile = await getCurrentUserProfile()

  const server = await db.server.findUnique({
    // serverId comes from folder name
    where: {
      id: params.serverId,
      // make sure profile is a member of the server, otherwise anyone with serverId can join
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  })

  if (!server) redirect('/')

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full flex-col w-60 z-20 fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}

export default ServerPageLayout
