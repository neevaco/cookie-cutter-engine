// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
type CivicConfig = { optionalCookies: { name: string }[] };
declare const CookieControl: {
    acceptAll(): void;
    rejectAll(): void;
    changeCategory(index: number, consentGiven: boolean): void;
    getCategoryConsent(index: number): boolean | null;
    config: CivicConfig | (() => CivicConfig);
};

declare global {
    export interface Window {
        CookieControl?: typeof CookieControl;
    }
}

import { IProvider, matchStringType } from '../providers';
import { delay } from '../util';

// the amount of time in ms to wait between each check for whether a category is set
// used to ensure the provider has completed loading
const waitForCategorySetDelay = 1000;
async function untilCookiesSet(
    action: () => unknown,
    expectedValue?: boolean,
    index: number = 0
): Promise<void> {
    while (
        expectedValue !== undefined
            ? CookieControl.getCategoryConsent(index) !== expectedValue
            : CookieControl.getCategoryConsent(index) === null
    ) {
        action();
        await delay(waitForCategorySetDelay);
    }
}

function getConfig(): CivicConfig {
    if (typeof CookieControl.config === 'function') {
        return CookieControl.config();
    }
    return CookieControl.config;
}

// todo: delay required?
export const CivicCookieControl: IProvider = {
    name: 'CivicUK',
    isInUse: () => !!window.CookieControl?.acceptAll,
    acceptAll: () => untilCookiesSet(CookieControl.acceptAll, true),
    rejectAll: () => untilCookiesSet(CookieControl.rejectAll, false),
    getCategories: () =>
        getConfig().optionalCookies.map((c, i) => {
            return { type: matchStringType(c.name), platformIdentifier: i };
        }),
    setCategoryConsent: (category, consent) =>
        untilCookiesSet(
            () =>
                CookieControl.changeCategory(
                    category.platformIdentifier,
                    consent
                ),
            consent,
            category.platformIdentifier
        ),
};
