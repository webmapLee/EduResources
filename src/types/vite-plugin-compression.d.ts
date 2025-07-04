declare module 'vite-plugin-compression' {
  import { Plugin } from 'vite'
  interface CompressionOptions {
    algorithm?: 'gzip' | 'brotliCompress' | string
    ext?: string
    [key: string]: any
  }
  function viteCompression(options?: CompressionOptions): Plugin
  export default viteCompression
}