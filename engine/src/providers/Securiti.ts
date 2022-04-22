// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const TCFUtils: {
    updateConsentFromBanner(consent: 'allow' | 'deny' | 'dismiss'): void;
};

declare const bannerConfigUtils: {
    getLanguageConfigMap(): {
        [lang: string]: {
            categories: [
                {
                    name: string;
                }
            ];
        };
    };
};

declare const bannerGenerator: {
    dropPrivaciCookies(consents: {
        [category: string]: boolean;
    }): Promise<void>;
};

declare global {
    export interface Window {
        TCFUtils?: typeof TCFUtils;
    }
}

import { delay } from '../util';
// implement provider
import { IProvider, matchStringType } from '../providers';

const preferences: { [category: string]: boolean } = {};
const delayTimeMs = 500;
async function getSecuritiCategories(): Promise<{ name: string }[]> {
    let config = null;

    // these are loaded over the network, so we have to wait sometimes
    // todo: really wait indefinitely?
    while (!(config = bannerConfigUtils.getLanguageConfigMap().en)) {
        await delay(delayTimeMs);
    }
    return config.categories;
}

export const Securiti: IProvider = {
    name: 'Securiti',
    isInUse: () => !!window.TCFUtils?.updateConsentFromBanner,
    acceptAll: async () =>
        (await getSecuritiCategories()).forEach(
            (cat) => (preferences[cat.name] = true)
        ),
    rejectAll: async () =>
        (await getSecuritiCategories()).forEach(
            (cat) => (preferences[cat.name] = false)
        ),
    getCategories: async () =>
        (await getSecuritiCategories()).map((c) => {
            return {
                type: matchStringType(c.name),
                platformIdentifier: c.name,
            };
        }),
    setCategoryConsent(category, consent) {
        preferences[category.platformIdentifier] = consent;
    },
    flush: async () => {
        await bannerGenerator.dropPrivaciCookies(preferences);

        // sometimes we'll get here before the banner is shown, so let's make sure it actually goes away
        await delay(delayTimeMs);
        await bannerGenerator.dropPrivaciCookies(preferences);
    },
};
