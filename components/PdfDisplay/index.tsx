import { FileIcon, X } from 'lucide-react'
import { PdfDisplayProps } from './types'

const PdfDisplay = ({ value, onChange, label }: PdfDisplayProps) => {
  return (
    <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
      <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
      >
        {label}
      </a>
      {onChange && (
        <button
          onClick={onChange}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default PdfDisplay
