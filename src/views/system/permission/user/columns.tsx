import type { TableColumn } from '@/components/dynamic-table'
import { Avatar, message, Popconfirm, Space, Tag } from 'ant-design-vue'
import type { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import OperateUserFormModal from './components/OperateUserFormModal.vue'
import { updateUserPassword } from '@/api/system/user'
import { Ref } from 'vue'

export type TableListItem = API.UserListPageResultItem

interface ColumnsParams {
  dynamicTableRef?: any
  deptTree: TreeDataItem[]
  delRowConfirm: (record: API.UserListPageResultItem) => void
}

export const getColumns = ({
  dynamicTableRef,
  deptTree,
  delRowConfirm
}: ColumnsParams): TableColumn<TableListItem>[] => {
  return [
    {
      title: '头像',
      width: 80,
      dataIndex: 'headImg',
      slots: {
        customRender: 'headImg',
        render: (record) => <Avatar src={record.headImg} />
      }
    },
    {
      title: '姓名',
      width: 120,
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '用户名',
      width: 120,
      align: 'center',
      dataIndex: 'username'
    },
    {
      title: '所在部门',
      dataIndex: 'departmentName',
      align: 'center',
      width: 180
    },
    {
      title: '所属角色',
      dataIndex: 'roleNames',
      align: 'center',
      width: 220,
      slots: {
        customRender: 'roleNames',
        render: (record) => (
          <Space>
            {record.roleNames.map((item) => (
              <Tag color={'success'} key={item}>
                {item}
              </Tag>
            ))}
          </Space>
        )
      }
    },
    {
      title: '呢称',
      width: 120,
      align: 'center',
      dataIndex: 'nickName'
    },
    {
      title: '邮箱',
      width: 120,
      align: 'center',
      dataIndex: 'email'
    },
    {
      title: '手机',
      width: 120,
      align: 'center',
      dataIndex: 'phone'
    },
    {
      title: '备注',
      width: 120,
      align: 'center',
      dataIndex: 'remark'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slots: {
        customRender: 'status',
        render: (record) => {
          const isEnable = record.status === 1
          return <Tag color={isEnable ? 'success' : 'red'}>{isEnable ? '启用' : '禁用'}</Tag>
        }
      }
    }
    // {
    //   title: '操作',
    //   width: 200,
    //   dataIndex: 'option',
    //   align: 'center',
    //   fixed: 'right',
    //   slots: {
    //     customRender: 'option',
    //     render: (record) => <>
    //     <OperateUserFormModal
    //         key="add"
    //         modalTitle={'编辑用户'}
    //         deptTree={deptTree}
    //         detail={record}
    //         button={<a>编辑</a>}
    //         reloadTable={() => dynamicTableRef?.value?.loadData()}
    //       />
    //       <ModalForm
    //         key="up"
    //         title={`更改管理员(${record.username})密码`}
    //         layout="horizontal"
    //         trigger={<a>改密</a>}
    //         onFinish={async (values) => {
    //           await updateUserPassword({
    //             userId: record.id,
    //             password: values.password
    //           })
    //           message.success('更改成功！')
    //           return true
    //         }}
    //       >
    //         <ProFormText
    //           name="password"
    //           label="新密码"
    //           placeholder="请输入新密码"
    //           rules={[{ required: true, message: '请输入新密码!' }]}
    //         />
    //       </ModalForm>
    //       <Popconfirm
    //         key="del"
    //         placement="left"
    //         title="你确定要删除该用户吗?"
    //         onConfirm={() => delRowConfirm(record)}
    //       >
    //         <a>删除</a>
    //       </Popconfirm>
    //     </>
    //   }
    // }
  ]
}
