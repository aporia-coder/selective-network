import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2
      className={cn('w-10 h-10 animate-spin text-zinc-500', className)}
    />
  )
}

export default Loader
