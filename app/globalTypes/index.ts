import { Member, Server, Profile } from '@prisma/client'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export type NextApiResponseIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export enum SectionTypes {
  CHANNEL = 'channel',
  MEMBER = 'member',
  CONVERSATION = 'conversation',
}
