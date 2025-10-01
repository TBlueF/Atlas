import { TileLoader } from "./TileLoader"
import { Tile } from "./Tile"
import { ARRAY_BUFFER, RequestQueue } from "../../util/RequestQueue"
import { Unloadable } from "../../util/Util"

export abstract class RequestTileLoader implements TileLoader {

    readonly requestQueue: RequestQueue

    constructor(requestQueue: RequestQueue) {
        this.requestQueue = requestQueue
    }

    load(x: number, z: number, priority?: () => number): Tile {
        let abortController = new AbortController()
        let tile = new RequestTile(x, z, abortController)
        let tileUrl = this.getTileUrl(x, z)

        this.requestQueue.fetch(tileUrl, ARRAY_BUFFER, { signal: abortController.signal }, priority)
            .then(data => {
                tile.tileData = this.finalizeTile(x, z, data)
                tile.onLoad()
            })
            .catch(error => {
                console.log(`Failed to load tile from '${tileUrl}'`, error)
                tile.unload()
            })

        return tile;
    }

    abstract getTileUrl(x: number, z: number): RequestInfo | URL

    abstract finalizeTile(x: number, z: number, data: ArrayBuffer): Unloadable | null | undefined

}

class RequestTile implements Tile {

    readonly x: number
    readonly z: number
    readonly abortController: AbortController
    tileData: Unloadable | null | undefined
    onLoad = () => {}
    onUnload = () => {}

    private unloaded: boolean = false

    constructor(x: number, z: number, abortController: AbortController) {
        this.x = x
        this.z = z
        this.abortController = abortController
    }

    unload() {
        if (this.unloaded) return;
        this.unloaded = true;

        this.onUnload()
        this.abortController.abort()
        this.tileData?.unload()
    }

}
