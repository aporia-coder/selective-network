import { SectionTypes } from '@/app/globalTypes'
import { Notification } from '@prisma/client'

export interface ChatHeaderProps {
  serverId: string
  type: SectionTypes
  imageUrl?: string
  name: string
  notifications: Notification[]
}
