// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
interface IEvidonVendor {
    CompanyId: number;
}
interface IEvidonCategory {
    vendors: IEvidonVendor[];
}

type EvidonCategoryList = {
    [categoryName: string]: IEvidonCategory;
};

declare const evidon: {
    notice: {
        declineGiven(): void;
        consentGiven(): void;
        activeTranslations: {
            categories: { [name: string]: any };
        };
        getOptOutCategories(
            callback: (error: any, categories: EvidonCategoryList) => any
        ): void;
        consentChanged(
            category: { [name: string]: boolean },
            vendorInfo: { [vendorId: string]: boolean },
            cookieInfo: Record<string, never>
        ): void;
    };
};

declare global {
    export interface Window {
        evidon?: typeof evidon;
    }
}

// implement provider
import { IProvider, matchStringType } from '../providers';

const preferences = {
    categories: {} as { [name: string]: any },
    cookies: {},
    vendors: {} as { [id: string]: any },
};
let didCategoryChange = false;

export const Evidon: IProvider = {
    name: 'Evidon',
    isInUse: () => !!window.evidon?.notice,
    acceptAll: () => evidon.notice.consentGiven(),
    rejectAll: () => evidon.notice.declineGiven(),
    getCategories: async () => {
        const categories = await new Promise<EvidonCategoryList>((resolve) =>
            evidon.notice.getOptOutCategories((_, cats) => resolve(cats))
        );

        return Object.keys(categories).map((name) => {
            return {
                platformIdentifier: {
                    name,
                    vendors: categories[name].vendors,
                },
                type: matchStringType(name),
            };
        });
    },
    setCategoryConsent(category, consent) {
        preferences.categories[category.platformIdentifier.name as string] =
            consent;

        category.platformIdentifier.vendors.forEach((vendor: IEvidonVendor) => {
            preferences.vendors[vendor.CompanyId.toString()] = consent;
        });
        didCategoryChange = true;
    },
    flush() {
        if (!didCategoryChange) {
            return;
        }

        evidon.notice.consentChanged(
            preferences.categories,
            preferences.vendors,
            preferences.cookies
        );
    },
};
