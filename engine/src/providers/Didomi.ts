// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

declare const Didomi: {
    getRequiredPurposes(): { id: string }[];
    setUserConsentStatusForAll(enabled: any[], disabled: any[]): void;
    setUserAgreeToAll(): void;
    setUserDisagreeToAll(): void;
};

declare global {
    export interface Window {
        Didomi?: typeof Didomi;
    }
}

import { IProvider, matchStringType } from '../providers';

const enabledPurposes: string[] = [];
const disabledPurposes: string[] = [];
export const DidomiProvider: IProvider = {
    name: 'Didomi',
    isInUse: () => !!window.Didomi,
    acceptAll: () => Didomi.setUserAgreeToAll(),
    rejectAll: () => Didomi.setUserDisagreeToAll(),
    getCategories: () =>
        Didomi.getRequiredPurposes().map((p) => {
            return { type: matchStringType(p.id), platformIdentifier: p.id };
        }),
    setCategoryConsent(category, consent) {
        const target = consent ? enabledPurposes : disabledPurposes;
        target.push(category.platformIdentifier);
    },
    flush() {
        Didomi.setUserConsentStatusForAll(enabledPurposes, disabledPurposes);
    },
};
