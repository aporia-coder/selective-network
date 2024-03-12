'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { LoaderProps } from './types'

const Loader = ({ className, message }: LoaderProps) => {
  return (
    <>
      <Loader2
        className={cn('w-10 h-10 animate-spin text-zinc-500 mb-1', className)}
      />
      {message && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
      )}
    </>
  )
}

export default Loader
