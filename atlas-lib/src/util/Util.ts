export type Unloadable = {
    unload: () => void;
}

export function throwError(error: Error | string): never {
    throw error instanceof Error ? error : new Error(error);
}
