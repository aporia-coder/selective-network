'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Modals, useModal } from '@/app/hooks/useModalStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/app/hooks/useOrigin'
import axios from 'axios'
import { useState } from 'react'
import { useIsModalOpen } from '@/app/hooks/useIsModalOpen'

const InviteServerModal = () => {
  const [copied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, data, onOpen } = useModal()
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.INVITE)

  const { server } = data

  const origin = useOrigin()

  const inviteLink = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setIsCopied(true)
    // set timeout shows copy icon briefly
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const createNewLink = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      )
      onOpen(Modals.INVITE, { server: response?.data })
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
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteLink}
            />
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={createNewLink}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4 pl-0"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteServerModal
