import { create } from 'zustand'

export enum Modals {
  createServer = 'createServer',
}

interface ModalStore {
  type: Modals | null
  isOpen: boolean
  onOpen: (type: Modals) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}))
