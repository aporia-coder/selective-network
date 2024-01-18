import { Member, Server, Profile } from '@prisma/client'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export enum SectionTypes {
  CHANNEL = 'channel',
  MEMBER = 'member',
  CONVERSATION = 'conversation',
}
