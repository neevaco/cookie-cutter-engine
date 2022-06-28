// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {
    areAllEnabled,
    flagSite,
    getHostname,
    incrementCookieStats,
    isCookieConsentingEnabled,
    isFlaggedSite,
    isTypeEnabled,
    logProviderUsage,
    notifyNoticeHandledOnPage,
} from './common';
import { createLogger, delay } from './util';
import providers, { IProvider } from './providers';

const logger = createLogger('index.ts');

// do it recursively so async/nesting is nicer
async function checkAll(attempts: number = 5): Promise<void> {
    // if we intended to flag this site, do so now.
    await checkPendingFlag();

    // only run if our preferences say we should
    if (!(await isCookieConsentingEnabled()) || (await isFlaggedSite())) {
        logger.warn(
            'Not running cookie cutter! Disabled by user or site flagged'
        );
        return;
    }

    // we may have loaded faster than the cookie consent script, so try a few attempts
    if (attempts === 0) {
        logger.log(
            'Cookie cutter failed to find a cookie notice after 5 attempts. Giving up'
        );
        return;
    }

    logger.log('Checking for cookie notices!', `${attempts} attempt(s) left`);
    for (let i = 0; i < providers.length; i++) {
        if (await handleProvider(providers[i])) {
            logger.log('Finished dismissing notice');
            if (window === window.top) {
                logger.log(
                    'Notifying that we handled a cookie notice in the main frame'
                );
                notifyNoticeHandledOnPage(true);
            }
            return;
        }
    }

    await delay(1000);
    checkAll(attempts - 1);
}

async function initProvider(provider: IProvider): Promise<void> {
    if (!provider.init) {
        return;
    }
    await provider.init();
}

async function flushProvider(provider: IProvider): Promise<void> {
    if (!provider.flush) {
        return;
    }
    await provider.flush();
}

async function handleProvider(provider: IProvider): Promise<boolean> {
    logger.log('Checking for provider:', provider.name);
    if (!(await provider.isInUse())) {
        logger.log(`Skipping ${provider.name}. Not detected on page`);
        return false;
    }

    logger.log('Cookie notice found!');
    // add to our activations and logs
    await incrementCookieStats();
    logProviderUsage(provider.name);

    // check for reload loops
    tryFlagReloads();

    // initialize the provider if necessary
    await initProvider(provider);
    logger.log('Initialized provider');

    // either we've accepted all cookies
    if (await areAllEnabled()) {
        logger.log('All cookies enabled, calling acceptAll()');
        await provider.acceptAll();
        await flushProvider(provider);
        return true;
    }

    // or we've rejected some (or all) cookies.
    // set up the provider by rejecting all to start.
    logger.log('Mix of cookies or none enabled, calling rejectAll()');
    await provider.rejectAll();

    try {
        // then go through each category and apply our preferences
        const categories = await provider.getCategories();
        categories.forEach(async (providerCategory) => {
            // check if consent is given. Either essential or our preferences include this category
            const consentGiven = await isTypeEnabled(providerCategory.type);
            // then set the consent for this category
            logger.log(
                `Setting consent to ${consentGiven} for category ${providerCategory.type}`
            );
            await provider.setCategoryConsent(providerCategory, consentGiven);
        });
    } catch (e) {
        // not all providers support categories, and can throw errors because of version mismatches
        logger.error(e);
    }

    await flushProvider(provider);
    return true;
}

// Try to flag if the site triggers a reload after being activated.
// If it does, stop activating the extension on that site.
const flagWaitMs = 2000; // time to wait before ignoring page reloads
const pendingFlag = 'neeva_pending_flag';
function tryFlagReloads(): void {
    const handler = async (): Promise<void> => {
        const hostname = await getHostname();
        if (!hostname) {
            return;
        }

        window.localStorage.setItem(pendingFlag, hostname);
    };

    window.addEventListener('beforeunload', handler);
    setTimeout(
        () => window.removeEventListener('beforeunload', handler),
        flagWaitMs
    );
}

async function checkPendingFlag(): Promise<void> {
    const pending: string | null = window.localStorage.getItem(pendingFlag);
    if (pending) {
        logger.log('Reload loop detected! Flagging site.');
        window.localStorage.removeItem(pendingFlag);
        await flagSite(pending);
    }
}

export const cookieCut = checkAll;
