export enum ServerSearchTypes {
  CHANNEL = 'channel',
  MEMBER = 'member',
}

export interface ServerSearchProps {
  data: {
    label: string
    type: ServerSearchTypes
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}
