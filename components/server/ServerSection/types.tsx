import { SectionTypes, ServerWithMembersAndProfiles } from '@/app/globalTypes'
import { ChannelType, MemberRole } from '@prisma/client'

export interface ServerSectionProps {
  label: string
  role: MemberRole | undefined
  sectionType: SectionTypes
  channelType?: ChannelType
  server?: ServerWithMembersAndProfiles
}
