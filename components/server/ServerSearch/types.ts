import { SidebarSectionTypes } from '@/app/globalTypes'

export interface ServerSearchProps {
  data: {
    label: string
    type: SidebarSectionTypes
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}
