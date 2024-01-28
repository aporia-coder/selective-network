import { UploadDropzone } from '../../lib/uploadthing'
import '@uploadthing/react/styles.css'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  value: string
  onChange: (url?: string) => void
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  // extracting filtetype, either image or pdf
  const fileType = value.split('.').pop()

  // check if value exists and is an image
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-40 w-40">
        <Image src={value} fill alt="Upload Image" className="rounded-full" />
        <button className="bg-rose-500 text-white p-2 rounded-full absolute top-0 left-32 shadow-sm">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
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
