export type ResponseHandler<T> = (response: Response) => Promise<T>;

export const ARRAY_BUFFER: ResponseHandler<ArrayBuffer> = response => response.arrayBuffer();
export const JSON: ResponseHandler<any> = response => response.json();
export const TEXT: ResponseHandler<string> = response => response.text();
export const BLOB: ResponseHandler<Blob> = response => response.blob();
export const BYTES: ResponseHandler<Uint8Array<any>> = response => response.bytes();
export const FORM_DATA: ResponseHandler<FormData> = response => response.formData();

export class RequestQueue {
    concurrency: number = 1;
    awaiting: number = 0;
    queue: QueuedRequest<any>[] = [];

    fetch<T>(
        input: RequestInfo | URL,
        responseHandler: ResponseHandler<T>,
        init?: RequestInit,
        priority?: () => number
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push(new QueuedRequest(input, responseHandler, resolve, reject, init, priority));
            this.update();
        });
    }

    update() {
        this.queue.sort((a, b) => b.priority() - a.priority());
        while (this.concurrency > this.awaiting && this.queue.length > 0) {
            let request = this.queue.shift();
            if (!request) continue;

            if (request.init?.signal?.aborted) continue;

            this.awaiting++;
            try {
                fetch(request.input, request.init)
                    .then(request.responseHandler)
                    .finally(() => {
                        this.awaiting--;
                        this.update();
                    })
                    .then(request.resolve, request.reject);
            } catch (e) {
                this.awaiting--;
                console.error(e);
                this.update();
            }
        }
    }
}

class QueuedRequest<T> {
    input: RequestInfo | URL;
    init?: RequestInit;
    responseHandler: ResponseHandler<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    priority: () => number;

    constructor(
        input: RequestInfo | URL,
        responseHandler: ResponseHandler<T>,
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void,
        init?: RequestInit,
        priority = () => 0
    ) {
        this.input = input;
        this.responseHandler = responseHandler;
        this.resolve = resolve;
        this.reject = reject;
        this.init = init;
        this.priority = priority;
    }
}
