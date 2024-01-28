/* eslint-disable */
'use client'

import useChatQuery from '@/app/hooks/useChatQuery'
import { ChatMessageProps } from './types'
import Loader from '@/components/Loader'
import { ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { MessageWithMemberAndProfile } from '@/app/globalTypes'

const ChatMessage = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessageProps) => {
  const queryKey = `chat:${chatId}`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }
  // make loader more abstracted to use here

  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader message="Loading messages..." />
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((items) =>
          items.messages.map((message: MessageWithMemberAndProfile) => (
            <div key={message.id}>{message.content}</div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatMessage
