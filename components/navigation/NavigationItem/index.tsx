'use client'

import { cn } from '@/lib/utils'
import ActionTooltip, { TooltipAlign, TooltipSide } from '../../ActionTooltip'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams()
  const router = useRouter()

  const handleChangeServer = () => router.push(`/servers/${id}`)

  const isActive = params.serverId === id

  return (
    <ActionTooltip
      label={name}
      align={TooltipAlign.center}
      side={TooltipSide.right}
    >
      <button
        onClick={handleChangeServer}
        className="group relative flex items-center my-2"
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            !isActive && 'group-hover:h-[20px]',
            isActive ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            isActive && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
