import type { TableColumn } from '@/components/dynamic-table';
import { Avatar, Space, Tag } from 'ant-design-vue';

export type TableListItem = API.UserListPageResultItem;

interface ColumnsParams {
  dynamicTableRef?: any;
  openUserModal: (record: API.UserListPageResultItem) => void;
  delRowConfirm: (record: API.UserListPageResultItem) => void;
}

export const getColumns = ({ openUserModal }: ColumnsParams): TableColumn<TableListItem>[] => {
  return [
    {
      title: '头像',
      width: 80,
      dataIndex: 'headImg',
      bodyCell: ({ record }) => <Avatar src={record.headImg} />,
    },
    {
      title: '姓名',
      width: 120,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '用户名',
      width: 120,
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '所在部门',
      dataIndex: 'departmentName',
      align: 'center',
      width: 180,
    },
    {
      title: '所属角色',
      dataIndex: 'roleNames',
      align: 'center',
      width: 220,
      bodyCell: ({ record }) => (
        <Space>
          {record.roleNames.map((item) => (
            <Tag color={'success'} key={item}>
              {item}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '呢称',
      width: 120,
      align: 'center',
      dataIndex: 'nickName',
    },
    {
      title: '邮箱',
      width: 120,
      align: 'center',
      dataIndex: 'email',
    },
    {
      title: '手机',
      width: 120,
      align: 'center',
      dataIndex: 'phone',
    },
    {
      title: '备注',
      width: 120,
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      bodyCell: ({ record }) => {
        const isEnable = record.status === 1;
        return <Tag color={isEnable ? 'success' : 'red'}>{isEnable ? '启用' : '禁用'}</Tag>;
      },
    },
    {
      title: '操作',
      width: 200,
      dataIndex: '$action',
      align: 'center',
      fixed: 'right',
      actions: ({ record }) => [
        {
          label: '编辑',
          onClick: () => openUserModal(record),
        },
        {
          label: '改密',
          popConfirm: {
            title: '是否取消编辑',
            onConfirm: () => {
              console.log(record, '您');
            },
          },
        },
        {
          label: '删除',
          popConfirm: {
            title: '你确定要删除吗？',
            onConfirm: () => {
              console.log('确认删除', record);
            },
          },
        },
      ],
    },
  ];
};
