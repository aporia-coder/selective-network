/* eslint-disable @typescript-eslint/no-use-before-define */
'use client'

import '@livekit/components-styles'
import {
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { MediaRoomProps } from './types'
import Loader from '../Loader'
import { Track } from 'livekit-client'

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState()

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return

    const name = `${user.firstName} ${user.lastName}`
    const getUserToken = async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        )
        const data = await resp.json()
        setToken(data.token)
      } catch (e) {
        console.error(e)
      }
    }

    getUserToken()
  }, [user?.firstName, user?.lastName, chatId])

  if (token === '') return <Loader message="Loading..." />

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <MyVideoConference />
    </LiveKitRoom>
  )
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      <ParticipantTile />
    </GridLayout>
  )
}

export default MediaRoom
