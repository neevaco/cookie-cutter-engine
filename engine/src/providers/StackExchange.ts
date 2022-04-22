// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// declare types
declare const StackExchange: {
    settings: {
        legal: {
            oneTrustConfigId: string;
        };
    };
};

declare global {
    export interface Window {
        StackExchange?: typeof StackExchange;
    }
}

import { IProvider } from '../providers';
import { OneTrustProvider } from './OneTrust';

export const StackExchangeProvider: IProvider = {
    name: 'Stack Exchange',
    isInUse: () => !!window.StackExchange,
    init() {
        return new Promise<void>((resolve) => {
            // pretty much a direct port from stack exchange stub.js
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('charset', 'UTF-8');
            script.setAttribute(
                'data-domain-script',
                StackExchange.settings.legal.oneTrustConfigId
            );
            script.setAttribute('async', 'true');
            script.setAttribute(
                'src',
                'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js'
            );
            script.onload = function (): void {
                const interval = window.setInterval(function () {
                    if (
                        Object.prototype.hasOwnProperty.call(window, 'OneTrust')
                    ) {
                        window.clearInterval(interval);
                        resolve();
                    }
                }, 20);
            };

            document.body.appendChild(script);
        });
    },
    acceptAll: OneTrustProvider.acceptAll,
    rejectAll: OneTrustProvider.rejectAll,
    getCategories: OneTrustProvider.getCategories,
    setCategoryConsent: OneTrustProvider.setCategoryConsent,
    flush() {
        OneTrustProvider.flush!();

        // hide stack exchange's custom popup
        const style = `.js-consent-banner { display: none !important; }`;
        const el = document.createElement('style');
        el.innerHTML = style;
        document.head.appendChild(el);
    },
};
