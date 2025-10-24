import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:8084';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
