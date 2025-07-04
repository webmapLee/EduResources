declare module 'vite-plugin-imagemin' {
  import { Plugin } from 'vite'
  interface PNGQuantOption {
    quality?: [number, number]
    speed?: number
  }
  interface MozJpegOption {
    quality?: number
  }
  interface ViteImageminOptions {
    mozjpeg?: MozJpegOption
    pngquant?: PNGQuantOption
    [key: string]: any
  }
  function viteImagemin(options?: ViteImageminOptions): Plugin
  export default viteImagemin
}