import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import dts from "unplugin-dts/vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [ dts({ bundleTypes: true, tsconfigPath: './tsconfig.lib.json' }) ],
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/atlas.js"),
            name: "Atlas",
            fileName: "atlas",
        },
        rollupOptions: {
            external: ["three"]
        },
    },
})