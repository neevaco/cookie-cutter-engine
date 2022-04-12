export interface IActivationStatus {
    provider?: string;
    activated: boolean;
}

export async function getActivationStatus(): Promise<IActivationStatus> {
    const tabId = await getCurrentTab();
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(
            tabId,
            { event: 'request_status' },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                resolve(response);
            }
        );
    });
}

function getCurrentTab(): Promise<number> {
    return new Promise((resolve, reject): void => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs: chrome.tabs.Tab[]): void => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(tabs[0].id);
                }
            }
        );
    });
}
