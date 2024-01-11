'use client'

import { MemberRole } from '@prisma/client'
import { ServerSectionProps } from './types'
import { SidebarSectionTypes } from '@/app/globalTypes'
import ActionTooltip from '@/components/ActionTooltip'
import { Plus, Settings } from 'lucide-react'
import { Modals, useModal } from '@/app/hooks/useModalStore'

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
        sectionType === SidebarSectionTypes.CHANNEL && (
          <ActionTooltip label={label}>
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen(Modals.CREATE_EDIT_CHANNEL, { channelType })
              }
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      {role === MemberRole.ADMIN &&
        sectionType === SidebarSectionTypes.MEMBER && (
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
