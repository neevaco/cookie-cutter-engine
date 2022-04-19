// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const OneTrust: {
    AllowAll(): void;
    RejectAll(): void;
    getDataSubjectId(): string;
    setConsentProfile(profile: any): void;
    GetDomainData(): {
        Groups: { PurposeId: string; GroupName: string }[];
    };
};

declare global {
    export interface Window {
        OneTrust?: typeof OneTrust;
    }
}

import { IProvider, matchStringType } from '../providers';

export const OneTrustProvider: IProvider = {
    name: 'OneTrust',
    isInUse: () => !!window.OneTrust?.AllowAll,
    acceptAll: () => OneTrust.AllowAll(),
    rejectAll: () => OneTrust.RejectAll(),
    getCategories: () =>
        OneTrust.GetDomainData().Groups.map((g) => {
            return {
                platformIdentifier: g.PurposeId,
                type: matchStringType(g.GroupName),
            };
        }),
    setCategoryConsent(category, consent) {
        // build a consent profile. it doesn't overwrite, so we don't have to include all categories' values
        const consentProfile = {
            identifier: OneTrust.getDataSubjectId?.apply(this) ?? '',
            isAnonymous: false,
            purposes: [
                {
                    Id: category.platformIdentifier,
                    TransactionType: consent ? 'CONFIRMED' : 'OPT_OUT',
                },
            ],
        };
        OneTrust.setConsentProfile(consentProfile);
    },
    flush() {
        // on some sites the popup still appears after being dismissed
        // outdated sites also don't close the popup automatically
        // unfortunate but luckily this brilliant solution fixes the problem
        const style = `#onetrust-consent-sdk, .optanon-alert-box-wrapper { display: none !important; }`;
        const el = document.createElement('style');
        el.innerHTML = style;
        document.head.appendChild(el);
    },
};
