<template>
  <SplitPanel>
    <template #left-content>
      <div class="flex justify-between">
        <div>组织架构</div>
        <Space>
          <Tooltip placement="top">
            <template #title>新增部门 </template>
            <PlusOutlined @click="openDeptModal" />
          </Tooltip>
          <Tooltip placement="top">
            <template #title>刷新 </template>
            <SyncOutlined spin />
          </Tooltip>
        </Space>
      </div>
      <Tree
        v-model:expandedKeys="state.expandedKeys"
        autoExpandParent
        :tree-data="state.deptTree"
        @select="onTreeSelect"
      >
        <template #title="{ key: treeKey, title }">
          <Dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
                <a-menu-item key="1" @click="openDeptModal">编辑</a-menu-item>
                <a-menu-item key="2" @click="delDept">删除</a-menu-item>
              </a-menu>
            </template>
          </Dropdown>
        </template>
      </Tree>
    </template>
    <template #right-content>
      <DynamicTable ref="dynamicTableRef" :load-data="loadTableData" :columns="columns" />
    </template>
  </SplitPanel>
</template>

<script lang="tsx">
export default { name: 'SystemUser' }
</script>

<script setup lang="tsx">
import type { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { ref, reactive, onMounted } from 'vue'
import { Tree, Dropdown, Space, Tooltip } from 'ant-design-vue'
import { SyncOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { SplitPanel } from '@/components/split-panel'
import { DynamicTable, LoadDataParams, DynamicTableInstance } from '@/components/dynamic-table'
import { getColumns } from './columns'
import { deleteUsers, getUserListPage } from '@/api/system/user'
import { getDeptList, deleteDept } from '@/api/system/dept'
import { useFormModal } from '@/hooks/useModal/index'
import { schemas } from './formSchemas'

interface State {
  expandedKeys: number[]
  departmentIds: number[]
  deptTree: TreeDataItem[]
}

const list2tree = (
  depts: API.SysDeptListResult[],
  parentId: null | number = null
): TreeDataItem[] => {
  return depts
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      title: item.name,
      key: item.id,
      children: list2tree(depts, item.id)
    }))
}

const [showModal] = useFormModal()

const dynamicTableRef = ref<DynamicTableInstance>()

const state = reactive<State>({
  expandedKeys: [],
  departmentIds: [],
  deptTree: []
})

const openDeptModal = () => {
  showModal({
    modalProps: {
      title: '表单模态框',
      onFinish: async (values) => {
        console.log('表单模态框', values)
        return true
      }
    },
    formSchema: {
      labelWidth: 100,
      layout: 'vertical',
      schemas,
      actionColOptions: {
        span: 23
      },
      fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']]
    }
  })
}

const delDept = () => {
  // $modal.show({
  //   title: '删除',
  //   content: () => <>删除部门</>
  // })
}

/**
 * 获取部门列表
 */
const fetchDeptList = async () => {
  const dept = await getDeptList()
  state.deptTree = list2tree(dept)
  state.expandedKeys = [...state.expandedKeys, ...state.deptTree.map((n) => Number(n.key))]
}

onMounted(() => {
  fetchDeptList()
})

/**
 * @description 表格删除行
 */
const delRowConfirm = (record: API.UserListPageResultItem | API.UserListPageResultItem[]) => {
  const userIds = Array.isArray(record) ? record.map((n) => n.id) : [record.id]
  deleteUsers({ userIds }).finally(dynamicTableRef.value?.reloadTableData)
}

/**
 * 点击部门
 */
const onTreeSelect = (selectedKeys: number[]) => {
  state.departmentIds = selectedKeys
  dynamicTableRef?.value?.reloadTableData?.()
}

const columns = getColumns({ delRowConfirm, dynamicTableRef, deptTree: [] })

const loadTableData = async ({ page, limit }: LoadDataParams) => {
  const data = await getUserListPage({
    page,
    limit,
    departmentIds: state.departmentIds.length ? state.departmentIds : undefined
  })
  return data
}

const onContextMenuClick = (treeKey: string, menuKey: string) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
}
</script>
<style></style>
