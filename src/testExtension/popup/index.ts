import { CookieCategoryType } from 'common/cookies';
import { getAllPreferences, setChromeStorage } from 'common/preferences';

async function populatePreferences(): Promise<void> {
    const prefs = await getAllPreferences();

    const container = document.getElementById('preferences');
    container.innerHTML = '';
    Object.keys(prefs).forEach((key) => {
        const intKey = parseInt(key);
        container.appendChild(createCheckbox(intKey, prefs[intKey]));
    });
}

function createCheckbox(index: number, checked: boolean): HTMLElement {
    const container = document.createElement('div');
    container.className = 'checkbox-container';

    const checkbox = document.createElement('input');
    checkbox.id = 'checkbox-' + index;
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.appendChild(document.createTextNode(CookieCategoryType[index]));

    checkbox.onchange = async (): Promise<void> => {
        const prefs = await getAllPreferences();
        prefs[index] = checkbox.checked;
        await setChromeStorage('preferences', prefs);
    };

    container.appendChild(checkbox);
    container.appendChild(label);
    return container;
}

populatePreferences();
