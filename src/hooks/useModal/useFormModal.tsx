import { useModal } from './index'
import { SchemaForm, FormSchema, useSchemaForm } from '@/components/JSON-schema-form'
import type { FormModalProps } from './types'

interface ShowModalProps {
  modalProps: FormModalProps
  formSchema: FormSchema
}

export const useFormModal = () => {
  const { show } = useModal()

  const showModal = ({ modalProps, formSchema }: ShowModalProps) => {
    const [formRef] = useSchemaForm()

    show({
      ...modalProps,
      content: () => <SchemaForm ref={formRef} formSchema={formSchema}></SchemaForm>,
      onOk: async () => {
        await formRef.value?.validate()
        modalProps?.onFinish?.(formRef.value?.formModel || {})
      }
    })
  }

  return [showModal]
}
