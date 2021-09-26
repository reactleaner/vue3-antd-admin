<template>
  <Col v-if="vIf" v-bind="schemaItem.colProps">
    <FormItem
      v-bind="{ ...schemaItem.formItemProps }"
      :label="schemaItem.label"
      :name="schemaItem.field"
      :labelCol="itemLabelWidthProp.labelCol"
      :wrapperCol="itemLabelWidthProp.wrapperCol"
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
import type { PropType, Ref } from 'vue'
import { computed, unref, toRefs } from 'vue'
import { Form, Col } from 'ant-design-vue'
import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { componentMap, ComponentMapType } from './componentMap'
import { FormItemSchema, FormSchema, RenderCallbackParams } from './types/form'
import { isBoolean, isFunction, isNull, isString } from '@/utils/is'
import { useVModel } from '@vueuse/core'
import { useItemLabelWidth } from './hooks/useLabelWidth'
import cloneDeep from 'lodash/cloneDeep'
import { createPlaceholderMessage } from './helper'

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
  schema: {
    type: Object as PropType<FormSchema>,
    default: () => ({})
  },
  setFormModel: {
    type: Function as PropType<(key: string, value: any) => void>,
    default: null
  }
})

const modelValue = useVModel(props, 'formModel')

const { schemaItem, schema } = toRefs(props) as {
  schemaItem: Ref<FormItemSchema>
  schema: Ref<FormSchema>
}

const itemLabelWidthProp = useItemLabelWidth(schemaItem, schema)

const valuesRef = computed(() => {
  const { formModel, schemaItem } = props
  return { formModel, schemaItem, field: schemaItem.field }
})

const getValues = computed(() => {
  const { formModel, schemaItem } = props
  const { mergeDynamicData } = props.schema
  return {
    field: schemaItem.field,
    formModel: formModel,
    values: {
      ...mergeDynamicData,
      ...formModel
    } as Recordable,
    schemaItem: schemaItem
  }
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

function getShow(): { isShow: boolean; isIfShow: boolean } {
  const { vShow, vIf, isAdvanced } = props.schemaItem
  const { showAdvancedButton } = props.schema
  const itemIsAdvanced = showAdvancedButton ? (isBoolean(isAdvanced) ? isAdvanced : true) : true

  let isShow = true
  let isIfShow = true

  if (isBoolean(vShow)) {
    isShow = vShow
  }
  if (isBoolean(vIf)) {
    isIfShow = vIf
  }
  if (isFunction(vShow)) {
    isShow = vShow(unref(getValues))
  }
  if (isFunction(vIf)) {
    isIfShow = vIf(unref(getValues))
  }
  isShow = isShow && itemIsAdvanced
  return { isShow, isIfShow }
}

const getComponentsProps = computed(() => {
  const { schemaItem, tableAction, formModel, formActionType } = props
  let { componentProps = {} } = schemaItem
  if (isFunction(componentProps)) {
    componentProps = componentProps({ schemaItem, tableAction, formModel, formActionType }) ?? {}
  }
  return componentProps as Recordable
})

export function setComponentRuleType(
  rule: ValidationRule,
  component: ComponentMapType,
  valueFormat: string
) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object'
  } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array'
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number'
  }
}

function handleRules(): ValidationRule[] {
  const {
    rules: defRules = [],
    component,
    rulesMessageJoinLabel,
    label,
    dynamicRules,
    required
  } = props.schemaItem

  if (isFunction(dynamicRules)) {
    return dynamicRules(unref(getValues)) as ValidationRule[]
  }

  let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[]
  const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.schema

  const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
    ? rulesMessageJoinLabel
    : globalRulesMessageJoinLabel
  const defaultMsg = isString(component)
    ? `${createPlaceholderMessage(component)}${joinLabel ? label : ''}`
    : ''

  function validator(rule: any, value: any) {
    const msg = rule.message || defaultMsg
    if (value === undefined || isNull(value)) {
      // 空值
      return Promise.reject(msg)
    } else if (Array.isArray(value) && value.length === 0) {
      // 数组类型
      return Promise.reject(msg)
    } else if (typeof value === 'string' && value.trim() === '') {
      // 空字符串
      return Promise.reject(msg)
    } else if (
      typeof value === 'object' &&
      Reflect.has(value, 'checked') &&
      Reflect.has(value, 'halfChecked') &&
      Array.isArray(value.checked) &&
      Array.isArray(value.halfChecked) &&
      value.checked.length === 0 &&
      value.halfChecked.length === 0
    ) {
      // 非关联选择的tree组件
      return Promise.reject(msg)
    }
    return Promise.resolve()
  }

  const getRequired = isFunction(required) ? required(unref(getValues)) : required

  if ((!rules || rules.length === 0) && getRequired) {
    rules = [{ required: getRequired, validator }]
  }

  const requiredRuleIndex: number = rules.findIndex(
    (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
  )

  if (requiredRuleIndex !== -1) {
    const rule = rules[requiredRuleIndex]
    const { isShow } = getShow()
    if (!isShow) {
      rule.required = false
    }
    if (component && isString(component)) {
      if (!Reflect.has(rule, 'type')) {
        rule.type = component === 'InputNumber' ? 'number' : 'string'
      }

      rule.message = rule.message || defaultMsg

      if (component.includes('Input') || component.includes('Textarea')) {
        rule.whitespace = true
      }
      const valueFormat = unref(getComponentsProps)?.valueFormat
      setComponentRuleType(rule, component, valueFormat)
    }
  }

  // Maximum input length rule check
  const characterInx = rules.findIndex((val) => val.max)
  if (characterInx !== -1 && !rules[characterInx].validator) {
    rules[characterInx].message = rules[characterInx].message
  }
  return rules
}
</script>
