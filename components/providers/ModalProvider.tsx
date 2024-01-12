'use client'

import { useEffect, useState } from 'react'
import CreateEditServerModal from '../modals/CreateEditServerModal'
import InviteServerModal from '../modals/InviteServerModal'
import ManageMembersModal from '../modals/ManageMembersModal'
import CreateEditChannelModal from '../modals/CreateEditChannelModal'
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
      <CreateEditServerModal />
      <InviteServerModal />
      <ManageMembersModal />
      <CreateEditChannelModal />
      <LeaveServerModal />
      <DeleteChanelModal />
    </>
  )
}
