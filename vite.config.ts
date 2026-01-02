import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acesso externo
    port: 5173, // sua porta de desenvolvimento
    strictPort: true,
    // Permite acesso apenas do host ngrok especificado
    allowedHosts: ['c3e643bf5bf7.ngrok-free.app'],
  },
});
