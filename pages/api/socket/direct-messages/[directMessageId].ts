/* eslint-disable @typescript-eslint/no-shadow */
import { NextApiResponseIO } from '@/app/globalTypes'
import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseIO
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)

    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { conversationId, directMessageId } = req.query
    const { content } = req.body

    if (!conversationId)
      return res.status(400).json({ error: 'Conversation ID missing' })

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation)
      return res.status(404).json({ error: 'Conversation not found' })

    const member =
      conversation.memberOneId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) return res.status(404).json({ error: 'Member not found' })

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: 'Direct message not found' })
    }

    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const isOwner = directMessage.memberId === member.id
    const canModify = isAdmin || isModerator || isOwner

    if (!canModify) return res.status(401).json({ error: 'Unauthorized' })

    if (req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          deleted: true,
          content: 'This message has been deleted',
          fileUrl: null,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isOwner) return res.status(401).json({ error: 'Unauthorised' })
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${conversationId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log(error)
  }
}
