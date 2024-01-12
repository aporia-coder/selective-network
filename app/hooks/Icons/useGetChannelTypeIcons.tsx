import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'
import { useMemo } from 'react'

export const useGetChannelTypeIcons = () => {
  const className = 'mr-2 h-4 w-4'
  return useMemo(() => {
    return {
      [ChannelType.TEXT]: <Hash className={className} />,
      [ChannelType.AUDIO]: <Mic className={className} />,
      [ChannelType.VIDEO]: <Video className={className} />,
    }
  }, [])
}
