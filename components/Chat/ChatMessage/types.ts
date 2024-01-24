import { SectionTypes } from '@/app/globalTypes'
import { Member } from '@prisma/client'

export interface ChatMessageProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: SectionTypes.CHANNEL | SectionTypes.CONVERSATION
}
