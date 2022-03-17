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

import { CookieCategoryType } from 'engine/categories';
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
