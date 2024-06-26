import { db } from '@/lib/db'
import NavigationAction from '../NavigationAction'
import { Separator } from '../../ui/separator'
import { ScrollArea } from '../../ui/scroll-area'
import NavigationItem from '../NavigationItem'
import { ModeToggle } from '../../ModeToggle'
import { UserButton } from '@clerk/nextjs'
import { getCurrentUserProfile } from '@/lib/utils'

const NavigationSidebar = async () => {
  const profile = await getCurrentUserProfile()

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto my-2" />
      <ScrollArea>
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto pb-3 flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar
