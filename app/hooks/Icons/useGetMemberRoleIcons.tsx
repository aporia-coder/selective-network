import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'

export const useGetMemberRoleIcons = () => {
  return useMemo(() => {
    return {
      [MemberRole.GUEST]: null,
      [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
      ),
      [MemberRole.ADMIN]: (
        <ShieldAlert className="h-4 w-4 text-rose-500 mr-2" />
      ),
    }
  }, [])
}
