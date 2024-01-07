'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Modals, useModal } from '@/app/hooks/use-modal-store'
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

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

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex justify-between items-center w-full">
              <Button disabled={isLoading} onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleLeaveServer}>
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal
