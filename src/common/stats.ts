export type DomainMap = { [domain: string]: number };
export interface DayData {
    trackers: DomainMap;
    cookieNotices: number;
}

export async function incrementCookieStats(): Promise<void> {
    // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export function notifyNoticeHandledOnPage(_dismissed: boolean): void {
    // no-op
}
