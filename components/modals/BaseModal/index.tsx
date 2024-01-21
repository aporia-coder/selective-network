'use client'

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { BaseModalProps } from './types'
import ModalHeader from './ModalHeader'

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
        <ModalHeader headerTitle={headerTitle} description={description} />
        <DialogFooter className="bg-gray-100 px-6 py-4">{button}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BaseModal
