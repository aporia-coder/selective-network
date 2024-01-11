'use client'

import { useEffect, useState } from 'react'
import CreateServerModal from '../modals/CreateServerModal'
import InviteServerModal from '../modals/InviteServerModal'
import EditServerModal from '../modals/edit-server-modal'
import ManageMembersModal from '../modals/ManageMembersModal'
import CreateChannelModal from '../modals/CreateChannelModal'
import LeaveServerModal from '../modals/LeaveServerModal'
import DeleteChanelModal from '../modals/DeleteChannelModal'

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
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteChanelModal />
    </>
  )
}
