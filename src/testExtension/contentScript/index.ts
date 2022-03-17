import { EventType, listen, send } from 'common/messaging';
import { getAllPreferences } from 'common/preferences';

const scriptUrl = chrome.runtime.getURL('page.js');

// inject a script so we can access window objects
const element = document.createElement('script');
element.src = scriptUrl;
document.head.appendChild(element);

// so we can get preferences from a page script.
listen(EventType.RequestPreferences, async () => {
    send(EventType.OnPreferences, await getAllPreferences());
});
