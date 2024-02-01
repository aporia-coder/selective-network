'use client'

import { useEffect, useState } from 'react'
import CreateEditServerModal from '../modals/CreateEditServerModal'
import InviteServerModal from '../modals/InviteServerModal'
import ManageMembersModal from '../modals/ManageMembersModal'
import CreateEditChannelModal from '../modals/CreateEditChannelModal'
import LeaveServerModal from '../modals/LeaveServerModal'
import DeleteChanelModal from '../modals/DeleteChannelModal'
import DeleteServerModal from '../modals/DeleteServerModal'
import AddFileModal from '../modals/AddFileModal'
import DeleteMessageModal from '../modals/DeleteMessageModal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CreateEditServerModal />
      <InviteServerModal />
      <ManageMembersModal />
      <CreateEditChannelModal />
      <LeaveServerModal />
      <DeleteChanelModal />
      <DeleteServerModal />
      <AddFileModal />
      <DeleteMessageModal />
    </>
  )
}
