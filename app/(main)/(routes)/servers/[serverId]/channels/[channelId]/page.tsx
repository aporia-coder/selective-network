import { SectionTypes } from '@/app/globalTypes'
import ChatHeader from '@/components/Chat/ChatHeader'
import ChatInput from '@/components/Chat/ChatInput'
import ChatMessages from '@/components/Chat/ChatMessages'
import MediaRoom from '@/components/MediaRoom'
import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

const ChannelPage = async ({
  params: { serverId, channelId },
}: {
  params: { serverId: string; channelId: string }
}) => {
  const profile = await getCurrentUserProfile()

  const channel = await db.channel.findUnique({
    where: {
      serverId,
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  const notifications = await db.notification.findMany({
    where: {
      serverId,
      member: {
        profileId: profile.id,
      },
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeader
        name={channel.name}
        type={SectionTypes.CHANNEL}
        serverId={serverId}
        notifications={notifications}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            type={SectionTypes.CHANNEL}
            member={member}
            name={channel.name}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
          <ChatInput
            type={SectionTypes.CONVERSATION}
            apiUrl="/api/socket/messages"
            name={channel.name}
            query={{
              channelId,
              serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={true} video={true} />
      )}
    </div>
  )
}

export default ChannelPage
