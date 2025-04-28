import { defineConfig } from "vite";
import { resolve } from 'path'

export default defineConfig({
    build: {
        target: "esnext",
        rollupOptions: {
            external: /\.skel$/,
        },
    },
    server: {
        port: 3000,
        host: true,
    },
    preview: {
        host: true,
        port: 8080,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './src/assets'),
            '@scenes': resolve(__dirname, './src/scenes'),
            '@ui': resolve(__dirname, './src/ui'),
        },
    },
});