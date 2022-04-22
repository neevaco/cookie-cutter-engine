// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const sp: {
    saveAllConsents(target: string, consentGiven?: boolean): void;
};

declare global {
    export interface Window {
        sp?: typeof sp;
        initialize_secure_privacy(): void;
    }
}

import { ICookieCategory, IProvider, matchStringType } from '../providers';
import { delay } from '../util';

function getBannerFrameDocument(): Document | null {
    // all of the categories are in an iframe. go figure
    const bannerFrame: HTMLIFrameElement | null = document.getElementById(
        'ifrmPrivacyBanner'
    ) as HTMLIFrameElement;
    return bannerFrame?.contentDocument;
}

function tryUntilSuccess(action: () => unknown): Promise<void> {
    // todo: refractor and dont loop forever
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve) => {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                action();
                resolve();
                return;
            } catch {
                await delay(1000);
                // ignored
            }
        }
    });
}

export const SecurePrivacy: IProvider = {
    name: 'SecurePrivacy',
    isInUse: () => !!window.initialize_secure_privacy,
    acceptAll: () =>
        tryUntilSuccess(() => sp.saveAllConsents('cookieBanner', true)),
    rejectAll: () =>
        tryUntilSuccess(() => sp.saveAllConsents('cookieBanner', false)),
    async getCategories(): Promise<ICookieCategory[]> {
        const bannerDoc = getBannerFrameDocument();

        // SP provides granular control over specific "plugins"
        // we don't really care though, so just group them into broad categories
        const toggles = bannerDoc?.querySelectorAll('input[id^=tracker]');
        const categories: ICookieCategory[] = [];

        // make sure we have toggles. if not, we're probably still initializing.
        // todo: infinitely recursive. bad? yes.
        if (!toggles || toggles.length === 0) {
            await delay(1000);
            return await this.getCategories();
        }

        // then split our toggles into categoires
        toggles.forEach((toggle) => {
            const matchingCategoryType = matchStringType(
                toggle.getAttribute('data-compliancetype')
            );
            categories.push({
                platformIdentifier: toggle.id,
                type: matchingCategoryType,
            });
        });

        return categories;
    },
    setCategoryConsent(category, consent) {
        // find that element and check it (or not)
        const bannerDoc = getBannerFrameDocument();
        const toggle: HTMLInputElement = bannerDoc?.getElementById(
            category.platformIdentifier
        ) as HTMLInputElement;
        toggle.checked = consent;

        sp.saveAllConsents('privacyBanner', false);
    },
};
