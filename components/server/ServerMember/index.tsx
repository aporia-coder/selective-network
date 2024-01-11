'use client'

import { useGetMemberRoleIcons } from '@/app/hooks/useGetMemberRoleIcons'
import { ServerMemberProps } from './types'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'
import { useParams, useRouter } from 'next/navigation'

const ServerMember = ({ server, member }: ServerMemberProps) => {
  const router = useRouter()
  const memberRoleIcons = useGetMemberRoleIcons()
  const { memberId } = useParams()

  const isActive = memberId === member.id

  const handleSelectMember = () =>
    router.push(`/servers/${server.id}/conversations/${member.id}`)

  return (
    <button
      onClick={handleSelectMember}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        isActive && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          isActive &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.profile.name}
      </p>
      {memberRoleIcons[member.role]}
    </button>
  )
}

export default ServerMember
