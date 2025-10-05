import { Vector2, Vector2Like } from "three";

export interface GridLike {
    gridSize: Vector2Like;
    offset: Vector2Like;
}

export class Grid implements GridLike {
    gridSize: Vector2;
    offset: Vector2;

    constructor(grid: GridLike);
    constructor(gridSize?: Vector2Like, offset?: Vector2Like);
    constructor(gridOrGridSize: GridLike | Vector2Like = { x: 1, y: 1 }, offset: Vector2Like = { x: 2, y: 2 }) {
        let gridSize: Vector2Like;
        if ((gridOrGridSize as GridLike).gridSize) {
            gridOrGridSize = gridOrGridSize as GridLike;
            offset = gridOrGridSize.offset;
            gridSize = gridOrGridSize.gridSize;
        } else {
            gridSize = gridOrGridSize as Vector2Like;
        }

        this.gridSize = new Vector2(gridSize.x, gridSize.y);
        this.offset = new Vector2(offset.x, offset.y);

        this.gridSize = this.gridSize.max({ x: 1, y: 1 });
    }

    getCellX(posX: number) {
        return Math.floor((posX - this.offset.x) / this.gridSize.x);
    }

    getCellY(posY: number) {
        return Math.floor((posY - this.offset.y) / this.gridSize.y);
    }

    getCell(pos: Vector2Like) {
        return new Vector2(this.getCellX(pos.x), this.getCellY(pos.y));
    }

    getLocalX(posX: number) {
        return Math.floor((posX - this.offset.x) % this.gridSize.x);
    }

    getLocalY(posY: number) {
        return Math.floor((posY - this.offset.y) % this.gridSize.y);
    }

    getLocal(pos: Vector2Like) {
        return new Vector2(this.getLocalX(pos.x), this.getLocalY(pos.y));
    }

    getCellMinX(cellX: number, targetGrid?: Grid) {
        const minX = cellX * this.gridSize.x + this.offset.x;
        return targetGrid ? targetGrid.getCellX(minX) : minX;
    }

    getCellMinY(cellY: number, targetGrid?: Grid) {
        const minY = cellY * this.gridSize.y + this.offset.y;
        return targetGrid ? targetGrid.getCellY(minY) : minY;
    }

    getCellMin(cell: Vector2Like, targetGrid?: Grid) {
        return new Vector2(this.getCellMinX(cell.x, targetGrid), this.getCellMinY(cell.y, targetGrid));
    }

    getCellMaxX(cellX: number, targetGrid?: Grid) {
        const maxX = (cellX + 1) * this.gridSize.x + this.offset.x - 1;
        return targetGrid ? targetGrid.getCellX(maxX) : maxX;
    }

    getCellMaxY(cellY: number, targetGrid?: Grid) {
        const maxY = (cellY + 1) * this.gridSize.y + this.offset.y - 1;
        return targetGrid ? targetGrid.getCellY(maxY) : maxY;
    }

    getCellMax(cell: Vector2Like, targetGrid?: Grid) {
        return new Vector2(this.getCellMaxX(cell.x, targetGrid), this.getCellMaxY(cell.y, targetGrid));
    }

    forEachIntersecting(cell: Vector2Like, targetGrid: Grid = new Grid(), action: (x: number, y: number) => any) {
        const min = this.getCellMin(cell, targetGrid);
        const max = this.getCellMax(cell, targetGrid);
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                action(x, y);
            }
        }
    }

    getIntersecting(cell: Vector2Like, targetGrid: Grid = new Grid()) {
        const min = this.getCellMin(cell, targetGrid);
        const max = this.getCellMax(cell, targetGrid);

        if (min.equals(max)) return [min];

        const intersects: Vector2[] = [];
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                intersects.push(new Vector2(x, y));
            }
        }

        return intersects;
    }

    multiply(other: GridLike) {
        return new Grid(this.gridSize.multiply(other.gridSize), this.offset.multiply(other.gridSize).add(other.offset));
    }

    divide(other: GridLike) {
        return new Grid(this.gridSize.divide(other.gridSize), this.offset.sub(other.offset).divide(other.gridSize));
    }
}
