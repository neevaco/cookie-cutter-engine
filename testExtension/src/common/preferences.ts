// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { CookieCategoryType } from 'engine/categories';
import { EventType, listen, send } from './messaging';
import psl from 'psl';

// pretty much a dictionary from Cookie Category --> Consent Given
export type Preferences = { [category: number]: boolean };

const isPageContext = !chrome?.storage;
export function getAllPreferences(): Promise<Preferences> {
    if (isPageContext) {
        return new Promise((resolve) => {
            listen<Preferences>(EventType.OnPreferences, resolve);
            send(EventType.RequestPreferences);
        });
    }

    return getChromeStorage<Preferences>(
        'preferences',
        getDefaultPreferences()
    );
}

function getDefaultPreferences(): Preferences {
    const keys = Object.keys(CookieCategoryType).filter(
        (t) => !isNaN(parseInt(t))
    );
    const prefs: Preferences = {};
    keys.forEach((key) => (prefs[parseInt(key)] = false));
    return prefs;
}

export function getChromeStorage<T>(
    key: string,
    defaultValue: any = {}
): Promise<T> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (items) => {
            resolve((items ?? {})[key] ?? defaultValue);
        });
    });
}

export function setChromeStorage<T>(key: string, data: T): Promise<void> {
    return new Promise<void>((resolve) =>
        chrome.storage.local.set({ [key]: data }, resolve)
    );
}

/**
 * Gets the hostname of the active site.
 * @returns The current hostname from `window.location` or
 *          from `chrome.tabs` if not in a page context.
 */
export function getHostname(): Promise<string | null> {
    return Promise.resolve(psl.get(window.location.hostname));
}
