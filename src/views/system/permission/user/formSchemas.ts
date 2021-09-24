import type { FormItemSchema } from '@/components/JSON-schema-form/types/form'

export const schemas: FormItemSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    colProps: {
      span: 8
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e: any) => {
        console.log(e)
      }
    }
  },
  {
    field: 'field2',
    component: 'Input',
    label: '字段2',
    colProps: {
      span: 8
    }
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8
    }
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '时间字段',
    colProps: {
      span: 8
    }
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1'
        },
        {
          label: '选项2',
          value: '2',
          key: '2'
        }
      ]
    }
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    colProps: {
      span: 8
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ]
    }
  }
]
