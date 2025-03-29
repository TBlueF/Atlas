import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const root = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        emptyOutDir: false,
        lib: {
            entry: resolve(root, "src/main.ts"),
            name: "bluemap",
            formats: ['umd'],
            fileName: () => "bluemap.js"
        },
        rollupOptions: {
            external: ["atlas", "three"],
            output: {
                globals: {
                    "atlas": "Atlas"
                }
            }
        },
    },
})
