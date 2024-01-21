'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export enum TooltipSide {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export enum TooltipAlign {
  start = 'start',
  center = 'center',
  end = 'end',
}

interface TooltipProps {
  label: string
  children: React.ReactNode
  side?: TooltipSide
  align?: TooltipAlign
}

const ActionTooltip = ({ label, children, align, side }: TooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip
