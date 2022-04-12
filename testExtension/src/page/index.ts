import { CookieCategoryType } from 'engine/categories';
import { CookieEngine } from 'engine/common';
import { EventType, listen, send } from 'common/messaging';
import { IActivationStatus } from 'testExtension/popup/activationStatus';
import { IProvider } from 'engine/providers';
import { getAllPreferences, getHostname } from 'common/preferences';

// setup
CookieEngine.flagSite(async () => {
    /* can make testing difficult, so disable feature */
});
CookieEngine.incrementCookieStats(async () => {});
CookieEngine.isCookieConsentingEnabled(async () => true);
CookieEngine.isFlaggedSite(async () => false);
CookieEngine.notifyNoticeHandledOnPage(async () => {});

CookieEngine.getHostname(getHostname);

// prefs
CookieEngine.areAllEnabled(async () =>
    Object.values(await getAllPreferences()).every((enabled) => enabled)
);
CookieEngine.isTypeEnabled(async (type: CookieCategoryType) => {
    return (
        type === CookieCategoryType.Essential ||
        (await getAllPreferences())[type]
    );
});

// stats
const activationStatus: IActivationStatus = {
    activated: false,
};

CookieEngine.logProviderUsage(async (provider: IProvider) => {
    activationStatus.activated = true;
    activationStatus.provider = provider.name;
});

if (window === window.top) {
    listen(EventType.RequestStatus, () => {
        send<IActivationStatus>(EventType.OnStatus, activationStatus);
    });
}

// and run
CookieEngine.runCookieCutter();
