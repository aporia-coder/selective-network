import { useState } from 'react'
import { Button } from '../ui/button'
import BaseModal from './BaseModal'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'
import qs from 'query-string'
import axios from 'axios'

const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, meta } = useModal()
  const { apiUrl, query } = meta
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.DELETE_MESSAGE)

  const handleDeleteMessage = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl as string,
        query,
      })

      await axios.delete(url)
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttons = (
    <div className="flex items-center justify-between w-full">
      <Button disabled={isLoading} onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleDeleteMessage}>
        Confirm
      </Button>
    </div>
  )
  return (
    <BaseModal
      headerTitle="Delete Message"
      description="This action cannot be undone"
      button={buttons}
      isOpen={isModalOpen}
      handleClose={onClose}
    />
  )
}

export default DeleteMessageModal
