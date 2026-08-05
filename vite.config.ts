import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/DriveFleet.github.io/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
