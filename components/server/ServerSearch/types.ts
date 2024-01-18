import { SectionTypes } from '@/app/globalTypes'

export interface ServerSearchProps {
  data: {
    label: string
    type: SectionTypes
    data:
      | {
          icon: React.ReactNode | undefined
          name: string
          id: string
        }[]
      | undefined
  }[]
}
