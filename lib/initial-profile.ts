import { redirectToSignIn, currentUser } from '@clerk/nextjs'

import { db } from './db'
import { APP_URL } from '@/app/settings'

export const initialProfile = async () => {
  const user = await currentUser()

  if (!user)
    return redirectToSignIn({
      returnBackUrl: APP_URL,
    })

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) return profile

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  })

  return newProfile
}
