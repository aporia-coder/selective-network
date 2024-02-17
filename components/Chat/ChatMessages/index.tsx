'use client'

import useChatQuery from '@/app/hooks/useChatQuery'
import { ChatMessageProps } from './types'
import Loader from '@/components/Loader'
import { ServerCrash } from 'lucide-react'
import { MessageWithMemberAndProfile } from '@/app/globalTypes'
import ChatItem from '../ChatItem'
import { ElementRef, useRef } from 'react'
import ChatWelcome from '../ChatWelcome'
import useChatScroll from '@/app/hooks/useChatScroll'

const ChatMessages = ({
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
  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const queryKey = `chat:${chatId}`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    data,
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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
        <div className="flex-1">
          <ChatWelcome type={type} name={name} />
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader />
          ) : (
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-2 dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((items) => {
          return items.messages.map((message: MessageWithMemberAndProfile) => (
            <ChatItem
              content={message.content}
              deleted={message.deleted}
              fileUrl={message?.fileUrl}
              isUpdated={message.createdAt !== message.updatedAt}
              currentMember={member}
              member={message.member}
              id={message.id}
              key={message.id}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              timestamp={message.createdAt as unknown as string}
            />
          ))
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessages
