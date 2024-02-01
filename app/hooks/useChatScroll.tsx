import { InfiniteData } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface UseChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  data: InfiniteData<any, unknown> | undefined
}

const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  data,
}: UseChatScrollProps) => {
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    const topDiv = chatRef.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }

    topDiv?.addEventListener('scroll', handleScroll)

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll)
    }
  }, [chatRef, loadMore, shouldLoadMore])

  useEffect(() => {
    const bottomDiv = bottomRef.current
    const topDiv = chatRef.current

    const shouldAutoScroll = () => {
      if (!isInit && bottomDiv) {
        setIsInit(true)
        return true
      }

      if (!topDiv) return false

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight

      return distanceFromBottom <= topDiv.clientHeight
    }

    if (shouldAutoScroll()) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [bottomRef, chatRef, isInit, data])
}

export default useChatScroll
