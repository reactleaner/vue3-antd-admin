import type { FormItemSchema } from '@/components/JSON-schema-form/types/form';
import { getRoleList } from '@/api/system/role';

export const schemas: FormItemSchema[] = [
  {
    field: 'dept',
    component: 'TreeSelect',
    label: '所属部门',
    componentProps: {
      // fieldNames: {
      //   label: 'deptName',
      //   key: 'id',
      //   value: 'id'
      // },
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'roles',
    component: 'Select',
    label: '所属角色',
    rules: [{ required: true, type: 'number' }],
    componentProps: {
      request: async () => {
        const data = await getRoleList();
        return data.map((n) => ({ label: n.name, value: n.id }));
      },
    },
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '时间字段',
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
];
