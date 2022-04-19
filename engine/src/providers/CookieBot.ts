// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const CookieConsent: {
    submitCustomConsent(
        preferences: boolean,
        statistics: boolean,
        marketing: boolean
    ): void;
    hide(): void;
};

declare global {
    export interface Window {
        CookieConsent?: typeof CookieConsent;
    }
}

import { CookieCategoryType } from '../categories';
import { IProvider } from '../providers';

const consentChoices = {
    preferences: false,
    statistics: false,
    marketing: false,
};

export const CookieBot: IProvider = {
    name: 'CookieBot',
    isInUse: () => !!window.CookieConsent?.submitCustomConsent,
    acceptAll: () => CookieConsent.submitCustomConsent(true, true, true),
    rejectAll: () => CookieConsent.submitCustomConsent(false, false, false),
    getCategories: () => [
        {
            type: CookieCategoryType.Preferences,
            platformIdentifier: 'preferences',
        },
        {
            type: CookieCategoryType.Analytics,
            platformIdentifier: 'statistics',
        },
        { type: CookieCategoryType.Marketing, platformIdentifier: 'marketing' },
    ],
    setCategoryConsent(category, consent) {
        consentChoices[
            category.platformIdentifier as keyof typeof consentChoices
        ] = consent;
    },
    flush() {
        CookieConsent.submitCustomConsent(
            consentChoices.preferences,
            consentChoices.statistics,
            consentChoices.marketing
        );
        CookieConsent.hide();
    },
};
