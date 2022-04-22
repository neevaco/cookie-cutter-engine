// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

declare global {
    export interface Window {
        Osano: {
            cm: {
                userData: string;
                hideDialog(): void;
                showDrawer(): void;
                hideDrawer(): void;
                getConsent(): IConsentObject;
                addEventListener<T = never>(
                    event: string,
                    callback: (data: T) => unknown
                ): void;
                removeEventListener<T = never>(
                    event: string,
                    callback: (data: T) => unknown
                ): void;
            };
        };
    }
}

import { CookieCategoryType } from '../categories';
import { ICookieCategory, IProvider } from '../providers';

// https://docs.osano.com/developer-documentation-consent-javascript-api#TheConsentObject
interface IConsentObject {
    ANALYTICS: 'ACCEPT' | 'DENY';
    MARKETING: 'ACCEPT' | 'DENY';
    PERSONALIZATION: 'ACCEPT' | 'DENY';
    ESSENTIAL: 'ACCEPT' | 'DENY';

    /*special IAB categories*/
    'OPT-OUT': 'ACCEPT' | 'DENY';

    // todo: figure out if/where this comes in to play
    STORAGE: 'ACCEPT' | 'DENY';
}

let hasInitialized = false;

function waitForInitialized(): Promise<void> {
    return new Promise((resolve) => {
        // called immediately if already initialized
        window.Osano.cm.addEventListener('osano-cm-initialized', () => {
            if (!hasInitialized) {
                hasInitialized = true;

                // the side drawer has to be loaded as well, luckily rendering appears to be blocking
                window.Osano.cm.showDrawer();
                window.Osano.cm.hideDrawer();
            }
            resolve();
        });
    });
}

async function setAll(consent: boolean): Promise<void> {
    await waitForInitialized();

    // find all of the consent checkboxes and check them (or not)
    const checkboxes = document.querySelectorAll(
        'input[data-category]'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((box) => {
        box.checked = consent;
        box.dispatchEvent(new Event('change'));
    });

    await saveCookies();
}

async function setSingleCategory(
    category: ICookieCategory,
    consent: boolean
): Promise<void> {
    await waitForInitialized();

    // set through DOM manipulation :(
    const checkbox = document.querySelector(
        `input[data-category=${category.platformIdentifier}]`
    ) as HTMLInputElement;

    // todo: probably temp?
    if (checkbox === null) {
        console.warn(
            'Unable to set consent for category',
            category,
            'Desired:',
            consent,
            'Actual: Element not found'
        );
    }

    checkbox.checked = consent;

    // let the handler know we've changed it
    checkbox.dispatchEvent(new Event('change'));

    // and save. the dialog doesn't need to be open for this, it's always there.
    await saveCookies();

    // the consent returned from saveCookies isn't always up to date, who knows why
    const savedConsent = window.Osano.cm.getConsent();

    // for now, let's just make sure we do it properly
    if (
        consent !==
        (savedConsent[
            category.platformIdentifier as keyof typeof savedConsent
        ] ===
            'ACCEPT')
    ) {
        console.warn(
            'Unable to set consent for category',
            category,
            'Desired:',
            consent,
            'Actual:',
            savedConsent[
                category.platformIdentifier as keyof typeof savedConsent
            ]
        );
    }
}

function saveCookies(): Promise<IConsentObject> {
    return new Promise((resolve) => {
        const listener = (consent: IConsentObject): void => {
            resolve(consent);
            window.Osano.cm.removeEventListener(
                'osano-cm-consent-saved',
                listener
            );
        };
        window.Osano.cm.addEventListener('osano-cm-consent-saved', listener);
        const saveButton = document.querySelector(
            '.osano-cm-save'
        ) as HTMLElement;
        saveButton.click();
    });
}

export const OsanoProvider: IProvider = {
    name: 'Osano',
    isInUse: () => !!window.Osano?.cm,
    acceptAll: () => setAll(true),
    rejectAll: () => setAll(false),
    getCategories: () => [
        { type: CookieCategoryType.Essential, platformIdentifier: 'ESSENTIAL' },
        { type: CookieCategoryType.Unknown, platformIdentifier: 'OPT_OUT' },
        { type: CookieCategoryType.Marketing, platformIdentifier: 'MARKETING' },
        {
            type: CookieCategoryType.Preferences,
            platformIdentifier: 'PERSONALIZATION',
        },
        { type: CookieCategoryType.Analytics, platformIdentifier: 'ANALYTICS' },
    ],
    setCategoryConsent: setSingleCategory,
};
