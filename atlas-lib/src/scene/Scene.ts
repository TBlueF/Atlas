import { Layer, type LayerSettings } from "./layer/Layer.ts";
import { throwError } from "../util/Util.ts";
import { LAYER_TYPES } from "./layer/Layers.ts";
import { WebGLRenderer } from "three";

export class Scene {

    readonly glRenderer: WebGLRenderer;
    readonly layers: Layer[];

    constructor(settings: Partial<SceneSettings>) {

        this.glRenderer = new WebGLRenderer({
            antialias: true,
            precision: "highp",
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
        });
        this.glRenderer.autoClear = false;

        this.layers = [];
        for (const layerSettings of settings.layers ?? []) {
            const LayerType = LAYER_TYPES.get(layerSettings.type ??
                throwError("Unable to load layer without a defined 'type'"));
            if (!LayerType) throw new Error(`Unable to load layer with type ${layerSettings.type}`);
            this.layers.push(new LayerType(this, layerSettings));
        }
    }

    async initialize(): Promise<void> {
        await Promise.all(this.layers.map(layer => {
            layer.initialize();
        }));
    }

    update(deltaTime: number): void {
        for (const layer of this.layers) {
            layer.update(deltaTime);
        }
    }

    render(deltaTime: number): void {
        this.glRenderer.clear()
        for (const layer of this.layers) {
            layer.render(deltaTime);
        }
    }

}

export interface SceneSettings {
    layers: Partial<LayerSettings>[]
}