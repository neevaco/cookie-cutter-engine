import { EventType, listen, send } from './messaging';
import { IActivationStatus } from 'testExtension/popup/activationStatus';
import { IProvider } from 'engine/providers';

const activationStatus: IActivationStatus = {
    activated: false,
};

export async function logProviderUsage(provider: IProvider): Promise<void> {
    activationStatus.activated = true;
    activationStatus.provider = provider.name;
}

listen(EventType.RequestStatus, () => {
    send<IActivationStatus>(EventType.OnStatus, activationStatus);
});
