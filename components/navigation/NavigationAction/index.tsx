'use client'

import { Plus } from 'lucide-react'
import ActionTooltip, { TooltipAlign, TooltipSide } from '../../ActionTooltip'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'

const NavigationAction = () => {
  const { onOpen } = useModal()
  const handleOpenModal = () => onOpen(Modals.CREATE_EDIT_SERVER)

  return (
    <div>
      <ActionTooltip
        side={TooltipSide.right}
        align={TooltipAlign.center}
        label="Add a server"
      >
        <button className="group flex items-centers" onClick={handleOpenModal}>
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction
