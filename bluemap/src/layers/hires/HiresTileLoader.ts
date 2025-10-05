import { RequestTileLoader } from "@bluemap/atlas-lib";
import { RequestQueue } from "@bluemap/atlas-lib";
import { PRBMParser } from "@bluemap/atlas-lib";
import { pathFromCoords } from "../../util.ts";

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