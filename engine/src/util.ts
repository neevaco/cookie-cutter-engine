export type MaybePromise<T> = Promise<T> | T;

export function delay(timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeMs));
}
