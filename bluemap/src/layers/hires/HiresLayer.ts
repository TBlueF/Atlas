import { Layer, LayerSettings, Stage } from "atlas"
import { createHiresMaterials, HiresMaterialSettings } from "./HiresMaterial.ts"

export class HiresLayer extends Layer {

    settings: HiresLayerSettings

    constructor(stage: Stage, settings: Partial<HiresLayerSettings>) {
        super(stage, settings);
        this.settings = {
            type: "bluemap:hires",
            tilesPath: "./maps/overworld/tiles/0/",
            texturePath: "./maps/overworld/textures.json",
            ...settings
        };
    }

    async initialize(): Promise<void> {
        console.log("initializing hires...")
        const materialSettings: Partial<HiresMaterialSettings>[] = []//await new JsonLoader().loadAsync(this.settings.texturePath);
        const hiresMaterials = createHiresMaterials(materialSettings);
    }

    update(deltaTime: number): void {
        console.log("updating hires...")
    }

    render(deltaTime: number): void {
        console.log("rendering hires...")
    }

}

export interface HiresLayerSettings extends LayerSettings {
    tilesPath: string;
    texturePath: string;
}
