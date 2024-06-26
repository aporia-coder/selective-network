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
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Button } from '../ui/button'
import FileUpload from '../FileUpload'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useIsModalOpen } from '@/app/hooks/Modals/useIsModalOpen'
import { Modals, useModal } from '@/app/hooks/Modals/useModalStore'
import qs from 'query-string'

const AddFileModal = () => {
  const { isOpen, type, onClose, meta } = useModal()
  const { apiUrl, query } = meta

  const isModalOpen = useIsModalOpen(isOpen, type, Modals.ADD_FILE)
  const router = useRouter()

  const formSchema = z.object({
    fileUrl: z.string().min(1, {
      message: 'Image or PDF is required',
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const handleModalClose = () => {
    form.reset()
    router.refresh()
    onClose()
  }

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl ?? '',
        query,
      })

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })
      handleModalClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFileModal
