'use client'

import { useMemo } from 'react'
import { ServerChannelProps } from './types'
import { ChannelType, MemberRole } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import ActionTooltip from '@/components/ActionTooltip'
import { Modals, useModal } from '@/app/hooks/useModalStore'

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()
  const { channelId } = useParams()
  // const { channelId, serverId } = useParams()
  // const router = useRouter()

  const channelIconList = useMemo(() => {
    return {
      [ChannelType.TEXT]: Hash,
      [ChannelType.AUDIO]: Mic,
      [ChannelType.VIDEO]: Video,
    }
  }, [])

  const isChannelActive = useMemo(() => {
    return channelId === channel.id
  }, [channel, channelId])

  const Icon = channelIconList[channel.type]

  // const handleChannelChange = () =>
  //   router.push(`/servers/${serverId}/channels/${channelId}`)

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        isChannelActive && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      // onClick={handleChannelChange}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          isChannelActive &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      <div className="flex items-center ml-auto gap-x-2">
        {channel.name !== 'general' && role !== MemberRole.GUEST && (
          <ActionTooltip label="Edit">
            <Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600" />
          </ActionTooltip>
        )}
        {channel.name !== 'general' && role === MemberRole.ADMIN && (
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600"
              onClick={() => onOpen(Modals.DELETE_CHANNEL, { server, channel })}
            />
          </ActionTooltip>
        )}
        {channel.name === 'general' && (
          <Lock className="w-4 h-4 text-zinc-500 hover:text-zinc-600" />
        )}
      </div>
    </button>
  )
}

export default ServerChannel
