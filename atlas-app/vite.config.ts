import { defineConfig } from "vite"
import { DynamicPublicDirectory } from 'vite-multiple-assets'
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [
        vue(),
        DynamicPublicDirectory([
            "public/**",
            {
                input: "../bluemap/dist/bluemap.js*",
                output: "/addons"
            },
            /*{
                input: "../atlas-lib/dist/atlas.js*",
                output: "/assets"
            }*/
        ]),
    ],
    publicDir: false, // handled by vite-multiple-assets plugin
    base: "./",
    build: {
        sourcemap: true,
        rollupOptions: {
            external: ["atlas", "three"],
        }
    },
    server: {
        proxy: {
            "/settings.json": {
                //target: "http://localhost:8100",
                target: "https://bluecolored.de/bluemap",
                changeOrigin: true,
            },
            "/maps": {
                //target: "http://localhost:8100",
                target: "https://bluecolored.de/bluemap",
                changeOrigin: true,
            }
        }
    }
})
