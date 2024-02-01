import { ZodString } from 'zod'

export type FormFieldType = {
  key: string
  label: string
  validation: ZodString
  initialValues: string
}

export type InitialValuesType = {
  [key in FormFieldType['key']]: string
}

export type ValidationSchemaType = {
  [key in FormFieldType['key']]: ZodString
}

export interface FormProps {
  fields: FormFieldType[]
  onSubmit: () => void
  className?: string
}
