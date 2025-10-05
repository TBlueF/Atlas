import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { DynamicPublicDirectory } from "vite-multiple-assets";

export default defineConfig({
    plugins: [
        vue(),
        DynamicPublicDirectory([
            "public/**",
            {
                input: "../bluemap/dist/bluemap.js*",
                output: "/addons",
            },
            {
                input: "../atlas-lib/dist/atlas.js*",
                output: "/assets",
            },
        ]),
    ],
    publicDir: false, // handled by vite-multiple-assets plugin
    base: "./",
    build: {
        sourcemap: true,
        rollupOptions: {
            external: ["@bluemap/atlas-lib", "three"],
        },
    },
    // For some reason this works in dev mode and also somehow doesn't break prod build
    resolve: {
        alias: {
            "@bluemap/atlas-lib": "http://localhost:5173/assets/atlas.js",
            three: "http://localhost:5173/assets/three.module.min.js",
        },
    },
    // Just disabled entirely to because of dynamic imports
    optimizeDeps: {
        entries: [],
    },
    server: {
        // Make sure the aliased modules are available at the correct address.
        port: 5173,
        strictPort: true,
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
            },
        },
    },
});
