import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load env variables
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configure server options
  server: {
    // Allow Clacky environment host requests
    allowedHosts: ['.clackypaas.com'],
    port: 5173,
    strictPort: true,
    // Configure CORS for development
    cors: true,
    // Configure proxy if needed
    proxy: {
      // Example proxy configuration - can be updated as needed
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  },
  // Define environment variables to be exposed to client
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.DEEPSEEK_API_URL': JSON.stringify(process.env.DEEPSEEK_API_URL),
    'process.env.WECHAT_API_URL': JSON.stringify(process.env.WECHAT_API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL)
  },
  // Build configuration
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Output directory
    outDir: 'dist',
  },
})