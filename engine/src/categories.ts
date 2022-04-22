// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * A list of overarching cookie category types that the extension can automate the enabling or disabling of.
 * @public
 */
export enum CookieCategoryType {
    Essential,
    Preferences,
    Marketing,
    Analytics,
    Social,
    DoNotSell,
    Unknown,
}
