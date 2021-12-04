import { useModal } from './index';
import { nextTick } from 'vue';
import { SchemaForm, FormSchema, useSchemaForm } from '@/components/JSON-schema-form';
import type { FormModalProps } from './types';

interface ShowModalProps {
  modalProps: FormModalProps;
  formSchema: FormSchema;
}

export const useFormModal = () => {
  const { show } = useModal();

  const showModal = async ({ modalProps, formSchema }: ShowModalProps) => {
    const [formRef] = useSchemaForm();

    await show({
      ...modalProps,
      content: () => <SchemaForm ref={formRef} formSchema={formSchema}></SchemaForm>,
      onOk: async () => {
        try {
          await formRef.value?.validate();
          modalProps?.onFinish?.(formRef.value?.formModel || {});
        } catch (error) {
          modalProps?.onFail?.(formRef.value?.formModel || {});
          return Promise.reject(error);
        }
      },
    });

    await nextTick();

    return formRef;
  };

  return [showModal] as const;
};
