'use client'

import { cn } from '@/lib/utils'
import { useSocket } from '../providers/SocketProvider'
import { Badge } from '../ui/badge'

const SocketIndicator = () => {
  const { isConnected } = useSocket()

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-white border-none',
        !isConnected ? 'bg-yellow-600' : 'bg-emerald-600'
      )}
    >
      {isConnected ? 'Live - Real time updates' : 'Fallback - Polling every 1s'}
    </Badge>
  )
}

export default SocketIndicator
