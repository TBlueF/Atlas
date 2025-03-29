import type { Scene } from "../Scene.ts";

export class Layer {

    settings: LayerSettings;
    scene: Scene;

    constructor(scene: Scene, settings: Partial<LayerSettings>) {
        this.settings = {
            type: "layer",
            ...settings
        };
        this.scene = scene;
    }

    async initialize(): Promise<void> {
    }

    update(deltaTime: number): void {
    }

    render(deltaTime: number): void {
    }

}

export interface LayerSettings {
    type: string
}