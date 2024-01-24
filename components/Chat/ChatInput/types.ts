import { SectionTypes } from '@/app/globalTypes'

export interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: SectionTypes.MEMBER | SectionTypes.CONVERSATION
}
