type ExcludeButtonIfForm<T> = T extends { form: React.ReactNode }
  ? Omit<T, 'button'>
  : T

interface BaseModalTypes {
  isOpen: boolean
  handleClose: () => void
  headerTitle: string
  description?: string | React.ReactNode
  button?: React.ReactNode
  form?: React.ReactNode
}

export type BaseModalProps = ExcludeButtonIfForm<BaseModalTypes>
