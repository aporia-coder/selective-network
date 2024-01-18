import { SectionTypes } from '@/app/globalTypes'

export interface ChatHeaderProps {
  serverId: string
  type: SectionTypes
  imageUrl?: string
  name: string
}
