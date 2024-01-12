'use client'

import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import { useState } from 'react'
import qs from 'query-string'
import axios from 'axios'
import BaseModal from './BaseModal'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'

const DeleteServerModal = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { meta, onClose, isOpen, type } = useModal()
  const { server } = meta

  const isModalOpen = useIsModalOpen(isOpen, type, Modals.DELETE_SERVER)

  const handleDeleteServer = async () => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url: `/api/servers/${server?.id}`,
      })

      await axios.delete(url)

      router.push('/')
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const description = (
    <>
      Are you sure you want to delete{' '}
      <span className="font-semibold text-indigo-500">{server?.name}</span>
      ?
      <br />
      <p className="font-bold text-rose-500 text-sm mt-2">
        This action cannot be undone
      </p>
    </>
  )

  const buttons = (
    <div className="flex items-center justify-between w-full">
      <Button disabled={isLoading} onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={handleDeleteServer}
      >
        Confirm
      </Button>
    </div>
  )

  return (
    <BaseModal
      handleClose={onClose}
      headerTitle={'Delete Server'}
      isOpen={isModalOpen}
      button={buttons}
      description={description}
    />
  )
}

export default DeleteServerModal
