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
import { delay } from './util';
import providers, { IProvider } from './providers';

// do it recursively so async/nesting is nicer
async function checkAll(attempts: number = 5): Promise<void> {
    // if we intended to flag this site, do so now.
    await checkPendingFlag();

    // only run if our preferences say we should
    if (!(await isCookieConsentingEnabled()) || (await isFlaggedSite())) {
        return;
    }

    // we may have loaded faster than the cookie consent script, so try a few attempts
    if (attempts === 0) {
        return;
    }

    for (let i = 0; i < providers.length; i++) {
        if (await handleProvider(providers[i])) {
            if (window === window.top) {
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
    if (!(await provider.isInUse())) {
        return false;
    }

    // add to our activations and logs
    await incrementCookieStats();
    logProviderUsage(provider.name);

    // check for reload loops
    tryFlagReloads();

    // initialize the provider if necessary
    await initProvider(provider);

    // either we've accepted all cookies
    if (await areAllEnabled()) {
        await provider.acceptAll();
        await flushProvider(provider);
        return true;
    }

    // or we've rejected some (or all) cookies.
    // set up the provider by rejecting all to start.
    await provider.rejectAll();

    try {
        // then go through each category and apply our preferences
        const categories = await provider.getCategories();
        categories.forEach(async (providerCategory) => {
            // check if consent is given. Either essential or our preferences include this category
            const consentGiven = await isTypeEnabled(providerCategory.type);
            // then set the consent for this category
            await provider.setCategoryConsent(providerCategory, consentGiven);
        });
    } catch (e) {
        // not all providers support categories, and can throw errors because of version mismatches
        console.error(e);
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
        window.localStorage.removeItem(pendingFlag);
        await flagSite(pending);
    }
}

export const cookieCut = checkAll;
