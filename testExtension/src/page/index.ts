import { CookieCategoryType } from 'engine/categories';
import { CookieEngine } from 'engine/entry';
import { EventType, listen, send } from 'common/messaging';
import { IActivationStatus } from 'popup/activationStatus';
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

CookieEngine.logProviderUsage(async (provider: string) => {
    activationStatus.activated = true;
    activationStatus.provider = provider;
});

if (window === window.top) {
    listen(EventType.RequestStatus, () => {
        send<IActivationStatus>(EventType.OnStatus, activationStatus);
    });
}

// and run
CookieEngine.runCookieCutter();
