'use client'

import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/SocketProvider'

const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}) => {
  const { isConnected } = useSocket()

  const fetchMessages = async (pageParam: number | undefined) => {
    try {
      const url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: {
            cursor: pageParam,
            [paramKey]: paramValue,
          },
        },
        { skipNull: true }
      )
      const res = await fetch(url)
      return await res.json()
    } catch (error) {
      console.log(error)
    }
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => fetchMessages(pageParam),
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}

export default useChatQuery
