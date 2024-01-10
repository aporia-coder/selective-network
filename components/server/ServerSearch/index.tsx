'use client'

import { Search } from 'lucide-react'
import { ServerSearchProps } from './types'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ServerSearchTypes } from '@/app/globalTypes'
import { featureToggle } from '@/app/settings'

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false)
  const { serverId } = useParams()
  const router = useRouter()

  // needs fixing
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', keyDown)

    return () => {
      document.removeEventListener('keydown', keyDown)
    }
  }, [])

  const onClick = (id: string, type: ServerSearchTypes) => {
    setOpen(false)

    if (type === ServerSearchTypes.MEMBER) {
      router.push(`/servers/${serverId}/conversations/${id}`)
    } else {
      router.push(`/servers/${serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <button
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-400 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        {featureToggle.keyboardShortcutSearch && (
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
            {/* GET SOMETHING TO CHECK FOR WINDOWS/APPLE HERE */}
            <span>CTRL</span>K
          </kbd>
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for channels and members" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ label, type, data: innerData }) => {
            if (innerData?.length === 0) return null

            return (
              <CommandGroup key={label}>
                {innerData?.map(({ icon, name, id }) => (
                  <>
                    <CommandItem onSelect={() => onClick(id, type)} key={id}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  </>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
