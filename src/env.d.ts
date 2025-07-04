/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Custom Vite env variables augmentation
interface ImportMetaEnv {
  /** Base public path when served in development or production. */
  readonly BASE_URL: string
  /** Example: API endpoint */
  readonly VITE_API_URL?: string
  // More env variables can be declared here...
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
