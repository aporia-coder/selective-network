'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Modals, useModal } from '@/app/hooks/useModalStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ChannelType } from '@prisma/client'
import qs from 'query-string'
import { useEffect } from 'react'
import { useIsModalOpen } from '@/app/hooks/useIsModalOpen'

const CreateEditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.CREATE_EDIT_CHANNEL)
  const router = useRouter()
  const { serverId } = useParams()
  const { channelType, isEdit, channel } = data

  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: 'Channel name is required',
      })
      .refine((name) => name !== 'general', {
        // check this works with upper/lowercase values
        message: `Channel Name cannot be 'general'`,
      }),
    type: z.nativeEnum(ChannelType),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: (isEdit && channel && channel.type) || ChannelType.TEXT,
    },
  })

  useEffect(() => {
    if (channelType && !isEdit) {
      form.setValue('type', channelType)
    } else if (channel && isEdit) {
      form.setValue('name', channel?.name)
      form.setValue('type', channel?.type)
    }
  }, [channelType, form, isEdit, channel])

  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  const isLoading = form.formState.isSubmitting

  const handleCreateChannel = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverId,
        },
      })

      await axios.post(url, values)
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditChannel = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId,
        },
      })

      await axios.patch(url, values)
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = isEdit ? handleEditChannel : handleCreateChannel

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {isEdit ? 'Edit channel' : 'Create a channel'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="General" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((channelData) => (
                          <SelectItem
                            key={channelData}
                            value={channelData}
                            className="capitalize"
                          >
                            {channelData.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                {isEdit ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateEditChannelModal
