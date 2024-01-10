import { Member, Server, Profile } from '@prisma/client'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

// change name of this as its used in multiple places
export enum ServerSearchTypes {
  CHANNEL = 'channel',
  MEMBER = 'member',
}
