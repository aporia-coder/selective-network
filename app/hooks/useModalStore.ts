import { ChannelType, Server, Channel } from '@prisma/client'
import { create } from 'zustand'

export enum Modals {
  CREATE_SERVER = 'createServer',
  INVITE = 'invite',
  EDIT_SERVER = 'editServer',
  MANAGE_MEMBERS = 'manageMembers',
  CREATE_CHANNEL = 'createChannel',
  LEAVE_SERVER = 'leaveServer',
  DELETE_CHANNEL = 'deleteChannel',
}

interface ModalData {
  server?: Server
  channelType?: ChannelType
  channel?: Channel
}

interface ModalStore {
  type: Modals | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: Modals, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}))
