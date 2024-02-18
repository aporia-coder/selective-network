import { UploadDropzone } from '../../lib/uploadthing'
import '@uploadthing/react/styles.css'
import { X } from 'lucide-react'
import Image from 'next/image'
import PdfDisplay from '../PdfDisplay'
import { UseFormReturn } from 'react-hook-form'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  value: string
  onChange: (url?: string) => void
  form?: UseFormReturn<
    {
      name: string
      imageUrl: string
    },
    any,
    undefined
  >
}

const FileUpload = ({ endpoint, value, onChange, form }: FileUploadProps) => {
  // extracting filtetype, either image or pdf
  const fileType = value.split('.').pop()

  const isImage = fileType !== 'pdf'

  const resetImage = () => form?.setValue('imageUrl', '')

  // check if value exists and is an image
  if (value && isImage) {
    return (
      <div className="relative h-40 w-40">
        <Image src={value} fill alt="Upload Image" className="rounded-full" />
        <button
          className="bg-rose-500 text-white p-2 rounded-full absolute top-0 left-32 shadow-sm"
          onClick={resetImage}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && !isImage) {
    return (
      <PdfDisplay value={value} label={value} onChange={() => onChange('')} />
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
      // value={value}
    />
  )
}

export default FileUpload
