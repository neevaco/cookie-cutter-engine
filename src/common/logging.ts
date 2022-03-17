export function getLogger(): Promise<{ logCounter(message: any): void }> {
    return Promise.resolve({
        logCounter(message: any) {
            // eslint-disable-next-line no-console
            console.log(message);
        },
    });
}
