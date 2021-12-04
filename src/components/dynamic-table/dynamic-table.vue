<template>
  <Table
    ref="tableRef"
    :columns="columns"
    :loading="loading"
    :rowSelection="rowSelection"
    :rowKey="rowKey"
    size="middle"
    :data-source="tableData"
    :pagination="pageOptions"
    bordered
    :customRow="customRow"
    v-bind="$attrs"
    @change="paginationChange"
  >
    <template
      v-for="slotName in defaultSlots.filter((name) => Object.hasOwn($slots, name))"
      #[slotName]="slotData"
      :key="slotName"
    >
      <slot :name="slotName" v-bind="slotData"></slot>
    </template>

    <!-- 个性化单元格 start -->
    <template v-for="slotName in ['bodyCell', 'headerCell']" #[slotName]="slotData" :key="slotName">
      <slot :name="slotName" v-bind="slotData"></slot>
      <!-- 表格行操作start -->
      <template v-if="slotName === 'bodyCell' && getColumnKey(slotData.column) === '$action'">
        <TableAction :actions="slotData.column.actions(slotData)" />
      </template>
      <!-- 表格行操作end -->
      <template
        v-for="slotItem in columns.filter((item) => item[slotName])"
        :key="getColumnKey(slotItem)"
      >
        <component
          :is="slotItem?.[slotName]?.(slotData)"
          v-if="getColumnKey(slotData.column) === getColumnKey(slotItem)"
        />
      </template>
    </template>
    <!-- 个性化单元格 end -->
  </Table>
</template>

