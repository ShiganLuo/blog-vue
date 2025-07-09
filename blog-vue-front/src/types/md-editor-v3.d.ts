// 很多包没有提供ts类型申明文件，需要申明模块类型，避免警告
declare module 'md-editor-v3' {
  import { DefineComponent } from 'vue'
  export const MdEditor: DefineComponent<any>
  export const MdPreview: DefineComponent<any>
  export const MdCatalog: DefineComponent<any>
}
