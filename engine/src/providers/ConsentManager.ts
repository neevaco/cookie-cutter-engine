// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

declare const cmpmngr: {
    purposes: { getName(): string; id: string }[];
    setPurpose(id: string, consent: 0 | 1): boolean;
    setConsentViaBtn(consent: 0 | 1): void;
    getConsentStatus(): number;
    cnfDone: boolean;
};

declare global {
    export interface Window {
        cmpmngr?: typeof cmpmngr;
    }
}

import { IProvider, matchStringType } from '../providers';
import { delay } from '../util';

const waitTime = 100;

export const ConsentManager: IProvider = {
    name: 'Consent Manager',
    isInUse: () => !!window.cmpmngr?.setPurpose,
    async init() {
        while (!cmpmngr.cnfDone) {
            await delay(waitTime);
        }
    },
    acceptAll: () => cmpmngr.setConsentViaBtn(1),
    rejectAll: () => cmpmngr.setConsentViaBtn(0),
    getCategories: () =>
        cmpmngr.purposes.map((p) => {
            return {
                platformIdentifier: p.id,
                type: matchStringType(p.getName()),
            };
        }),
    setCategoryConsent(category, consent) {
        cmpmngr.setPurpose(category.platformIdentifier, consent ? 1 : 0);
    },
};
