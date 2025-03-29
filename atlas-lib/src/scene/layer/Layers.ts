import type { Scene } from "../Scene.ts";
import type { LayerSettings } from "./Layer.ts";
import { Layer } from "./Layer.ts";

type LayerConstructor = new (
    scene: Scene,
    settings: Partial<LayerSettings>
) => Layer;

export const LAYER_TYPES = new Map<string, LayerConstructor>([]);