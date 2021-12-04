import type { TableColumnType, TableProps } from 'ant-design-vue';
import type { VNode } from 'vue';
import type { ActionItem } from './types/tableAction';

/**
 * 加载表格数据的参数
 */
export interface LoadDataParams extends TableProps {
  /** 根据自己业务需求定义页码 */
  page: number;
  /** 根据自己业务需求定义页数据条数 */
  limit: number;
}

// export interface ActionOptions {
//   type: 'select' | 'button' | 'text' | 'popconfirm' // 控制类型，默认为a,可选： select | button | text
//   text: string
//   permission?: {
//     // 权限
//     action?: 'create' | 'delete' | 'update' | 'retrieve' // CRUD权限：创建（Create）、更新（Update）、读取（Retrieve）和删除（Delete）操作
//     effect?: 'disabled'
//   }
//   props?: any // 组件属性，v-bind="props"
//   func?: ({ text, record, index }, callback: (...rest) => any) => any // 动作事件触发回调
// }

export type ColumnParams<T = any> = {
  record: T;
  text: string;
  index: number;
  column: TableColumnType;
};

/**
 * 表格属性
 */
export interface TableColumn<T = any> extends TableColumnType {
  title: string;
  dataIndex: string;
  width?: number;
  bodyCell?: (params: ColumnParams<T>) => VNode | string;
  actions?: (params: ColumnParams<T>) => ActionItem[];
}

// export interface ActionItem {
//   type: 'popconfirm' | 'select' | 'button' | 'text' // 控制类型，默认为a,可选： select | button | text
//   text: string
//   permission: {
//     // 权限
//     action: 'delete'
//     effect: 'disabled'
//   }
//   props: ButtonProps | any
//   func: ({ record }, refreshTableData) => any
// }
