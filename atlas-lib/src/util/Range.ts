export class Range {

    min?: number;
    max?: number;

    contains(value: number): boolean {
        if (this.min === undefined || value < this.min) return false;
        return this.max !== undefined && value <= this.max;
    }

    factor(value: number): number {
        return this.contains(value) ? 1 : 0;
    }

}