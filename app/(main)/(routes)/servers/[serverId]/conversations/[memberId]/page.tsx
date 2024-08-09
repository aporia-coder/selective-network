import { SectionTypes } from '@/app/globalTypes'
import ChatHeader from '@/components/Chat/ChatHeader'
import ChatInput from '@/components/Chat/ChatInput'
import ChatMessages from '@/components/Chat/ChatMessages'
import MediaRoom from '@/components/MediaRoom'
import { db } from '@/lib/db'
import { findOrCreateConversation, getCurrentUserProfile } from '@/lib/utils'
import { redirect } from 'next/navigation'

interface MemberPageProps {
  params: {
    serverId: string
    memberId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberPage = async ({
  params: { serverId, memberId },
  searchParams,
}: MemberPageProps) => {
  const profile = await getCurrentUserProfile()

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) redirect('/')

  const conversation = await findOrCreateConversation(
    currentMember?.id,
    memberId
  )

  const notifications = await db.notification.findMany({
    where: {
      serverId,
      member: {
        profileId: profile.id,
      },
    },
  })

  if (!conversation) redirect(`/servers/${serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type={SectionTypes.CONVERSATION}
        imageUrl={otherMember.profile.imageUrl}
        notifications={notifications}
      />
      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      ) : (
        <>
          <ChatMessages
            apiUrl="/api/direct-messages"
            chatId={conversation.id}
            member={currentMember}
            name={otherMember.profile.name}
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            type={SectionTypes.CONVERSATION}
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            type={SectionTypes.CONVERSATION}
            apiUrl="/api/socket/direct-messages"
            name={otherMember.profile.name}
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MemberPage
