import { SectionTypes } from '@/app/globalTypes'
import ChatHeader from '@/components/Chat/ChatHeader'
import ChatInput from '@/components/Chat/ChatInput'
import { db } from '@/lib/db'
import { getCurrentUserProfile } from '@/lib/utils'
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

  if (!channel || !member) return redirect('/')

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeader
        name={channel.name}
        type={SectionTypes.CHANNEL}
        serverId={serverId}
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        type={SectionTypes.CONVERSATION}
        apiUrl="/api/socket/messages"
        name={channel.name}
        query={{
          channelId,
          serverId,
        }}
      />
    </div>
  )
}

export default ChannelPage
