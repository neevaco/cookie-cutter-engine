// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

export enum EventType {
    RequestPreferences = 'neeva_reqPrefs',
    OnPreferences = 'neeva_onPrefs',
    RequestStatus = 'neeva_reqStatus',
    SendStatus = 'neeva_sendStatus',
    OnStatus = 'neeva_onStatus',
}

/**
 * Raises a new event
 * @param event The event to raise
 * @param data The event data to include
 */
export function send(event: EventType): void;
export function send<T>(event: EventType, data: T): void;
export function send<T>(event: EventType, data?: T): void {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
}

/**
 * Adds a new event listener
 * @param event The event to listen for
 * @param callback The callback to call when the event is raised
 * @param callOnce Whether or not to only call the callback once
 * @returns A method that can be called to remove the listener
 */
export function listen(
    event: EventType,
    callback: () => unknown,
    callOnce: boolean
): () => void;

export function listen(event: EventType, callback: () => unknown): () => void;

export function listen<T>(
    event: EventType,
    callback: (data: T) => unknown,
    callOnce: boolean
): () => void;

export function listen<T>(
    event: EventType,
    callback: (data: T) => unknown
): () => void;

export function listen<T>(
    event: EventType,
    callback: (data: T) => unknown,
    callOnce: boolean = false
): () => void {
    const listener = (e: CustomEvent): void => {
        callback(e.detail);
        if (callOnce) {
            window.removeEventListener(event, listener);
        }
    };

    window.addEventListener(event, listener);

    return (): void => window.removeEventListener(event, listener);
}
