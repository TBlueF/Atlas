import { Grid, GridLike } from "../../util/Grid"
import { TileLoader } from "./TileLoader"
import { Tile } from "./Tile"

export class TileManager {

    readonly tileGrid: Grid
    readonly tileLoader: TileLoader
    private readonly tiles: Map<string, Tile> = new Map()

    constructor(tileGrid: GridLike, tileLoader: TileLoader) {
        this.tileGrid = new Grid(tileGrid)
        this.tileLoader = tileLoader
    }

    loadTile(x: number, z: number) {
        let pos = this.encodePosition(x, z)
        if (this.tiles.has(pos)) return

        let tile = this.tileLoader.load(x, z)
        this.tiles.set(pos, tile)

        tile.onLoad = () => {

        }

        tile.onUnload = () => {
            this.tiles.delete(pos)
        }
    }

    loadAroundPos(x: number, z: number, distance: number, unloadOther = true) {
        let min = this.tileGrid.getCell({ x: x - distance, y: z - distance})
        let max = this.tileGrid.getCell({ x: x + distance, y: z + distance})

        // unload outside
        if (unloadOther)
            this.unloadTileIf((x, z) => x < min.x || x > max.x || z < min.y || z > max.y)

        // load inside
        for (let tileX = min.x; tileX < max.x; tileX++) {
            for (let tileZ = min.y; tileZ < max.y; tileZ++) {
                this.loadTile(tileX, tileZ)
            }
        }
    }

    unloadTile(x: number, z: number) {
        let pos = this.encodePosition(x, z)
        this.tiles.get(pos)?.unload()
    }

    unloadTileIf(predicate: (x: number, z: number) => boolean) {
        this.tiles.forEach(tile => {
            if (predicate(tile.x, tile.z)) {
                tile.unload()
            }
        });
    }

    unloadAll() {
        this.tiles.forEach(tile => tile.unload())
        this.tiles.clear()
    }

    private encodePosition(x: number, z: number) {
        return x + "," + z
    }

}