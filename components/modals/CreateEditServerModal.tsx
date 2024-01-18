'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import FileUpload from '../FileUpload'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'
import { useEffect } from 'react'

const CreateEditServerModal = () => {
  const { isOpen, onClose, type, meta } = useModal()
  const { isEdit, server } = meta
  const isModalOpen = useIsModalOpen(isOpen, type, Modals.CREATE_EDIT_SERVER)

  const router = useRouter()

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Server name is required',
    }),
    imageUrl: z.string().min(1, {
      message: 'Server image is required',
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEdit ? (server?.name as string) : '',
      imageUrl: isEdit ? (server?.imageUrl as string) : '',
    },
  })

  useEffect(() => {
    if (isEdit) {
      form.setValue('name', server?.name as string)
      form.setValue('imageUrl', server?.imageUrl as string)
    }
  }, [form, isEdit, server])

  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  const isLoading = form.formState.isSubmitting

  const handleCreateServer = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values)
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditServer = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/server/${server?.id}`, values)
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = isEdit ? handleEditServer : handleCreateServer

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {!isEdit
              ? 'Give your server a unique personality with a name and an image, you can always change it later!'
              : 'Edit your server name and image'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
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

export default CreateEditServerModal
