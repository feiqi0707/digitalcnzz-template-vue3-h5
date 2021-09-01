declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'idcard'
declare module 'uuid'
declare module '@digitalcnzz/jssdk'
