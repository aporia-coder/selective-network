import { SectionTypes } from '@/app/globalTypes'
import ChatHeader from '@/components/Chat/ChatHeader'
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
    <ChatHeader
      name={channel.name}
      type={SectionTypes.CHANNEL}
      serverId={serverId}
    />
  )
}

export default ChannelPage
