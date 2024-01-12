'use client'

import qs from 'query-string'
import { ServerWithMembersAndProfiles } from '@/app/globalTypes'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../UserAvatar'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MemberRole } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useGetMemberRoleIcons } from '@/app/hooks/Icons/useGetMemberRoleIcons'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'

const ManageMembersModal = () => {
  const memberRoleIcons = useGetMemberRoleIcons()
  const router = useRouter()
  const [loadingId, setLoadingId] = useState('')
  const { isOpen, onClose, type, meta, onOpen } = useModal()
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.MANAGE_MEMBERS)

  const { server } = meta as { server: ServerWithMembersAndProfiles }

  const handleKickMember = async (memberId: string) => {
    try {
      setLoadingId(memberId)

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      })

      const response = await axios.delete(url)

      router.refresh()

      onOpen(Modals.MANAGE_MEMBERS, { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      // instead of using boolean, using the memberId to show the loading spinner only once next to the appropriate member, as only one spinner is being rendered
      setLoadingId(memberId)

      // need to pass serverId as search params, as we are already passing memberId as the params
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      })

      const response = await axios.patch(url, { role })
      // rerenders without refreshing whole page
      router.refresh()
      // refresh page, open modal with updated server
      onOpen(Modals.MANAGE_MEMBERS, { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {memberRoleIcons[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {/* Can't commit actions on an admin */}
              {member.profileId !== server.profileId &&
                // dont show dropdown when loading to prevent multiple actions being fired by user
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {/* Could iterate here instead of copy paste */}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === MemberRole.GUEST && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              {/* Split these into components */}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(
                                    member.id,
                                    MemberRole.MODERATOR
                                  )
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleKickMember(member.id)}
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ManageMembersModal
