import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { db } from './db'
import { currentProfile } from './current-profile'
import { redirect } from 'next/navigation'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentUserProfile = async () => {
  const profile = await currentProfile()

  if (!profile) return redirect('/sign-in')

  return profile
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId, memberTwoId }],
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

    return conversation
  } catch (error) {
    return null
  }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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

    return conversation
  } catch (error) {
    return null
  }
}

export const findOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId)
  }

  return conversation
}
