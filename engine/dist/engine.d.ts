/**
 * A list of overarching cookie category types that the extension can automate the enabling or disabling of.
 * @public
 */
export declare enum CookieCategoryType {
    Essential = 0,
    Preferences = 1,
    Marketing = 2,
    Analytics = 3,
    Social = 4,
    DoNotSell = 5,
    Unknown = 6
}

/**
 * @public
 */
export declare class CookieEngine {
    /**
     * @internal
     */
    static _properties: {
        verbose: boolean;
    };
    /**
     * @internal
     */
    static _methods: {
        areAllEnabled(): Promise<boolean>;
        isCookieConsentingEnabled(): Promise<boolean>;
        isTypeEnabled(type: CookieCategoryType): Promise<boolean>;
        getHostname(): Promise<string | null>;
        flagSite(hostname: string): Promise<void>;
        isFlaggedSite(): Promise<boolean>;
        incrementCookieStats(): Promise<void>;
        notifyNoticeHandledOnPage(dismissed: boolean): void;
        logProviderUsage(providerName: string): Promise<void>;
    };
    static useVerboseLogging(): void;
    static areAllEnabled(handler: typeof CookieEngine._methods.areAllEnabled): void;
    static isCookieConsentingEnabled(handler: typeof CookieEngine._methods.isCookieConsentingEnabled): void;
    static isTypeEnabled(handler: typeof CookieEngine._methods.isTypeEnabled): void;
    static getHostname(handler: typeof CookieEngine._methods.getHostname): void;
    static flagSite(handler: typeof CookieEngine._methods.flagSite): void;
    static isFlaggedSite(handler: typeof CookieEngine._methods.isFlaggedSite): void;
    static incrementCookieStats(handler: typeof CookieEngine._methods.incrementCookieStats): void;
    static notifyNoticeHandledOnPage(handler: typeof CookieEngine._methods.notifyNoticeHandledOnPage): void;
    static logProviderUsage(handler: typeof CookieEngine._methods.logProviderUsage): void;
    static runCookieCutter(): void;
}

export { }
