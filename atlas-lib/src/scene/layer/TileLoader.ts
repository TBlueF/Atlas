import { Tile } from "./Tile"

export interface TileLoader {

    load(x: number, z: number, priority?: () => number): Tile

}
