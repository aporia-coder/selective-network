import { SectionTypes } from '@/app/globalTypes'
import ChatHeader from '@/components/Chat/ChatHeader'
import { db } from '@/lib/db'
import { findOrCreateConversation, getCurrentUserProfile } from '@/lib/utils'
import { redirect } from 'next/navigation'

interface MemberPageProps {
  params: {
    serverId: string
    memberId: string
  }
}

const MemberPage = async ({
  params: { serverId, memberId },
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
      />
    </div>
  )
}

export default MemberPage
