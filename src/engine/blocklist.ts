export async function isFlaggedSite(): Promise<boolean> {
    // don't flag sites when testing. Makes debugging much more difficult.
    return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export async function flagSite(_hostname: string): Promise<void> {}
