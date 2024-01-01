'use client'

import { useEffect, useState } from 'react'
import CreateServerModal from '../modals/create-server-modal'
import InviteServerModal from '../modals/invite-server-modal'
import EditServerModal from '../modals/edit-server-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CreateServerModal />
      <InviteServerModal />
      <EditServerModal />
    </>
  )
}
