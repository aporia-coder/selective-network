import {
  SidebarSectionTypes,
  ServerWithMembersAndProfiles,
} from '@/app/globalTypes'
import { ChannelType, MemberRole } from '@prisma/client'

export interface ServerSectionProps {
  label: string
  role: MemberRole | undefined
  sectionType: SidebarSectionTypes
  channelType?: ChannelType
  server?: ServerWithMembersAndProfiles
}
