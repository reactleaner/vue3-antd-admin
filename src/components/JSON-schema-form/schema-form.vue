<template>
  <Form ref="schemaFormRef" v-bind="getFormProps" :model="formModel">
    <Row v-bind="getRowConfig">
      <template v-for="(schemaItem, index) in formSchema.schemas" :key="schemaItem.field">
        <SchemaFormItem
          :schema-item="schemaItem"
          :set-form-model="setFormModel"
          :form-model="formModel"
        />
      </template>
      <template v-if="$slots['operate-button']">
        <Form.Item>
          <slot name="operate-button"></slot>
        </Form.Item>
      </template>
    </Row>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SchemaForm'
})
</script>

<script setup lang="ts">
import { reactive, ref, PropType, unref, useAttrs, nextTick, computed } from 'vue'
import { Form, Row } from 'ant-design-vue'
import { isString, isFunction } from '@/utils/is'
import SchemaFormItem from './schema-form-item.vue'
import type { FormItemSchema, FormSchema, FormActionType } from './types/form'
import { NamePath } from 'ant-design-vue/lib/form/interface'

const props = defineProps({
  formSchema: {
    // 动态验证表单
    type: Object as PropType<FormSchema>,
    default: () => ({})
  },
  initialValues: {
    // 预置字段默认值
    type: Object as PropType<Recordable>,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])

const attrs = useAttrs()

// 表单项数据
const formModel = reactive(props.initialValues)
// 表单实例
const schemaFormRef = ref<FormActionType>()
// 表单属性
const schemaFormPropsRef = ref<Partial<FormSchema>>({})

// 获取表单所有属性
const getFormProps = computed<Recordable>(() => ({
  ...attrs,
  ...props,
  ...schemaFormPropsRef.value
}))

// 设置表单属性
const setFormProps = (formProps: Partial<FormSchema>) => {
  Object.assign(schemaFormPropsRef.value, formProps)
}

// 设置某个字段的值
const setFormModel = async (key: string, value: any) => {
  formModel[key] = value
  const { validateTrigger } = unref(getFormProps)
  if (!validateTrigger || validateTrigger === 'change') {
    ;(await getSchemaFormRef())?.validateFields([key]).catch((_) => {})
  }
}
// 获取栅栏Row配置
const getRowConfig = computed((): Recordable => {
  const { baseRowStyle = {}, rowProps } = unref(getFormProps)
  return {
    style: baseRowStyle,
    ...rowProps
  }
})

const getSchemaFormRef = async () => {
  await nextTick()
  return unref(schemaFormRef)
}

async function validateFields(nameList?: NamePath[] | undefined) {
  return (await getSchemaFormRef())?.validateFields(nameList)
}

async function validate(nameList?: NamePath[] | undefined) {
  return await (await getSchemaFormRef())?.validate(nameList)
}

async function clearValidate(name?: string | string[]) {
  await (await getSchemaFormRef())?.clearValidate(name)
}

async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
  await (await getSchemaFormRef())?.scrollToField(name, options)
}

// script-setup 模式下，所有数据只是默认 return 给 template 使用，不会暴露到组件外，需要手动指定需要暴露的数据
defineExpose({
  formModel,
  setFormProps,
  setFormModel,
  validateFields,
  validate,
  clearValidate,
  scrollToField
})
</script>

<style lang="less" scoped>
.ant-form {
  .ant-input-group {
    display: flex;
  }

  .ant-checkbox-wrapper {
    //margin-left: 0;
  }
}
</style>
