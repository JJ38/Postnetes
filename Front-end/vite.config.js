import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, '.');

export default defineConfig({
    base: './',
    build: {
      emptyOutDir: true,
      outDir: 'dist',
      assetsDir: 'assets',
    },
    plugins: [
      {
        name: 'reload',
        configureServer(server) {
          const {ws, watcher} = server;
          watcher.on('change', file => {
            if (file.endsWith('.html')) {
              ws.send({
                type: 'full-reload',
              });
            }
            if (file.endsWith('.js')) {
              ws.send({
                type: 'full-reload',
              });
            }
            if (file.endsWith('.css')) {
              ws.send({
                type: 'full-reload',
              });
            }
          });
        },
      },
    ],
    server: {
    
      watch: {
        usePolling: true,
      }
    },
  })