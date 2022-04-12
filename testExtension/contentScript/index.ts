import { EventType, listen, send } from 'common/messaging';
import { IActivationStatus } from '../popup/activationStatus';
import { getAllPreferences } from '../src/common/preferences';

const scriptUrl = chrome.runtime.getURL('page.js');

// inject a script so we can access window objects
const element = document.createElement('script');
element.src = scriptUrl;
document.head.appendChild(element);

// so we can get preferences from a page script.
listen(EventType.RequestPreferences, async () => {
    send(EventType.OnPreferences, await getAllPreferences());
});

// to send info over to the popup
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.event === 'request_status' && window.top === window.self) {
        listen<IActivationStatus>(EventType.OnStatus, sendResponse, true);
        send(EventType.RequestStatus);
        return true;
    }
    return false;
});
