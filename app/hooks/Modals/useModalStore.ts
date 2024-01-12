import { ChannelType, Server, Channel } from '@prisma/client'
import { create } from 'zustand'

export enum Modals {
  CREATE_EDIT_SERVER = 'createEditServer',
  INVITE = 'invite',
  EDIT_SERVER = 'editServer',
  MANAGE_MEMBERS = 'manageMembers',
  CREATE_EDIT_CHANNEL = 'createEditChannel',
  LEAVE_SERVER = 'leaveServer',
  DELETE_CHANNEL = 'deleteChannel',
  DELETE_SERVER = 'deleteServer',
}

export interface ModalData {
  server?: Server
  channelType?: ChannelType
  channel?: Channel
  isEdit?: boolean
}

interface ModalStore {
  type: Modals | null
  meta: ModalData
  isOpen: boolean
  onOpen: (type: Modals, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  meta: {},
  onOpen: (type, meta = {}) => set({ isOpen: true, type, meta }),
  onClose: () => set({ isOpen: false, type: null }),
}))
