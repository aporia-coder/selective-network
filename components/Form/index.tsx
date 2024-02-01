import * as z from 'zod'
import { ZodString } from 'zod'
import { Form as FormWrapper } from '../ui/form'
import { FormProps, InitialValuesType, ValidationSchemaType } from './types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const Form = ({ fields, onSubmit, className }: FormProps) => {
  const validationSchema: Record<string, ZodString> = fields.reduce(
    (acc, field) => {
      acc[field.key] = field.validation
      return acc
    },
    {} as ValidationSchemaType
  )

  const initialValues: InitialValuesType = fields.reduce((acc, field) => {
    acc[field.key] = field.initialValues
    return acc
  }, {} as InitialValuesType)

  const formSchema = z.object({
    ...validationSchema,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    },
  })

  return (
    <FormWrapper {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}></form>
    </FormWrapper>
  )
}

export default Form
