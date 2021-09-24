import { Modal } from 'ant-design-vue'
import { defineComponent, reactive, watchEffect, watch, ref } from 'vue'
import type { HookModalProps } from './types'
import { isFunction } from '@/utils/is'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'

export const MyModal = defineComponent({
  setup(props: HookModalProps, { attrs }) {
    const confirmLoading = ref<boolean>(false)

    const state = reactive({
      visible: props.visible
    })

    watchEffect(() => {
      state.visible = props.visible
    })

    watch(
      () => state.visible,
      (val) => {
        Object.is(val, false) && props._closeModal?.()
      }
    )

    const handleConfirm = async () => {
      confirmLoading.value = true
      try {
        await props?.onOk?.()
        state.visible = false
      } catch (error) {
      } finally {
        confirmLoading.value = false
      }
    }
    const handleCancel = async () => {
      await props?.onCancel?.()
      state.visible = false
    }

    return () => {
      // 这里如果不把onOK排除掉，控制台会爆onOK是一个数组的警告
      const { onOk, onCancel, ...rest } = props

      return (
        <ConfigProvider locale={zhCN}>
          <Modal
            {...rest}
            v-model={[state.visible, 'visible']}
            confirmLoading={confirmLoading.value}
            onCancel={handleCancel}
            onOk={handleConfirm}
          >
            {isFunction(props.content) ? props.content() : props.content}
          </Modal>
        </ConfigProvider>
      )
    }
  }
})
