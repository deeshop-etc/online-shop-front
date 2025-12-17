import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // เมื่อไหร่ก็ตามที่ Frontend ยิงไปที่ /slipok-proxy
      '/slipok-proxy': {
        target: 'https://api.slipok.com', // ให้ส่งต่อไปที่ SlipOK จริงๆ
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/slipok-proxy/, ''), // ลบคำนำหน้าออกก่อนส่ง
        secure: false,
      }
    }
  }
})