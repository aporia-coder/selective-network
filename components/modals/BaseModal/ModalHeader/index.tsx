import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BaseModalProps } from '../types'

const ModalHeader = ({
  headerTitle,
  description,
}: Pick<BaseModalProps, 'headerTitle' | 'description'>) => {
  return (
    <DialogHeader className="pt-8 px-6">
      <DialogTitle className="text-2xl text-center font-bold">
        {headerTitle}
      </DialogTitle>
      <DialogDescription className="text-center text-zinc-500">
        {description}
      </DialogDescription>
    </DialogHeader>
  )
}

export default ModalHeader
