import type { FormSchema, FormItemSchema, FormActionType, UseFormReturnType } from '../types/form'
import type { NamePath } from 'ant-design-vue/lib/form/interface'
import { ref, onUnmounted, unref, Ref, nextTick } from 'vue'

export declare type ValidateFields = (nameList?: NamePath[]) => Promise<Recordable>

export type UseSchemaFormType = [Ref<Nullable<FormActionType>>]

export const useSchemaForm = (props?: Partial<FormSchema>): UseSchemaFormType => {
  const formRef = ref<Nullable<FormActionType>>(null)

  return [formRef]
}
