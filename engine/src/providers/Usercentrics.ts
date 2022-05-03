// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// https://docs.usercentrics.com/#/cmp-v2-ui-api

import { IProvider, matchStringType } from '../providers';

declare const UC_UI: {
    acceptAllConsents(): Promise<void>;
    denyAllConsents(): Promise<void>;
    rejectService(id: string): Promise<void>;
    acceptService(id: string): Promise<void>;
    getServicesBaseInfo(): {
        categorySlug: string;
        id: string;
    }[];
    closeCMP(): void;
};

declare global {
    export interface Window {
        UC_UI?: typeof UC_UI;
    }
}

export const Usercentrics: IProvider = {
    name: 'Usercentrics',
    isInUse: () => !!window.UC_UI?.acceptAllConsents,
    acceptAll: () => UC_UI.acceptAllConsents(),
    rejectAll: () => UC_UI.denyAllConsents(),
    getCategories: () =>
        UC_UI.getServicesBaseInfo().map((s) => {
            return {
                platformIdentifier: s.id,
                type: matchStringType(s.categorySlug),
            };
        }),
    setCategoryConsent(category, consent) {
        return consent
            ? UC_UI.acceptService(category.platformIdentifier)
            : UC_UI.rejectService(category.platformIdentifier);
    },
    flush() {
        UC_UI.closeCMP();
    },
};
