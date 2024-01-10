'use client'

import { Modals, useModal } from '@/app/hooks/useModalStore'
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import BaseModal from './BaseModal'

const LeaveServerModal = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, data } = useModal()
  const { server } = data

  const isModalOpen = isOpen && type === Modals.LEAVE_SERVER

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const description = (
    <>
      Are you sure you want to leave{' '}
      <span className="font-semibold text-indigo-500">{server?.name}</span>?
    </>
  )

  const button = (
    <div className="flex items-center justify-between w-full">
      <Button variant="secondary" disabled={isLoading} onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleLeaveServer}>
        Confirm
      </Button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isModalOpen}
      handleClose={onClose}
      headerTitle="Leave Server"
      description={description}
      button={button}
    />
  )
}

export default LeaveServerModal
