import { RequestTileLoader } from "atlas"
import { RequestQueue } from "atlas"
import { PRBMParser } from "atlas"
import { pathFromCoords } from "../../util.ts"

export class HiresTileLoader extends RequestTileLoader {

    readonly baseUrl: string

    constructor(baseUrl: string, requestQueue: RequestQueue) {
        super(requestQueue)
        this.baseUrl = baseUrl
    }

    getTileUrl(x: number, z: number) {
        return this.baseUrl + pathFromCoords(x, z)
    }

    finalizeTile(x: number, z: number, data: ArrayBuffer) {
        PRBMParser.parse(data)
        return null;
    }

}