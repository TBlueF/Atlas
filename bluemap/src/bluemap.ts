import { LAYER_TYPES } from "atlas"
import { HiresLayer } from "./layers/hires/HiresLayer"

LAYER_TYPES.set("bluemap:hires", HiresLayer)

console.log("BlueMap addon loaded.")
