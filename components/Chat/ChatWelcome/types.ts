import { SectionTypes } from '@/app/globalTypes'

export interface ChatWelcomeProps {
  name: string
  type: SectionTypes.CHANNEL | SectionTypes.CONVERSATION
}
