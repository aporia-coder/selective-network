'use client'

import { MemberRole } from '@prisma/client'
import { ServerSectionProps } from './types'
import { ServerSearchTypes } from '@/app/globalTypes'
import ActionTooltip from '@/components/action-tooltip'
import { Plus, Settings } from 'lucide-react'
import { Modals, useModal } from '@/app/hooks/use-modal-store'

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal()
  return (
    <div className="flex items-center justify-between py-2">
      <p className="uppercase text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
        {label}
      </p>
      {role !== MemberRole.GUEST &&
        sectionType === ServerSearchTypes.CHANNEL && (
          <ActionTooltip label={label}>
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={() => onOpen(Modals.CREATE_CHANNEL, { channelType })}
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      {role === MemberRole.ADMIN &&
        sectionType === ServerSearchTypes.MEMBER && (
          <ActionTooltip label={label}>
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={() => onOpen(Modals.MANAGE_MEMBERS, { server })}
            >
              <Settings className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
    </div>
  )
}

export default ServerSection
