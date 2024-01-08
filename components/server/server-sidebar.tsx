import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ServerHeader from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './ServerSearch'
import { useMemo } from 'react'
import { ChannelType, MemberRole } from '@prisma/client'
import { ServerSearchTypes } from './ServerSearch/types'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const channelTypeIconList = useMemo(() => {
    return {
      [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
      [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
      [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
    }
  }, [])

  const roleIconList = useMemo(() => {
    return {
      [MemberRole.GUEST]: null,
      // make this into icon component as it is repeated
      [MemberRole.MODERATOR]: (
        <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
      ),
      [MemberRole.ADMIN]: (
        <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
      ),
    }
  }, [])

  const profile = await currentProfile()
  if (!profile) redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  )
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )

  // remove ourself from member list
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  )

  const textChannelSearchData = {
    label: 'Text Channels',
    type: ServerSearchTypes.CHANNEL,
    data: textChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIconList[type],
    })),
  }

  const audioChannelSearchData = {
    label: 'Voice Channels',
    type: ServerSearchTypes.CHANNEL,
    data: audioChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIconList[type],
    })),
  }

  const videoChannelSearchData = {
    label: 'Video Channels',
    type: ServerSearchTypes.CHANNEL,
    data: videoChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIconList[type],
    })),
  }

  const membersSearchData = {
    label: 'Members',
    type: ServerSearchTypes.MEMBER,
    data: members?.map(({ profile: { id, name }, role }) => ({
      id,
      name,
      icon: roleIconList[role],
    })),
  }

  const role = server?.members?.find(
    (member) => member.profileId === profile.id
  )?.role

  if (!server) redirect('/')

  const data = [
    textChannelSearchData,
    audioChannelSearchData,
    videoChannelSearchData,
    membersSearchData,
  ]

  return (
    <div className="h-full flex flex-col w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="px-3">
        <ServerSearch data={data} />
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
