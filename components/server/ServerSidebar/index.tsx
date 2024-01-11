import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ServerHeader from '../ServerHeader'
import { ScrollArea } from '../../ui/scroll-area'
import ServerSearch from '../ServerSearch'
import { ChannelType } from '@prisma/client'
import { Separator } from '../../ui/separator'
import ServerSection from '../ServerSection'
import { SidebarSectionTypes } from '@/app/globalTypes'
import ServerChannel from '../ServerChannel'
import { useGetChannelTypeIcons } from '@/app/hooks/useGetChannelTypeIcons'
import { useGetMemberRoleIcons } from '@/app/hooks/useGetMemberRoleIcons'

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const channelTypeIcons = useGetChannelTypeIcons()
  const memberRoleIcons = useGetMemberRoleIcons()

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
    type: SidebarSectionTypes.CHANNEL,
    data: textChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIcons[type],
    })),
  }

  const audioChannelSearchData = {
    label: 'Voice Channels',
    type: SidebarSectionTypes.CHANNEL,
    data: audioChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIcons[type],
    })),
  }

  const videoChannelSearchData = {
    label: 'Video Channels',
    type: SidebarSectionTypes.CHANNEL,
    data: videoChannels?.map(({ id, name, type }) => ({
      id,
      name,
      icon: channelTypeIcons[type],
    })),
  }

  const membersSearchData = {
    label: 'Members',
    type: SidebarSectionTypes.MEMBER,
    data: members?.map(({ profile: { id, name }, role }) => ({
      id,
      name,
      icon: memberRoleIcons[role],
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
              sectionType={SidebarSectionTypes.CHANNEL}
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
              sectionType={SidebarSectionTypes.CHANNEL}
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
              sectionType={SidebarSectionTypes.CHANNEL}
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
              sectionType={SidebarSectionTypes.MEMBER}
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
