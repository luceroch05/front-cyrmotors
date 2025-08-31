import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7053', // tu backend
        changeOrigin: true,
        secure: false, // si tu backend usa HTTPS, cámbialo a true
       
      },
    },
  },
});