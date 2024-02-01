import { cn } from '@/lib/utils'
import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'

export const useGetMemberRoleIcons = (
  moderatorClassName?: string,
  adminClassName?: string
) => {
  return useMemo(() => {
    return {
      [MemberRole.GUEST]: null,
      [MemberRole.MODERATOR]: (
        <ShieldCheck
          className={cn('h-4 w-4 text-indigo-500', moderatorClassName)}
        />
      ),
      [MemberRole.ADMIN]: (
        <ShieldAlert className={cn('h-4 w-4 text-rose-500', adminClassName)} />
      ),
    }
  }, [moderatorClassName, adminClassName])
}
