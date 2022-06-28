// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { CookieEngine } from './entry';

export function areAllEnabled(
    ...params: Parameters<typeof CookieEngine._methods.areAllEnabled>
): ReturnType<typeof CookieEngine._methods.areAllEnabled> {
    return CookieEngine._methods.areAllEnabled(...params);
}
export function isCookieConsentingEnabled(
    ...params: Parameters<
        typeof CookieEngine._methods.isCookieConsentingEnabled
    >
): ReturnType<typeof CookieEngine._methods.isCookieConsentingEnabled> {
    return CookieEngine._methods.isCookieConsentingEnabled(...params);
}
export function isTypeEnabled(
    ...params: Parameters<typeof CookieEngine._methods.isTypeEnabled>
): ReturnType<typeof CookieEngine._methods.isTypeEnabled> {
    return CookieEngine._methods.isTypeEnabled(...params);
}
export function getHostname(
    ...params: Parameters<typeof CookieEngine._methods.getHostname>
): ReturnType<typeof CookieEngine._methods.getHostname> {
    return CookieEngine._methods.getHostname(...params);
}
export function flagSite(
    ...params: Parameters<typeof CookieEngine._methods.flagSite>
): ReturnType<typeof CookieEngine._methods.flagSite> {
    return CookieEngine._methods.flagSite(...params);
}
export function isFlaggedSite(
    ...params: Parameters<typeof CookieEngine._methods.isFlaggedSite>
): ReturnType<typeof CookieEngine._methods.isFlaggedSite> {
    return CookieEngine._methods.isFlaggedSite(...params);
}
export function incrementCookieStats(
    ...params: Parameters<typeof CookieEngine._methods.incrementCookieStats>
): ReturnType<typeof CookieEngine._methods.incrementCookieStats> {
    return CookieEngine._methods.incrementCookieStats(...params);
}
export function notifyNoticeHandledOnPage(
    ...params: Parameters<
        typeof CookieEngine._methods.notifyNoticeHandledOnPage
    >
): ReturnType<typeof CookieEngine._methods.notifyNoticeHandledOnPage> {
    return CookieEngine._methods.notifyNoticeHandledOnPage(...params);
}
export function logProviderUsage(
    ...params: Parameters<typeof CookieEngine._methods.logProviderUsage>
): ReturnType<typeof CookieEngine._methods.logProviderUsage> {
    return CookieEngine._methods.logProviderUsage(...params);
}

export function isVerbose(): boolean {
    return CookieEngine._properties.verbose;
}
