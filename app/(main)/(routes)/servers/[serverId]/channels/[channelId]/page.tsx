import { SectionTypes } from '@/app/globalTypes'
import { APP_URL } from '@/app/settings'
import ChatHeader from '@/components/Chat/ChatHeader'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const ChannelPage = async ({
  params: { serverId, channelId },
}: {
  params: { serverId: string; channelId: string }
}) => {
  const profile = await currentProfile()

  if (!profile)
    return redirectToSignIn({
      returnBackUrl: APP_URL,
    })

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
