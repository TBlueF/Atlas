import { defineConfig } from 'vite'
import { DynamicPublicDirectory } from 'vite-multiple-assets'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        DynamicPublicDirectory([
            "public/**",
            {
                input: "../bluemap/dist/**",
                output: "/addons"
            },
        ],{
            ignore: ["../**/*.ts"]
        }),
    ],
    publicDir: false, // handled by vite-multiple-assets plugin
    base: "./",
    build: {
        sourcemap: true,
    },
    server: {
        proxy: {
            '/settings.json': {
                //target: 'http://localhost:8100',
                target: 'https://bluecolored.de/bluemap',
                changeOrigin: true,
            },
            '/maps': {
                //target: 'http://localhost:8100',
                target: 'https://bluecolored.de/bluemap',
                changeOrigin: true,
            }
        }
    }
})
