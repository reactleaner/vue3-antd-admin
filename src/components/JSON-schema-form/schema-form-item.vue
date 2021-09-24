<template>
  <Col v-if="vIf" v-bind="schemaItem.colProps">
    <FormItem
      v-bind="{ ...schemaItem.formItemProps }"
      :label="schemaItem.label"
      :name="schemaItem.field"
    >
      <component
        :is="getComponent"
        v-model:value="modelValue[schemaItem.field]"
        v-bind="getComponentProps"
        v-on="componentEvents"
      />
    </FormItem>
  </Col>
</template>

<script setup lang="ts">
import { PropType, unref } from 'vue'
import { computed } from 'vue'
import { Form, Col } from 'ant-design-vue'
import { componentMap } from './componentMap'
import { FormItemSchema } from './types/form'
import { isBoolean, isFunction, isString } from '@/utils/is'
import { useVModel } from '@vueuse/core'

const FormItem = Form.Item

const props = defineProps({
  formModel: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  schemaItem: {
    type: Object as PropType<FormItemSchema>,
    default: () => ({})
  },
  setFormModel: {
    type: Function as PropType<(key: string, value: any) => void>,
    default: null
  }
})

const modelValue = useVModel(props, 'formModel')

const valuesRef = computed(() => {
  const { formModel, schemaItem } = props
  return { formModel, schemaItem, field: schemaItem.field }
})
/**
 * @description 当前表单项组件
 */
const getComponent = computed(() => {
  const component = props.schemaItem.component
  return isString(component) ? componentMap[component] : component
})

/**
 * @description 组件props
 */
const getComponentProps = computed(() => {
  const { formModel, schemaItem } = props
  const componentProps = schemaItem.componentProps
  if (isFunction(componentProps)) {
    return componentProps({ formModel, schemaItem })
  }
  return componentProps
})

/**
 * @description 组件事件
 */
const componentEvents = computed(() => {
  const componentProps = props.schemaItem?.componentProps || {}
  return Object.keys(componentProps).reduce((prev, key) => {
    if (/on([A-Z])/.test(key)) {
      // eg: onChange => change
      const eventKey = key.replace(/on([A-Z])/, '$1').toLocaleLowerCase()
      prev[eventKey] = componentProps[key]
    }
    return prev
  }, {})
})

const vIf = computed(() => {
  const isShow = props.schemaItem.vIf
  if (Object.is(isShow, undefined)) {
    return true
  }
  if (isBoolean(isShow)) {
    return isShow
  }
  if (isFunction(isShow)) {
    return isShow(unref(valuesRef))
  }
  return true
})
</script>
