import { FileLoader } from "three";

export function throwError(error: Error | string): never {
    throw error;
}
