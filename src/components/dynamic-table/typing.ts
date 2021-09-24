import type { ColumnProps, TableProps } from 'ant-design-vue/lib/table/interface'
import type { PaginationProps } from 'ant-design-vue/lib/pagination/Pagination'
import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes'
import type { VNode } from 'vue'

/**
 * 加载表格数据的参数
 */
export interface LoadDataParams extends TableProps {
  /** 根据自己业务需求定义页码 */
  page: number
  /** 根据自己业务需求定义页数据条数 */
  limit: number
}

export interface ActionOptions {
  type: 'select' | 'button' | 'text' | 'popconfirm' // 控制类型，默认为a,可选： select | button | text
  text: string
  permission?: {
    // 权限
    action?: 'create' | 'delete' | 'update' | 'retrieve' // CRUD权限：创建（Create）、更新（Update）、读取（Retrieve）和删除（Delete）操作
    effect?: 'disabled'
  }
  props?: any // 组件属性，v-bind="props"
  func?: ({ text, record, index }, callback: (...rest) => any) => any // 动作事件触发回调
}
/**
 * 表格属性
 */
export interface TableColumn<T = any> extends ColumnProps {
  title: string
  dataIndex: string
  width?: number
  slots?: { [K in keyof ColumnProps['slots']]: ColumnProps['slots'][K] } & {
    /** 自定义渲染函数，优先级比模板slot高 */
    render?: (record: T) => Element | VNode
    [key: string]: any
  }
  slotsType?: 'format' | 'link' | 'component'
  slotsFunc?: (...rest) => any
  actions?: ActionOptions[]
}

export interface ActionItem {
  type: 'popconfirm' | 'select' | 'button' | 'text' // 控制类型，默认为a,可选： select | button | text
  text: string
  permission: {
    // 权限
    action: 'delete'
    effect: 'disabled'
  }
  props: ButtonProps | any
  func: ({ record }, refreshTableData) => any
}
