import * as Atlas from "./global"
export * from "./global"

declare global {
    interface Window {
        Atlas: typeof Atlas;
    }
}

window.Atlas = Atlas;
