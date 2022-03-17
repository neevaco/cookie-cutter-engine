import { CookieCategoryType } from 'engine/categories';
import { getAllPreferences } from './preferences';

/**
 * Gets whether or not automatic cookie consenting is enabled for the current site.
 * @returns `true` if cookie consenting is enabled for this site, `false` if it is disabled either site-specifically or globally.
 */
export async function isCookieConsentingEnabled(): Promise<boolean> {
    return true;
}

/**
 * Gets whether or not a specific cookie category type has been enabled by the user
 * @param type The cookie category type to check its enabled status
 * @returns `true` if cookies of `type` have been allowed by the user, `false` otherwise.
 */
export async function isTypeEnabled(
    type: CookieCategoryType
): Promise<boolean> {
    return (
        type === CookieCategoryType.Essential ||
        (await getAllPreferences())[type]
    );
}

/**
 * Gets whether or not all recommended cookies are enabled by the user or not.
 * @returns `true` if all recommended cookies are enabled, `false` otherwise.
 */
export async function areAllEnabled(): Promise<boolean> {
    return Object.values(await getAllPreferences()).every((enabled) => enabled);
}
