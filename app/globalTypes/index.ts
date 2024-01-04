import { Member, Server, Profile } from '@prisma/client'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export enum MemberRoles {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}
