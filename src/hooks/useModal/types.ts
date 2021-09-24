import type { VNodeTypes } from 'vue'
import type { ModalFuncProps } from 'ant-design-vue/lib/modal'

// 普通模态框
export interface HookModalProps extends ModalFuncProps {
  content?: string | JSX.Element | (() => JSX.Element)
  _closeModal?: () => void
}

// 表单模态框
export interface FormModalProps<T = Recordable> extends HookModalProps {
  /**
   * 接受返回一个boolean，返回 true 会关掉这个弹窗
   *
   * @name 表单结束后调用
   */
  onFinish?: (formData: T) => Promise<boolean | void>
}
