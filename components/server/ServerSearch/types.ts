import { SidebarSectionTypes } from '@/app/globalTypes'

export interface ServerSearchProps {
  data: {
    label: string
    type: SidebarSectionTypes
    data:
      | {
          icon: React.ReactNode | undefined
          name: string
          id: string
        }[]
      | undefined
  }[]
}
