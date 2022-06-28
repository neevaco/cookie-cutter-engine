// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CookieCategoryType } from './categories';
import { cookieCut } from './index';

export { CookieCategoryType } from './categories';

/**
 * @public
 */
export class CookieEngine {
    /**
     * @internal
     */
    public static _properties = {
        verbose: false,
    };

    /**
     * @internal
     */
    public static _methods = {
        areAllEnabled(): Promise<boolean> {
            throw new Error('Undefined method areAllEnabled');
        },
        isCookieConsentingEnabled(): Promise<boolean> {
            throw new Error('Undefined method isCookieConsentingEnabled');
        },
        isTypeEnabled(type: CookieCategoryType): Promise<boolean> {
            throw new Error('Undefined method isTypeEnabled');
        },
        getHostname(): Promise<string | null> {
            throw new Error('Undefined method getHostname');
        },
        flagSite(hostname: string): Promise<void> {
            throw new Error('Undefined method flagSite');
        },
        isFlaggedSite(): Promise<boolean> {
            throw new Error('Undefined method isFlaggedSite');
        },
        incrementCookieStats(): Promise<void> {
            throw new Error('Undefined method incrementCookieStats');
        },
        notifyNoticeHandledOnPage(dismissed: boolean): void {
            throw new Error('Undefined method notifyNoticeHandledOnPage');
        },
        logProviderUsage(providerName: string): Promise<void> {
            throw new Error('Undefined method logProviderUsage');
        },
    };

    public static useVerboseLogging(): void {
        CookieEngine._properties.verbose = true;
    }

    public static areAllEnabled(
        handler: typeof CookieEngine._methods.areAllEnabled
    ): void {
        CookieEngine._methods.areAllEnabled = handler;
    }
    public static isCookieConsentingEnabled(
        handler: typeof CookieEngine._methods.isCookieConsentingEnabled
    ): void {
        CookieEngine._methods.isCookieConsentingEnabled = handler;
    }
    public static isTypeEnabled(
        handler: typeof CookieEngine._methods.isTypeEnabled
    ): void {
        CookieEngine._methods.isTypeEnabled = handler;
    }
    public static getHostname(
        handler: typeof CookieEngine._methods.getHostname
    ): void {
        CookieEngine._methods.getHostname = handler;
    }
    public static flagSite(
        handler: typeof CookieEngine._methods.flagSite
    ): void {
        CookieEngine._methods.flagSite = handler;
    }
    public static isFlaggedSite(
        handler: typeof CookieEngine._methods.isFlaggedSite
    ): void {
        CookieEngine._methods.isFlaggedSite = handler;
    }
    public static incrementCookieStats(
        handler: typeof CookieEngine._methods.incrementCookieStats
    ): void {
        CookieEngine._methods.incrementCookieStats = handler;
    }
    public static notifyNoticeHandledOnPage(
        handler: typeof CookieEngine._methods.notifyNoticeHandledOnPage
    ): void {
        CookieEngine._methods.notifyNoticeHandledOnPage = handler;
    }
    public static logProviderUsage(
        handler: typeof CookieEngine._methods.logProviderUsage
    ): void {
        CookieEngine._methods.logProviderUsage = handler;
    }

    public static runCookieCutter(): void {
        cookieCut();
    }
}
