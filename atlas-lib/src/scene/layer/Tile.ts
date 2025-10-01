export interface Tile {

    readonly x: number
    readonly z: number

    /**
     * calling this method unloads and disposes this tile
     */
    unload(): void

    /**
     * should be called once the tile is (fully) loaded
     */
    onLoad(): void

    /**
     * should be called once the tile is unloaded and disposed
     */
    onUnload(): void

}
