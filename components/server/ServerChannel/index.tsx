'use client'

import { useMemo } from 'react'
import { ServerChannelProps } from './types'
import { ChannelType, MemberRole } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from '@/components/ActionTooltip'
import { ModalData, Modals, useModal } from '@/app/hooks/Modals/useModalStore'

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  // dupe code
  const channelIconList = useMemo(() => {
    return {
      [ChannelType.TEXT]: Hash,
      [ChannelType.AUDIO]: Mic,
      [ChannelType.VIDEO]: Video,
    }
  }, [])

  const isChannelActive = useMemo(() => {
    return params?.channelId === channel.id
  }, [channel, params?.channelId])

  const Icon = channelIconList[channel.type]

  const handleIconClick = (
    e: React.MouseEvent,
    modal: Modals,
    data: ModalData
  ) => {
    e.stopPropagation()
    onOpen(modal, data)
  }

  const handleChangeChannel = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`)
  }

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        isChannelActive && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={handleChangeChannel}
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
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600"
              onClick={(e) =>
                handleIconClick(e, Modals.CREATE_EDIT_CHANNEL, {
                  channel,
                  isEdit: true,
                })
              }
            />
          </ActionTooltip>
        )}
        {channel.name !== 'general' && role === MemberRole.ADMIN && (
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600"
              onClick={(e) =>
                handleIconClick(e, Modals.DELETE_CHANNEL, {
                  server,
                  channel,
                })
              }
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
