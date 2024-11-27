import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src directory
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5001', // Backend server URL
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
