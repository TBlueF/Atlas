import { Layer, LayerSettings, Scene } from "atlas";

export class HiresLayer extends Layer {

    settings: HiresLayerSettings;

    constructor(scene: Scene, settings: Partial<HiresLayerSettings>) {
        super(scene, settings);
        this.settings = {
            type: "bluemap:hires",
            tilesPath: "./maps/overworld/tiles/0/",
            texturePath: "./maps/overworld/textures.json",
            ...settings
        };
    }

    async initialize(): Promise<void> {

    }

    update(deltaTime: number): void {

    }

    render(deltaTime: number): void {

    }

}

export interface HiresLayerSettings extends LayerSettings {
    tilesPath: string;
    texturePath: string;
}
