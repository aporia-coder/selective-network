'use client'

import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import BaseModal from './BaseModal'
import { useState } from 'react'
import { Button } from '../ui/button'
import qs from 'query-string'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'

const DeleteChanelModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isOpen, onClose, type, meta } = useModal()
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.DELETE_CHANNEL)

  const { server, channel } = meta

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })

      await axios.delete(url)
      onClose()
      router.push(`/servers/${server?.id}`)
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const description = (
    <>
      Are you sure you want to delete{' '}
      <span className="font-semibold text-indigo-500">{channel?.name}</span>?
    </>
  )

  const buttons = (
    <div className="flex items-center justify-between w-full">
      <Button disabled={isLoading} onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleDeleteChannel}>
        Confirm
      </Button>
    </div>
  )

  return (
    <BaseModal
      headerTitle="Delete channel"
      description={description}
      handleClose={onClose}
      isOpen={isModalOpen}
      button={buttons}
    />
  )
}

export default DeleteChanelModal
