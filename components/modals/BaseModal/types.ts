export interface BaseModalProps {
  isOpen: boolean
  handleClose: () => void
  headerTitle: string
  description?: string | React.ReactNode
  button: React.ReactNode
}
