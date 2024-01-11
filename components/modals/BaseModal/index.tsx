'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BaseModalProps } from './types'

const BaseModal = ({
  isOpen,
  handleClose,
  headerTitle,
  description,
  button,
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {headerTitle}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">{button}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BaseModal
