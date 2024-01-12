import { useMemo } from 'react'
import { Modals } from './useModalStore'

export const useIsModalOpen = (
  isOpen: boolean,
  type: Modals | null,
  modal: Modals
) => {
  const isModalOpen = useMemo(
    () => isOpen && type === modal,
    [isOpen, type, modal]
  )
  return isModalOpen
}
