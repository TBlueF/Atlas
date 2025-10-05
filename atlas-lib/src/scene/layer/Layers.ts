import type { Stage } from "../Stage";
import type { LayerSettings } from "./Layer";
import { Layer } from "./Layer";

type LayerConstructor = new (scene: Stage, settings: Partial<LayerSettings>) => Layer;

export const LAYER_TYPES = new Map<string, LayerConstructor>([]);
