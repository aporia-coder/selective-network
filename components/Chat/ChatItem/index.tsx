'use client'

import Image from 'next/image'
import * as z from 'zod'
import qs from 'query-string'
import { useGetMemberRoleIcons } from '@/app/hooks/Icons/useGetMemberRoleIcons'
import { ChatItemProps } from './types'
import { MemberRole } from '@prisma/client'
import ActionTooltip from '@/components/ActionTooltip'
import UserAvatar from '@/components/UserAvatar'
import PdfDisplay from '@/components/PdfDisplay'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Edit, Trash } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import { useParams, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import localizedformat from 'dayjs/plugin/localizedFormat'
import { DATE_FORMAT } from '@/app/settings'

dayjs.extend(localizedformat)

const ChatItem = ({
  id,
  content,
  member,
  currentMember,
  deleted,
  isUpdated,
  fileUrl,
  socketUrl,
  socketQuery,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const { serverId } = useParams()
  const { onOpen } = useModal()

  const formSchema = z.object({
    content: z.string().min(1),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  })

  useEffect(() => {
    form.reset({
      content,
    })
  }, [content, form])

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, values)
      setIsEditing(false)
      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectMember = () => {
    if (member.id === currentMember.id) return
    router.push(`/servers/${serverId}/conversations/${member.id}`)
  }

  const memberRoleIcons = useGetMemberRoleIcons('ml-2', 'ml-2')

  const fileType = fileUrl?.split('.').pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPdf = fileType === 'pdf' && fileUrl
  const isImage = fileUrl && !isPdf

  const isLoading = form.formState.isSubmitting

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={handleSelectMember}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={handleSelectMember}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {memberRoleIcons[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {dayjs(timestamp).format(DATE_FORMAT)}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && <PdfDisplay value={fileUrl} label="PDF File" />}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen(Modals.DELETE_MESSAGE, {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
