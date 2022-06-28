// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { CivicCookieControl } from './providers/CivicCookieControl';
import { ConsentManager } from './providers/ConsentManager';
import { CookieBot } from './providers/CookieBot';
import { CookieCategoryType } from './categories';
import { DidomiProvider } from './providers/Didomi';
import { Evidon } from './providers/Evidon';
import { HubSpot } from './providers/HubSpot';
import { MaybePromise, createLogger } from './util';
import { OneTrustProvider } from './providers/OneTrust';
import { OsanoProvider } from './providers/Osano';
import { SecurePrivacy } from './providers/SecurePrivacy';
import { Securiti } from './providers/Securiti';
import { StackExchangeProvider } from './providers/StackExchange';
import { TrustArc } from './providers/TrustArc';
import { Usercentrics } from './providers/Usercentrics';

export interface IProvider {
    name: string;
    isInUse(): boolean;
    init?(): MaybePromise<void>;
    acceptAll(): MaybePromise<void>;
    rejectAll(): MaybePromise<void>;
    getCategories(): MaybePromise<ICookieCategory[]>;
    setCategoryConsent(
        category: ICookieCategory,
        consentGiven: boolean
    ): MaybePromise<void>;
    flush?(): MaybePromise<void>;
}

export interface ICookieCategory {
    type: CookieCategoryType;

    /**
     * A consent platform specific identifier for the category
     */
    platformIdentifier: any;
}

const logger = createLogger('providers.ts');

const cookieNames = {
    [CookieCategoryType.Essential]: ['essential', 'necessary'],
    [CookieCategoryType.Marketing]: [
        'marketing',
        'targeting',
        'function',
        'advertising',
        'personalization',
        'personalize',
        'ads',
        'geolocation',
    ],
    [CookieCategoryType.Analytics]: [
        'analytic',
        'measurement',
        'statistics',
        'research',
    ],
    [CookieCategoryType.Preferences]: ['preference', 'personalization'],
    [CookieCategoryType.Social]: ['social'],
    [CookieCategoryType.DoNotSell]: ['do not sell'],
    [CookieCategoryType.Unknown]: ['other'],
};

export function matchStringType(name?: string | null): CookieCategoryType {
    if (!name) {
        logger.log('Returning unknown category. Category name was undefined');
        return CookieCategoryType.Unknown;
    }

    const numCategories = Object.keys(cookieNames).length;
    const lowerName = name.toLowerCase();
    for (let i = 0; i < numCategories; i++) {
        const typeNames = cookieNames[i as CookieCategoryType];
        if (typeNames.some((type) => lowerName.includes(type))) {
            logger.log(
                `Matched given string category '${name}' with CookieCategoryType.${CookieCategoryType[i]}`
            );

            return i;
        }
    }

    logger.log(
        `Failed to match string category '${name}' to a CookieCategoryType`
    );
    return CookieCategoryType.Unknown;
}

export default [
    OneTrustProvider,
    CivicCookieControl,
    OsanoProvider,
    SecurePrivacy,
    Securiti,
    TrustArc,
    Evidon,
    CookieBot,
    ConsentManager,
    StackExchangeProvider,
    DidomiProvider,
    Usercentrics,
    HubSpot, // this is by far the broadest provider. Keep it for last
];
