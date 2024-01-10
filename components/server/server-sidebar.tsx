import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ServerHeader from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './ServerSearch'
import { useMemo } from 'react'
import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './ServerSection'
import { ServerSearchTypes } from '@/app/globalTypes'
import ServerChannel from './ServerChannel'

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
        <div className="mt-2">
          <ServerSearch data={data} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="text channels"
              channelType={ChannelType.TEXT}
              sectionType={ServerSearchTypes.CHANNEL}
              role={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                server={server}
                role={role}
                key={channel.id}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="audio channels"
              channelType={ChannelType.AUDIO}
              sectionType={ServerSearchTypes.CHANNEL}
              role={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                server={server}
                role={role}
                key={channel.id}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="video channels"
              channelType={ChannelType.VIDEO}
              sectionType={ServerSearchTypes.CHANNEL}
              role={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                server={server}
                role={role}
                key={channel.id}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              label="members"
              sectionType={ServerSearchTypes.MEMBER}
              role={role}
            />
            {members.map((member) => (
              <div key={member.id}>
                <p>{member.profile.name}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
