import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import path from 'path'

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Base path for GitHub Pages - only apply in production
  base: isProduction ? '/KhamielResume/' : '/',
  root: '.',
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg)$/i
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg)$/i
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  },
  server: {
    port: 3000,
    open: true
  }
})