<script lang="ts">
  import { defineComponent, reactive, PropType, ref, toRefs, watch } from 'vue';
  import { Card, Select, Table, Popconfirm } from 'ant-design-vue';
  import { TableProps } from 'ant-design-vue/lib/components';
  import { usePagination, PageOption } from '@/hooks/usePagination';
  import type { LoadDataParams, TableColumn } from './typing';
  import { isFunction } from '@/utils/is';
  import TableAction from './table-action.vue';

  export default defineComponent({
    name: 'DynamicTable',
    components: {
      Table,
      [Card.name]: Card,
      [Select.name]: Select,
      [Popconfirm.name]: Popconfirm,
      Option: Select.Option,
      TableAction,
    },
    inheritAttrs: false,
    props: {
      dataSource: {
        type: Array as PropType<any[]>,
      },
      columns: {
        type: Object as PropType<TableColumn[]>,
        required: true,
      },
      loadData: {
        // 获取列表数据函数API
        type: Function as PropType<
          (params?: LoadDataParams, flush?: boolean) => Promise<API.TableListResult>
        >,
      },
      rowSelection: {
        type: Object,
      },
      rowKey: {
        // 表格唯一字段
        type: [String, Function] as PropType<string | ((record: any) => string)>,
        default: 'id',
      },
      pageOption: {
        // 分页参数
        type: Object as PropType<PageOption>,
        default: () => ({}),
      },
      showSummary: {
        // 是否在表格尾部展示合计行
        type: Boolean as PropType<boolean>,
        default: false,
      },
      sumText: {
        // 合计显示文本
        type: String as PropType<string>,
        default: '合计',
      },
      /** 合计行计算方法 */
      summaryFunc: {
        type: Function as PropType<(params: { dataSource: any; columns: any }) => string[]>,
      },
      dragColEnable: {
        // 是否开启列拖拽
        type: Boolean as PropType<boolean>,
        default: true,
      },
      dragRowEnable: Boolean as PropType<boolean>,
    },
    emits: ['change', 'update:pageOption'],
    setup(props, { emit, slots }) {
      const tableRef = ref<InstanceType<typeof Table>>();
      console.log('slots', slots);
      const { pageOptions } = usePagination();

      // 默认支持的插槽
      const defaultSlots = [
        'emptyText',
        'expandIcon',
        'title',
        'footer',
        'summary',
        'expandedRowRender',
        'customFilterIcon',
        'customFilterDropdown',
      ];

      Object.assign(pageOptions.value, props.pageOption);

      const state = reactive({
        expandItemRefs: {},
        customRow: () => ({} as TableProps['customRow']),
        tableData: [] as any[], // 表格数据
        actions:
          props.columns.find((item) => [item.dataIndex, item.key].includes('action'))?.actions ||
          [], // 表格操作（如：编辑、删除的按钮等）
        loading: false, // 表格加载
      });

      // 如果外界设置了dataSource，那就直接用外界提供的数据
      watch(
        () => props.dataSource,
        (val) => {
          if (val) {
            state.tableData = val;
          }
        },
        {
          deep: true,
          immediate: true,
        },
      );

      /**
       * @param {object} params 表格查询参数
       * @param {boolean} flush 是否将页数重置到第一页
       * @description 获取表格数据
       */
      const reloadTableData = async (params = {}, flush = false) => {
        // 如果用户没有提供dataSource并且getListFunc是一个函数，那就进行接口请求
        if (
          Object.is(props.dataSource, undefined) &&
          Object.prototype.toString.call(props.loadData).includes('Function')
        ) {
          const queryParams = {
            page: flush ? 1 : pageOptions.value.current,
            limit: pageOptions.value.pageSize,
            ...props.pageOption,
            ...params,
          };
          state.loading = true;
          const data = await props?.loadData?.(queryParams).finally(() => (state.loading = false));
          data?.pagination &&
            Object.assign(pageOptions.value, {
              current: ~~data?.pagination.page,
              pageSize: ~~data?.pagination.size,
              total: ~~data?.pagination.total,
            });
          state.tableData = data?.list;
        }

        // const end = Math.max(pageSize, current * pageSize)
        // .slice(end - pageSize, end) // 这里0，10是条数

        // 是否开启了合计行
        // if (props.showSummary) {
        //   const { pageSize, current } = pageOptions.value;
        //   const end = Math.max(pageSize, current * pageSize);

        //   const data = Object.is(props.dataSource, undefined)
        //     ? state.tableData
        //     : state.tableData.slice(end - pageSize, end);
        // }
        // 是否可以拖拽行
        // props.dragRowEnable && (state.customRow = useDragRow<any>(state.tableData)!)
      };

      reloadTableData();

      // 操作事件
      const actionEvent = async (record, func, actionType = '') => {
        try {
          // 将reloadTableData放入宏任务中,等待当前微任务拿到结果进行判断操作，再请求表格数据
          await func({ record, props }, () => setTimeout(reloadTableData));
          // 如果为删除操作,并且删除成功，当前的表格数据条数小于2条,则当前页数减一,即请求前一页
          if (actionType == 'del' && state.tableData.length < 2) {
            pageOptions.value.current = Math.max(1, pageOptions.value.current - 1);
          }
        } catch (error) {
          console.log(error);
        }
      };

      /**
       * @description 分页改变
       */
      const paginationChange: (...args: any[]) => any = (
        pagination,
        filters,
        sorter,
        { currentDataSource },
      ) => {
        const { field, order } = sorter;

        pageOptions.value = {
          ...pageOptions.value,
          ...pagination,
        };
        reloadTableData({
          pageSize: pagination.pageSize,
          pageNumber: pagination.current,
          ...props.pageOption,
          ...filters,
          field,
          order,
        });
        emit('change', pagination, filters, sorter, { currentDataSource });
      };

      // dataIndex 可以为 a.b.c
      // const getDataIndexVal = (dataIndex, record) => dataIndex.split('.').reduce((pre, curr) => pre[curr], record)

      const buttonProps = {
        size: 'small',
      };

      // 获取表格列key
      const getColumnKey = (column: TableColumn) => {
        return column.key || column.dataIndex;
      };

      return {
        ...toRefs(state),
        tableRef,
        pageOptions,
        buttonProps,
        defaultSlots,
        isFunction,
        actionEvent,
        reloadTableData,
        paginationChange,
        getColumnKey,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.ant-table .ant-table-title) {
    display: flex;

    .ant-btn {
      margin-right: 10px;
    }
  }

  .actions > * {
    margin-right: 10px;
  }
</style>
