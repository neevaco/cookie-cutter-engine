import { CivicCookieControl } from './providers/CivicCookieControl';
import { CookieCategoryType } from 'engine/categories';
import { Evidon } from './providers/Evidon';
import { HubSpot } from './providers/HubSpot';
import { MaybePromise } from './util';
import { OneTrustProvider } from './providers/OneTrust';
import { OsanoProvider } from './providers/Osano';
import { SecurePrivacy } from './providers/SecurePrivacy';
import { Securiti } from './providers/Securiti';
import { StackExchangeProvider } from './providers/StackExchange';
import { TrustArc } from './providers/TrustArc';

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

const cookieNames = {
    [CookieCategoryType.Essential]: ['essential', 'necessary'],
    [CookieCategoryType.Marketing]: [
        'marketing',
        'targeting',
        'functional',
        'advertising',
    ],
    [CookieCategoryType.Preferences]: ['preference', 'personalization'],
    [CookieCategoryType.Analytics]: ['analytic'],
    [CookieCategoryType.Social]: ['social'],
    [CookieCategoryType.DoNotSell]: ['do not sell'],
    [CookieCategoryType.Unknown]: ['other'],
};

export function matchStringType(name?: string | null): CookieCategoryType {
    if (!name) {
        return CookieCategoryType.Unknown;
    }

    const numCategories = Object.keys(cookieNames).length;
    const lowerName = name.toLowerCase();
    for (let i = 0; i < numCategories; i++) {
        const typeNames = cookieNames[i as CookieCategoryType];
        if (typeNames.some((type) => lowerName.includes(type))) {
            return i;
        }
    }
    return CookieCategoryType.Unknown;
}

export default [
    OneTrustProvider,
    CivicCookieControl,
    OsanoProvider,
    SecurePrivacy,
    HubSpot,
    Securiti,
    TrustArc,
    Evidon,
    StackExchangeProvider,
];
