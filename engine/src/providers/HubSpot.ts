// declare types
declare const _hsq: {
    push(command: [string, ...any]): void;
};

declare global {
    export interface Window {
        _hsq?: typeof _hsq;
    }
}

import { CookieCategoryType } from '../categories';
import { IProvider } from '../providers';
import { delay } from '../util';

// one of our sadder implementations, but for now hubspot provides no
// way to control these programatically.
let preferences = {
    1: false,
    2: false,
    3: false,
};

const totalAttempts = 5;
const delayTimeMs = 500;
async function tryClick(id: string): Promise<void> {
    let element = null;
    let attempts = 0;
    while (
        !(element = document.getElementById(id)) &&
        attempts < totalAttempts
    ) {
        await delay(delayTimeMs);
        attempts++;
    }

    element?.click();
}

export const HubSpot: IProvider = {
    name: 'HubSpot',
    isInUse: () =>
        !!document.getElementById('hs-eu-cookie-confirmation') ||
        !!window._hsq?.push,
    acceptAll: async () => {
        await tryClick('hs-eu-confirmation-button');
        preferences = { 1: true, 2: true, 3: true };
    },
    rejectAll: async () => {
        await tryClick('hs-eu-decline-button');
        preferences = { 1: false, 2: false, 3: false };
    },
    getCategories: () => [
        { type: CookieCategoryType.Analytics, platformIdentifier: 1 }, // analytics
        { type: CookieCategoryType.Marketing, platformIdentifier: 2 }, // advertising
        { type: CookieCategoryType.Preferences, platformIdentifier: 3 }, // functionality
    ],
    setCategoryConsent(category, consent) {
        preferences[category.platformIdentifier as keyof typeof preferences] =
            consent;
    },
    flush() {
        // TODO!: this only affects preferences for the *next* pageload, not the current one

        // build the cookie string, looks like:
        // 1 + ":" + this.categories.analytics + "," + 2 + ":" + this.categories.advertisement + "," + 3 + ":" + this.categories.functionality
        const cookieValue = Object.keys(preferences)
            .map(
                (id) =>
                    `${id}:${
                        preferences[parseInt(id) as keyof typeof preferences]
                    }`
            )
            .join(',');

        document.cookie = `__hs_cookie_cat_pref=${cookieValue}`;
    },
};
