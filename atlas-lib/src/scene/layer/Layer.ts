import { Stage } from "../Stage"

export class Layer {

    settings: LayerSettings
    scene: Stage

    constructor(scene: Stage, settings: Partial<LayerSettings>) {
        this.settings = {
            type: "layer",
            ...settings
        };
        this.scene = scene
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
