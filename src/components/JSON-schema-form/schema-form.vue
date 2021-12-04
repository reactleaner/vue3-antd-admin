<template>
  <Form ref="schemaFormRef" v-bind="getFormProps" :model="formModel">
    <Row v-bind="getRowConfig">
      <template v-for="schemaItem in formSchema.schemas" :key="schemaItem.field">
        <SchemaFormItem
          :schema-item="schemaItem"
          :schema="formSchemaRef"
          :set-form-model="setFormModel"
          :form-model="formModel"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </SchemaFormItem>
      </template>
      <template v-if="$slots['operate-button']">
        <FormItem>
          <slot name="operate-button"></slot>
        </FormItem>
      </template>
    </Row>
  </Form>
</template>

<script lang="ts">
  import {
    reactive,
    ref,
    PropType,
    unref,
    defineComponent,
    getCurrentInstance,
    computed,
  } from 'vue';
  import { Form, Row } from 'ant-design-vue';
  import { isNullOrUnDef, isObject, isArray } from '@/utils/is';
  import SchemaFormItem from './schema-form-item.vue';
  import type { FormItemSchema, FormSchema, FormActionType } from './types/form';
  import { NamePath } from 'ant-design-vue/lib/form/interface';
  import { merge, uniqBy, cloneDeep } from 'lodash';

  export default defineComponent({
    name: 'SchemaForm',
    components: { Form, Row, SchemaFormItem, FormItem: Form.Item },
    props: {
      formSchema: {
        // 动态验证表单
        type: Object as PropType<FormSchema>,
        default: () => ({}),
      },
      initialValues: {
        // 预置字段默认值
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
    },
    emits: ['submit'],
    setup(props, { attrs }) {
      const CurrentInstance = getCurrentInstance();
      // 表单项数据
      const formModel = reactive(props.initialValues);
      // 表单实例
      const schemaFormRef = ref<FormActionType>();
      // 表单属性
      const schemaFormPropsRef = ref<Partial<FormSchema>>({});

      // 获取表单所有属性
      const getFormProps = computed<Recordable>(() => ({
        ...attrs,
        ...props,
        ...schemaFormPropsRef.value,
      }));

      // 将formSchema克隆一份，避免修改原有的formSchema
      const formSchemaRef = ref<any>(cloneDeep(props.formSchema));

      // 初始化数据
      unref(formSchemaRef).schemas?.forEach((item) => {
        const { defaultValue } = item;
        if (!isNullOrUnDef(defaultValue)) {
          formModel[item.field] = defaultValue;
        }
      });

      // 设置表单属性
      const setFormProps = (formProps: Partial<FormSchema>) => {
        Object.assign(schemaFormPropsRef.value, formProps);
      };

      // 设置某个字段的值
      const setFormModel = (key: string, value: any) => {
        formModel[key] = value;
        const { validateTrigger } = unref(getFormProps);
        if (!validateTrigger || validateTrigger === 'change') {
          schemaFormRef.value?.validateFields([key]).catch((_) => {});
        }
      };
      // 获取栅栏Row配置
      const getRowConfig = computed((): Recordable => {
        const { baseRowStyle = {}, rowProps } = unref(getFormProps);
        return {
          style: baseRowStyle,
          ...rowProps,
        };
      });

      async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
        let updateData: Partial<FormItemSchema>[] = [];
        if (isObject(data)) {
          updateData.push(data as FormItemSchema);
        }
        if (isArray(data)) {
          updateData = [...data];
        }

        const hasField = updateData.every(
          (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
        );

        if (!hasField) {
          console.error(
            'All children of the form Schema array that need to be updated must contain the `field` field',
          );
          return;
        }
        const schema: FormItemSchema[] = [];
        updateData.forEach((item) => {
          unref(formSchemaRef).schemas.forEach((val) => {
            if (val.field === item.field) {
              const newSchema = merge(val, item);
              schema.push(newSchema);
            } else {
              schema.push(val);
            }
          });
        });
        unref(formSchemaRef).schemas = uniqBy(schema, 'field');
        CurrentInstance?.proxy?.$forceUpdate();
      }

      async function validateFields(nameList?: NamePath[] | undefined) {
        return schemaFormRef.value?.validateFields(nameList);
      }

      async function validate(nameList?: NamePath[] | undefined) {
        return await schemaFormRef.value?.validate(nameList);
      }

      async function clearValidate(name?: string | string[]) {
        await schemaFormRef.value?.clearValidate(name);
      }

      async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
        await schemaFormRef.value?.scrollToField(name, options);
      }

      return {
        schemaFormRef,
        schemaFormPropsRef,
        getFormProps,
        formModel,
        formSchemaRef,
        setFormProps,
        setFormModel,
        getRowConfig,
        validateFields,
        updateSchema,
        validate,
        clearValidate,
        scrollToField,
      };
    },
  });
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
