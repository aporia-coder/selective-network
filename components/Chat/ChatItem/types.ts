import { Member, Profile } from '@prisma/client'

export interface ChatItemProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  currentMember: Member
  deleted: boolean
  isUpdated: boolean
  fileUrl?: string | null
  socketUrl: string
  socketQuery: Record<string, string>
  timestamp: string
}
