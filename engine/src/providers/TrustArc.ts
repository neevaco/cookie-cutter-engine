// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const truste: {
    eu: {
        bindMap: {
            params: {
                c: string;
            };
        };
        actmessage(message: {
            source: string;
            message: string;
            data: { value: string };
        }): void;
        ccpa?: {
            dropCcpaCookie(drop: boolean): void;
        };
        COOKIE_CATEGORY_NAME: 'optout_domains';
    };
    util: {
        callCMEndpoint(
            url: string,
            params: any,
            callback: (xhr: XMLHttpRequest) => unknown
        ): void;
        setStorage(
            key: string,
            value: string,
            useSessionStorage: boolean
        ): void;
    };
    bn: {
        isConsentTrack: boolean;
        show(el: HTMLElement): void;
        hide(el: HTMLElement): void;
    };
};

declare global {
    export interface Window {
        truste?: typeof truste;
    }
}

// implement provider
import { IProvider, matchStringType } from '../providers';

interface ITrustArcCategories {
    [cookieCategory: string]: {
        domains: {
            [website: string]: string;
        };
        value: string;
    };
}

function setCategories(categories: number[]): void {
    truste.eu.actmessage({
        source: 'preference_manager',
        message: 'submit_preferences',
        data: {
            value: categories.join(','),
        },
    });
    hideBanner();
}

function hideBanner(): void {
    truste.bn.isConsentTrack = false;
    const footerId = truste.eu.bindMap.params.c || 'teconsent';
    truste.bn.show(document.getElementById(footerId)!);
    truste.bn.hide(document.getElementById('truste-consent-track')!);
    //truste.eu.actmessage = null;
}

let categoriesEnabled: number[] = [];
export const TrustArc: IProvider = {
    name: 'TrustArc',
    isInUse: () => !!window.truste?.bn?.show,
    acceptAll: () => {
        categoriesEnabled = [0, 1, 2]; // todo!
        truste.eu.ccpa?.dropCcpaCookie(false);
    },
    rejectAll: () => {
        categoriesEnabled = [0];
    },
    getCategories: async () => {
        // since this is async, just hide the banner now.
        hideBanner();

        const response: XMLHttpRequest = await new Promise((resolve) =>
            truste.util.callCMEndpoint(
                '/defaultconsentmanager/getOptOutDomains?',
                null,
                resolve
            )
        );

        const rawData = response.responseText;
        const categories: ITrustArcCategories = JSON.parse(rawData);
        truste.util.setStorage(truste.eu.COOKIE_CATEGORY_NAME, rawData, false);

        return Object.keys(categories).map((name) => {
            return {
                platformIdentifier: categories[name].value,
                type: matchStringType(name),
            };
        });
    },
    setCategoryConsent(category, consent) {
        if (consent) {
            categoriesEnabled.push(category.platformIdentifier);
        }
    },
    flush() {
        if (categoriesEnabled.length > 0) {
            // only unique categories
            categoriesEnabled = categoriesEnabled.filter(
                (c, i, a) => a.indexOf(c) === i
            );
            setCategories(categoriesEnabled);
        }
    },
};
