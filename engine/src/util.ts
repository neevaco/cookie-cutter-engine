// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { isVerbose } from './common';

export type MaybePromise<T> = Promise<T> | T;

export function delay(timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeMs));
}

export interface Logger {
    log(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
}

export function createLogger(file: string): Logger {
    return {
        log(...message: any[]): void {
            if (isVerbose()) {
                console.log(`CookieCutterEngine(${file})`, ...message);
            }
        },
        warn(...message: any[]): void {
            if (isVerbose()) {
                console.warn(`CookieCutterEngine(${file})`, ...message);
            }
        },
        error(...message: any[]): void {
            if (isVerbose()) {
                console.error(`CookieCutterEngine(${file})`, ...message);
            }
        },
    };
}
