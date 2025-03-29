import { createApp } from "vue";
import App from "./components/App.vue";
import "./style.scss";

(async () => {
    await loadAddon("bluemap");
    createApp(App).mount('#app');
})();

async function loadAddon(id: string) {
    await import( /* @vite-ignore */ `../addons/${id}.js` )
}
